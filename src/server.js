import express from 'express';
import { restRouter } from "./api/restRouter";
import { protect } from "./api/modules/auth";
import setupMiddleware from './middleware';

const app = express();

setupMiddleware(app);

app.use('/api', protect, restRouter);

app.all('*', (req, res) => {
  res.json({ ok: false });
});

export default app;