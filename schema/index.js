// Schema definition
export const typeDefs = `#graphql
  type Post {
    id: ID!
    title: String!
    content: String!
  }

  type Query {
    post(id: ID): Post
    posts: [Post]!
  }

  type Mutation {
    createPost(title: String!, content: String!): Post
    deletePost(id: ID!): String
  }
`;

// Resolver map
export const resolvers = {
  Query: {

    post: (_, { id }, { dataSources }) => {
      return dataSources.db.getPost(id);
    },

    posts: (_, __, { dataSources }) => {
      return dataSources.db.getPosts();
    },

  },

  Mutation: {

    createPost: (_, args, { dataSources }) => {
      const { title, content } = args;
      return dataSources.db.newPost(title, content);
    },

    deletePost: (_, { id }, { dataSources }) => {
      return dataSources.db.delPost(id);
    },

  }
};
