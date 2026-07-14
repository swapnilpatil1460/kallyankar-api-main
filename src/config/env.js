const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET must be configured before starting the API.");
  return secret;
};

const getCorsOrigins = () => {
  if (!process.env.CORS_ORIGIN) return ["http://localhost:5173"];
  return process.env.CORS_ORIGIN.split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
};

module.exports = { getCorsOrigins, getJwtSecret };
