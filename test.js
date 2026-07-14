const assert = require("node:assert/strict");
const test = require("node:test");
const { getCorsOrigins, getJwtSecret } = require("./src/config/env");

test("parses configured CORS origins", () => {
  const previous = process.env.CORS_ORIGIN;
  process.env.CORS_ORIGIN = "https://app.example.com, http://localhost:5173";

  assert.deepEqual(getCorsOrigins(), [
    "https://app.example.com",
    "http://localhost:5173",
  ]);

  if (previous === undefined) delete process.env.CORS_ORIGIN;
  else process.env.CORS_ORIGIN = previous;
});

test("requires a JWT secret", () => {
  const previous = process.env.JWT_SECRET;
  delete process.env.JWT_SECRET;
  assert.throws(getJwtSecret, /JWT_SECRET/);

  process.env.JWT_SECRET = "test-secret";
  assert.equal(getJwtSecret(), "test-secret");

  if (previous === undefined) delete process.env.JWT_SECRET;
  else process.env.JWT_SECRET = previous;
});
