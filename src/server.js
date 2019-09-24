import express from 'express';

const app = express();

app.get('/', (req, res) => {
  res.json({ ok: false })
});

export default app;