
const UserModel = require("../models/userModel");
const validator = require("email-validator");

const typeDefs = `#graphql
    type User {
        _id: ID!
        name: String
        username: String!
        email: String!
    }

    type Query {
        health: String
    }

    type Mutation {
        register(
            name: String
            username: String!
            email: String!
            password: String!
        ): User!

        login(
            username: String!
            password: String!
        ): User!
    }
`;

const resolvers = {
    Query: {
        health: () => {
            return "Server is running";
        },
    },

    Mutation: {
        register: async (_, args) => {
            const { name, username, email, password } = args;

            const isEmailValid = validator.validate(email);

            if (!isEmailValid) {
                throw new Error("Invalid email format");
            }

            const data = await UserModel.register({
                name,
                username,
                email: email.toLowerCase(),
                password,
            });

            return data;
        },

        login: async (_, args) => {
            const { username, password } = args;

            const data = await UserModel.login({
                username,
                password,
            });

            return data;
        }
    },
};

module.exports = { typeDefs, resolvers };
