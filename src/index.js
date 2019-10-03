import http, { createServer } from 'http';
import config from './config';
import app from './server';

let currentApp = app;

const server = http.createServer(app);

server.listen(config.port, () => {
  console.log('server is listening');
});

if (module.hot) {
  module.hot.accept(['./server'], () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}