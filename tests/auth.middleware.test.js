const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const auth = require("../src/middleware/auth");
const Admin = require("../src/models/admin");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await Admin.deleteMany({});
  process.env.JWT_SECRET = "testsecret123";
});

describe("Auth Middleware Test Suite", () => {
  it("should authenticate a valid token and attach user to req", async () => {
    const admin = new Admin({
      name: "Auth",
      last_name: "Test",
      email: "auth@test.com",
      password: "StrongSecret123!",
      role: "Admin",
      createdBy: "System"
    });
    await admin.save();
    const { token } = await admin.generateAuthToken();

    // Mock Express req, res, next
    const req = {
      header: jest.fn().mockReturnValue(`Bearer ${token}`)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user._id.toString()).toBe(admin._id.toString());
    expect(req.token).toBe(token);
  });

  it("should fail authentication if token is missing", async () => {
    const req = {
      header: jest.fn().mockReturnValue(undefined)
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "Please authenticate." });
  });

  it("should fail authentication if token is invalid", async () => {
    const req = {
      header: jest.fn().mockReturnValue("Bearer invalid.jwt.token")
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn()
    };
    const next = jest.fn();

    await auth(req, res, next);

    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.send).toHaveBeenCalledWith({ error: "Please authenticate." });
  });
});
