const Post = require("../../models/Post");
const checkAuth = require("../../util/checkAuth");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
	Mutation: {
		createComment: async (_, { postId, body }, context) => {
			const { username } = checkAuth(context);
			if (body.trim() === "") {
				throw new UserInputError("Pusty komentarz", {
					errors: {
						body: "Komentarz nie może być pusty",
					},
				});
			}

			const post = await Post.findById(postId);

			if (post) {
				// Add to the top - unshift.
				post.comments.unshift({
					body,
					username,
					createdAt: new Date().toISOString(),
				});
				await post.save();
				return post;
			} else throw new UserInputError("Nie znaleziono wpisu");
		},

		async deleteComment(_, { postId, commentId }, context) {
			const { username } = checkAuth(context);

			const post = await Post.findById(postId);

			if (post) {
				const commentIndex = post.comments.findIndex((c) => c.id === commentId);

				// Check if it the owner of comment, if so we can delete it.
				if (post.comments[commentIndex].username === username) {
					post.comments.splice(commentIndex, 1);
					await post.save();
					return post;
				} else {
					throw new AuthenticationError("Akcja niedozwolona");
				}
			} else {
				throw new UserInputError("Nie znaleziono wpisu");
			}
		},
	},
};
