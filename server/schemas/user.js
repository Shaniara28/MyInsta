
const { confirmPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const UserModel = require("../models/userModel");

const typeDefs = `#graphql
    type User {
        _id: ID!
        name: String
        username: String!
        email: String!
    }

    type LoginResponse{
        token: String,
        message: String
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
        ): LoginResponse
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

            const data = await UserModel.register({
                name,
                username: username.toLowerCase(),
                email: email.toLowerCase(),
                password,
            });

            return data;
        },

        login: async (_, args) => {
            const { username, password } = args;

            if (!username || !password) {
                throw new Error("Username & password is required");
            }

            const user = await UserModel.findByUsername(username.toLowerCase());

            if (!user) {
                throw new Error("Invalid username or password");
            }

            const isPasswordValid = confirmPassword(password, user.password)

            if (!isPasswordValid) {
                throw new Error("Invalid username or password");
            }

            const payload = {
                id: user._id,
                username: user.username,
                email: user.email
            }

            const token = signToken(payload)

            return {
                token,
                message: "Login Successfully"
            }
        }
    },
};

module.exports = { typeDefs, resolvers };
