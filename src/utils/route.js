const fs = require('fs');
const {promisify} = require('util');
const stat = promisify(fs.stat);
const readdir = promisify(fs.readdir);

module.exports = async function (res, filePath) {
  try {
    const stats = await stat(filePath);
    // if request a file
    if (stats.isFile()) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      fs.createReadStream(filePath).pipe(res);
      return;
    }
    // if request a directory
    if (stats.isDirectory()) {
      try {
        const files = await readdir(filePath);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        let resTxt = '';
        files.forEach((item) => {
          resTxt += item + '\n';
        });
        res.end(resTxt);
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
