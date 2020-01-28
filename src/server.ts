import express from 'express';
import server from './api/graphQLRouter';
import { connect } from './db';

const app = express();

server.applyMiddleware({ app });

app.listen({ port: 3010 }, async () => {
  await connect();
  console.log('server is listening');
});

declare const module: any;

if (module.hot) {
  module.hot.accept();
  module.hot.dispose(() => server.stop());
}
