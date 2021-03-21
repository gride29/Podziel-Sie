const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB } = require("./config.js");

const pubsub = new PubSub();

const server = new ApolloServer({
	typeDefs,
	resolvers,
	// Take request and forward it into context.
	context: ({ req }) => ({ req, pubsub }),
});

mongoose.connect(MONGODB, { useNewUrlParser: true }).then(() => {
	console.log("MongoDB connected!");
	return server.listen({ port: 5000 }).then((result) => {
		console.log(`Server running at ${result.url}`);
	});
});
