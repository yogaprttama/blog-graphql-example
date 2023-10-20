import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { ApolloServerPluginLandingPageDisabled } from '@apollo/server/plugin/disabled';
import { GraphQLError } from 'graphql';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';
import { typeDefs, resolvers } from './schema/index.js';
import { KnexDatasource } from './db/KnexDatasource.js';

(async () => {
  // Server
  const app = express();
  const httpServer = http.createServer(app);

  // DB Connection
  const knexConfig = {
    client: 'sqlite3',
    connection: {
      filename: "./db/blog.db"
    },
    useNullAsDefault: true
  }

  const knexDS = new KnexDatasource(knexConfig);

  // Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      ApolloServerPluginLandingPageDisabled()
    ]
  });

  // Start server
  await server.start();

  // Security
  app.disable("x-powered-by");

  // Apply middleware
  app.use(
    '/graphql',
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: () => {
        return {
          dataSources: {
            db: knexDS
          },
        };
      },
    }),
  );

  // Fake route
  app.get('/', (req, res) => {
    res.status(401).end();
  });

  app.get('*', (req, res) => {
    res.status(401).end();
  });

  // http server start
  httpServer.listen(3000, () => {
    console.log(`Server ready at http://localhost:3000/graphql`);
  });
})();
