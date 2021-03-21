const jsonwebtoken = require("jsonwebtoken");
const { secret_key } = require("../config");
const { AuthenticationError } = require("apollo-server");

module.exports = (context) => {
	const authHeader = context.req.headers.authorization;
	if (authHeader) {
		const token = authHeader.split("Bearer ")[1];
		if (token) {
			try {
				const user = jsonwebtoken.verify(token, secret_key);
				return user;
			} catch (error) {
				throw new AuthenticationError("Invalid/Expired token.");
			}
		}
		throw new Error("Authentication token must be 'Bearer [token]");
	}
	throw new Error("Authorization header must be provided.");
};
