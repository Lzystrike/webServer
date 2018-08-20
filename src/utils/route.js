const fs = require('fs');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const jade = require('jade');
const path = require('path');
const tplPath = path.join(__dirname, '../templates/index.jade');
const conf = require('../config/defaultConfig');
const getct = require('../utils/mime');

module.exports = async function (res, filePath) {
  // console.info(`filePath:       ${filePath}`);
  try {
    const stats = await stat(filePath);
    // if request a file
    if (stats.isFile()) {
      res.statusCode = 200;
      let ct = getct(filePath).type;
      res.setHeader('Content-Type', ct);
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    // if request a directory
    if (stats.isDirectory()) {
      try {
        const files = await readdir(filePath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        let arr = [];
        const relativeDir = path.relative(conf.root, filePath);
        files.forEach((item) => {
          arr.push({
            link: (relativeDir ? `/${relativeDir}` : '') + '/' + item,
            name: item,
            icon: '/' + path.relative(conf.root, getct(item).icon || '')
          });
        });
        res.end(jade.renderFile(tplPath, {
          fileList: arr,
          title: path.basename(filePath)
        }));
      } catch (e) {
        console.error(e);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end('There\'s something wrong with directory reading');
      }
    }
  } catch (e) {
    console.error(e);
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end(`${filePath} is not a directory or file`);
  }
};
