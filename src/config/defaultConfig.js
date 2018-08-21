module.exports = {
  root: process.cwd(),
  hostname: '127.0.0.1',
  port: 4001,
  compress: /\.(html|js|css|md|txt)/,
  cache: {
    maxAge: 600,
    expires: true,
    cacheControl: true,
    lastModified: true,
    eTag: true
  }
};
