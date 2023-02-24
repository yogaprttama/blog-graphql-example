import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

// DataSource
import { BlogDataSource } from './blog.js';

const app = express();
const httpServer = http.createServer(app);

const typeDefs = `#graphql

  type Post {
    id: ID
    title: String
    content: String
  }

  type Query {
    posts: [Post]
  }
`;

const resolvers = {
  Query: {
    posts: async (_, __, { dataSources }) => {
      return dataSources.blog.getPosts();
    }
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  plugins: [
    ApolloServerPluginDrainHttpServer({ httpServer }),
    ApolloServerPluginLandingPageDisabled()
  ]
});

await server.start();

app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  expressMiddleware(server, {
    context: async () => {
      return {
        dataSources: {
          blog: new BlogDataSource(`init dataSources ${Math.floor(Date.now() / 1000)}`),
        },
      };
    },
  }),
);

await new Promise((resolve) => httpServer.listen({ port: 3000 }, resolve));

console.log(`🚀 Server ready at http://localhost:3000/`);
