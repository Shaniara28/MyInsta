const PostModel = require("../models/postModel");

const typeDefs = `#graphql

  type Post {
      _id: ID
      content: String!
      tags: [String]
      imgUrl: String
      authorId: ID!
      author: User
      comments: [Comment]
      likes: [Like]
      createdAt: String
      updatedAt: String
  }

  type Comment {
      content: String
      username: String
      createdAt: String
      updatedAt: String
  }

  type Like {
      username: String
      createdAt: String
      updatedAt: String
  }

  extend type Query {
        getPosts: [Post]
    }
`;

const resolvers = {
  Query: {
    getPosts: async (_, args, contextValue) => {
      await contextValue.auth()

      const posts = await PostModel.getAll();

      return posts;
    }
  }
}

module.exports = { typeDefs, resolvers }