import './env';
import 'reflect-metadata';
import { ApolloServer } from 'apollo-server-express';
import express from 'express';
import cors from 'cors';

import createShcema from '../schema';
import createSession from '../session';

const port = process.env.PORT || 8888;

async function createServer() {
  try {
    // 1. Create mongoose connection
    await createSession();
    // 2. Create express server
    const app = express();
  } catch (e) {
    console.error(e);
  }
}
