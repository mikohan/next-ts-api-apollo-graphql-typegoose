import './env';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

import nextApp from '@next-ts/app';

import createSchema from '../schema';
import createSession from '../session';

const port = process.env.PORT || 8888;

async function createServer() {
  try {
    // 1. Create mongoose connection
    await createSession();
    // 2. Create express server
    const app = express();

    const corsOptions = {
      origin: process.env.URL_APP,
      credentials: true,
    };

    app.use(cors(corsOptions));

    // use JSON requests
    app.use(express.json());
    const schema = await createSchema();
    // create GraphQLServer
    const apolloServer = new ApolloServer({
      schema,
      context: ({ req, res }) => ({ req, res }),
      introspection: true,
      //enable playground
      playground: {
        settings: {
          'request.credentials': 'include',
        },
      },
    });

    apolloServer.applyMiddleware({ app, cors: corsOptions });

    // start server
    app.listen({ port }, () => {
      console.log(
        `Server is running at http://localhost:${port}${apolloServer.graphqlPath}`
      );
    });
  } catch (e) {
    console.error(e);
  }
}

createServer();
