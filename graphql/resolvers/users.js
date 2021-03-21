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
				throw new UserInputError("Errors", { errors });
			}

			const user = await User.findOne({ username });

			if (!user) {
				errors.general = "User not found.";
				throw new UserInputError("User not found.", { errors });
			}

			const match = await bcrypt.compare(password, user.password);
			if (!match) {
				errors.general = "Wrong credentials.";
				throw new UserInputError("Wrong credentials.", { errors });
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
				throw new UserInputError("Errors", { errors });
			}
			const user = await User.findOne({ username });
			if (user) {
				throw new UserInputError("This username has already been taken.", {
					errors: {
						username: "This username has already been taken.",
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
