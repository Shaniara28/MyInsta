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
const { verifyToken } = require('./helpers/jwt');
const UserModel = require('./models/userModel');

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

            return {
                message: "Hello World",
                auth: async () => {

                    const { authorization } = req.headers;

                    if (!authorization) {
                        throw new Error("Please login first");
                    }

                    const [type, token] = authorization.split(" ");

                    if (type !== "Bearer" || !token) {
                        throw new Error("Invalid authorization header");
                    }

                    const payload = verifyToken(token);

                    if (!payload) {
                        throw new Error("Invalid token");
                    }

                    const user = await UserModel.findById(payload.id);

                    if (!user) {
                        throw new Error("User not found");
                    }

                    return user;
                }
            }
        }
    });

    console.log(`🚀  Server ready at: ${url}`);
}

runServer()