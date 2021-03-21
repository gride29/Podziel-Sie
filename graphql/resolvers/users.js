const User = require("../../models/User");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const { secret_key } = require("../../config");
const { UserInputError } = require("apollo-server");
const {
	validateRegisterInput,
	validateLoginInput,
} = require("../../util/validators");
const user = require("../../models/User");

generateToken = (user) => {
	return jsonwebtoken.sign(
		{
			id: user.id,
			email: user.email,
			username: user.username,
		},
		secret_key,
		{ expiresIn: "1h" }
	);
};

module.exports = {
	Mutation: {
		async login(_, { username, password }) {
			const { errors, valid } = validateLoginInput(username, password);

			if (!valid) {
				throw new UserInputError("Błędy", { errors });
			}

			const user = await User.findOne({ username });

			if (!user) {
				errors.general = "Nie znaleziono użytkownika";
				throw new UserInputError("Nie znaleziono użytkownika", { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = "Nieprawidłowa nazwa użytkownika lub hasło";
				throw new UserInputError("Nieprawidłowa nazwa użytkownika lub hasło", {
					errors,
				});
			}

			const token = generateToken(user);

			return {
				// ._doc - Access raw document directly.
				...user._doc,
				id: user._id,
				token,
			};
		},

		async register(
			_,
			{ registerInput: { username, email, password, confirmPassword } },
			context,
			info
		) {
			const { valid, errors } = validateRegisterInput(
				username,
				email,
				password,
				confirmPassword
			);
			if (!valid) {
				throw new UserInputError("Błędy", { errors });
			}
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("Ta nazwa użytkownika jest już zajęta", {
					errors: {
						username: "Ta nazwa użytkownika jest już zajęta",
					},
				});
			}
			password = await bcrypt.hash(password, 12);
			const newUser = new User({
				email,
				username,
				password,
				createdAt: new Date().toISOString(),
			});
			const result = await newUser.save();
			const token = generateToken(result);

			return {
				...result._doc,
				id: result._id,
				token,
			};
		},
	},
};
