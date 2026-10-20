const typeDefs = `#graphql
 
  type Posts {
    _id: ID!
    content: String!
  }

  type Query {
    books: [Book]
  }
`;