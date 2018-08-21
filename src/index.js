const yargs = require('yargs');
const Server = require('./app');
const argv = yargs
  .usage('webServer [options]')
  .option('p', {
    alias: 'port',
    describe: 'port number',
    default: 4001
  })
  .option('h', {
    alias: 'hostname',
    describe: 'host',
    default: '127.0.0.1'
  })
  .option('d', {
    alias: 'root',
    describe: 'root path',
    default: process.cwd()
  })
  .version()
  .alias('v', 'version')
  .help()
  .argv;

const webServer = new Server(argv);
webServer.start();
