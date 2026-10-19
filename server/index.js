require('dotenv').config();

const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const {
    typeDefs: bookTypeDefs,
    resolvers: bookResolvers
} = require("./schemas/book")

const server = new ApolloServer({
    typeDefs: [bookTypeDefs],
    resolvers: [bookResolvers]
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests

async function runServer() {
    const { url } = await startStandaloneServer(server, {
        listen: { port: 3000 },
    });

    console.log(`🚀  Server ready at: ${url}`);
}

runServer()