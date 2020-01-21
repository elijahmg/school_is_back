import express from 'express';
import setupMiddleware from './middleware';
import server from './api/graphQLRouter';
import { connect } from './db';

const app = express();

setupMiddleware(app);
connect();

server.applyMiddleware({ app });

app.all('*', (req, res) => {
  res.json({ ok: false });
});

export default app;