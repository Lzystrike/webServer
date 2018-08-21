const http = require('http');
const chalk = require('chalk');
const conf = require('./config/defaultConfig');
const path = require('path');
const getRoute = require('./utils/route');
const openPage = require('./utils/openPage');
class Server {
  constructor (config){
    this.conf = Object.assign({}, conf, config);
  }

  start(){
    const server = http.createServer((req, res) => {
      const filePath = path.join(this.conf.root, req.url);
      getRoute(req, res, filePath, this.conf);
    });

    server.listen(this.conf.port, this.conf.hostname, () => {
      const url = `http://${this.conf.hostname}:${this.conf.port}`;
      console.info(`Server started at ${chalk.red(url)}`);
      openPage(url);
    });

  }
}

module.exports = Server;
