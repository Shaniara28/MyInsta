
const { confirmPassword } = require("../helpers/bcrypt");
const { signToken } = require("../helpers/jwt");
const UserModel = require("../models/userModel");
const FollowModel = require("../models/followModel");

const typeDefs = `#graphql
    type User {
        _id: ID!
        name: String
        username: String!
        email: String!
        followers: [User!]!
        following: [User!]!
    }

    type LoginResponse{
        token: String,
        message: String
    }

    type FollowResponse {
        message: String!
        isFollowing: Boolean!
    }

    type Query {
        health: String

        searchUser(input: String!): [User]

        getUserById(id: ID!): User
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

        followUser(userId: ID!): FollowResponse!
    }
`;

const resolvers = {
    Query: {
        health: () => {
            return "Server is running";
        },

        searchUser: async (_, args, contextValue) => {
            await contextValue.auth()

            const { input } = args;

            if (!input || !input.trim()) {
                throw new Error("Search keyword is required")
            }

            const users = await UserModel.search(input);

            return users
        },

        getUserById: async (_, args, contextValue) => {
            await contextValue.auth();

            const { id } = args;

            if (!id) {
                throw new Error("User ID is required");
            }

            const user = await UserModel.findById(id);

            if (!user) {
                throw new Error("User not found");
            }

            return user;
        }
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
        },

        followUser: async (_, args, contextValue) => {
            const user = await contextValue.auth();

            const { userId } = args;
            const followerId = user._id || user.id;

            if (!followerId) {
                throw new Error("User ID not found");
            }

            const result = await FollowModel.toggleFollow({
                followerId,
                followingId: userId,
            });

            return result;
        }
    },
};

module.exports = { typeDefs, resolvers };
