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

  type Query {
        getPosts: [Post]
        getPostById(id: ID!): Post
    }

  type Mutation {
    addPost(
      content: String!
      tags: [String]
      imgUrl: String
    ): Post!

    addComment (
      postId: ID!
      content: String!
    ): Comment
  }
`;

const resolvers = {
  Query: {
    getPosts: async (_, args, contextValue) => {
      await contextValue.auth()

      const posts = await PostModel.getAll();

      return posts;
    },

    getPostById: async (_, args, contextValue) => {
      await contextValue.auth()

      const { id } = args;

      if (!id) {
        throw new Error("Post ID is required");
      }

      const post = await PostModel.getById(id);

      return post;
    },
  },

  Mutation: {
    addPost: async (_, args, contextValue) => {
      const user = await contextValue.auth()

      let { content, tags, imgUrl, authorId } = args

      authorId = user._id
      const post = await PostModel.addPost(content, tags, imgUrl, authorId);

      return post
    },


  }
}

module.exports = { typeDefs, resolvers }