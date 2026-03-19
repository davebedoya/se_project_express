const { JWT_SECRET = "super-strong-secret" } = process.env;
//id process.env does not have a secrtye then go back to deafult or fallback of "Super-strong-secrety"
// module.exports = {
//   JWT_SECRET: "dev-secret-key",
// };

module.exports = {
  JWT_SECRET,
};
