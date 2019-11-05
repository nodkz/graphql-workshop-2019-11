const dev = process.env.NODE_ENV !== 'production';
const resolve = require('path').resolve;
require('dotenv').config({
  path: resolve(process.cwd(), '.env.dev'),
  debug: !!process.env.DEBUG,
});
require('module-alias').addAlias('app', resolve(__dirname, dev ? './src' : './'));
const express = require('express');
const next = require('next');
global.fetch = require('isomorphic-unfetch');

const port = parseInt(process.env.PORT, 10) || 4000;
const cfg = {
  dev,
  conf: {
    dir: dev ? './src' : './',
    publicRuntimeConfig: {
      REACT_APP_GRAPHQL_URI: process.env.REACT_APP_GRAPHQL_URI,
      version: process.env.APP_REVISION,
    },
    ...(dev ? require('./next.config.js') : null),
  },
};
const app = next(cfg);
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  if (!dev) server.enable('trust proxy');

  server.use('/static', express.static('static', { etag: true }));

  server.get('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`🚀 SSR app ready at http://localhost:${port}`);
  });
});
