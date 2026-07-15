const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const Admin = require("../src/models/admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  
  // Connect Mongoose to the in-memory DB
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
  // Clear the database before each test
  await Admin.deleteMany({});
  
  // Set the dummy secret for testing
  process.env.JWT_SECRET = "testsecret123";
});

describe("Admin Model Test Suite", () => {
  it("should create & save a valid admin", async () => {
    const validAdmin = new Admin({
      name: "Test",
      last_name: "Admin",
      email: "admin@test.com",
      password: "StrongSecret123!",
      role: "Admin",
      createdBy: "System"
    });
    
    const savedAdmin = await validAdmin.save();
    
    expect(savedAdmin._id).toBeDefined();
    expect(savedAdmin.name).toBe("Test");
    expect(savedAdmin.email).toBe("admin@test.com");
  });

  it("should fail validation if email is invalid", async () => {
    const invalidAdmin = new Admin({
      name: "Test",
      last_name: "Admin",
      email: "not-an-email",
      password: "StrongSecret123!",
      role: "Admin",
      createdBy: "System"
    });
    
    let err;
    try {
      await invalidAdmin.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.email).toBeDefined();
  });

  it("should fail validation if password contains 'password'", async () => {
    const invalidAdmin = new Admin({
      name: "Test",
      last_name: "Admin",
      email: "admin2@test.com",
      password: "myPassword123!",
      role: "Admin",
      createdBy: "System"
    });
    
    let err;
    try {
      await invalidAdmin.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(err.errors.password).toBeDefined();
  });

  it("should hash the password before saving", async () => {
    const password = "SuperSecretSecret123!";
    const admin = new Admin({
      name: "Hash",
      last_name: "Test",
      email: "hash@test.com",
      password: password,
      role: "Admin",
      createdBy: "System"
    });
    
    const savedAdmin = await admin.save();
    
    expect(savedAdmin.password).not.toBe(password);
    const isMatch = await bcrypt.compare(password, savedAdmin.password);
    expect(isMatch).toBe(true);
  });

  it("should generate a valid JWT auth token", async () => {
    const admin = new Admin({
      name: "Token",
      last_name: "Test",
      email: "token@test.com",
      password: "StrongSecret123!",
      role: "Admin",
      createdBy: "System"
    });
    
    await admin.save();
    const { token, expiresInSeconds } = await admin.generateAuthToken();
    
    expect(token).toBeDefined();
    expect(expiresInSeconds).toBe(2 * 60 * 60); // 2 hours
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    expect(decoded._id).toBe(admin._id.toString());
  });
});
