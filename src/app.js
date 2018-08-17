const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const path = require('path');
const getRoute = require('./utils/route');

const server = http.createServer((req, res) => {
  const filePath = path.join(conf.root, req.url);
  getRoute(res, filePath);
});

server.listen(conf.port, conf.hostname, () => {
  const url = `http://${conf.hostname}:${conf.port}`;
  console.info(`Server started at ${chalk.red(url)}`);
});
