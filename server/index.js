require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const {
    typeDefs: userTypeDefs,
    resolvers: userResolvers
} = require("./schemas/user");

const {
    typeDefs: postTypeDefs,
    resolvers: postResolvers
} = require("./schemas/post");

const server = new ApolloServer({
    typeDefs: [userTypeDefs, postTypeDefs],
    resolvers: [userResolvers, postResolvers]
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

async function runServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 },
        context: ({ req }) => {
            console.log("auth jalan");
        }
    });

    console.log(`🚀  Server ready at: ${url}`);
}

runServer()