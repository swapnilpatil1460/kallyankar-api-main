const { getCorsOrigins, getJwtSecret } = require("../src/config/env");

describe("Environment Config Tests", () => {
  it("parses configured CORS origins", () => {
    const previous = process.env.CORS_ORIGIN;
    process.env.CORS_ORIGIN = "https://app.example.com, http://localhost:5173";

    expect(getCorsOrigins()).toEqual([
      "https://app.example.com",
      "http://localhost:5173",
    ]);

    if (previous === undefined) delete process.env.CORS_ORIGIN;
    else process.env.CORS_ORIGIN = previous;
  });

  it("requires a JWT secret", () => {
    const previous = process.env.JWT_SECRET;
    delete process.env.JWT_SECRET;
    
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);

    process.env.JWT_SECRET = "test-secret";
    expect(getJwtSecret()).toBe("test-secret");

    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  });
});
