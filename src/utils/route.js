const fs = require('fs');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);
const jade = require('jade');
const path = require('path');
const tplPath = path.join(__dirname, '../templates/index.jade');
const getct = require('./mime');
const compress = require('./compress');
const getRange = require('./range');
const isCache = require('./cache');

module.exports = async function (req, res, filePath, conf) {
  // console.info(`filePath:       ${filePath}`);
  try {
    const stats = await stat(filePath);
    // if request a file
    if (stats.isFile()) {
      let ct = getct(filePath).type;
      res.setHeader('Content-Type', ct || 'text/plain');
      if(isCache(stats, req, res)){ // 判断是否使用缓存
        res.statusCode = 304;
        res.end();
        return;
      }
      let rs;
      let {code, start, end} = getRange(stats.size, req, res);
      if (code === 200) {
        res.statusCode = 200;
        rs = fs.createReadStream(filePath);
      } else {
        res.statusCode = 216;
        rs = fs.createReadStream(filePath, {start, end});
      }
      if (filePath.match(conf.compress)) {
        rs = compress(rs, req, res);
      }
      rs.pipe(res);
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
            icon: '/' + path.relative(conf.root, getct(item).icon || ''),
            type: getct(item).type || '?'
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
