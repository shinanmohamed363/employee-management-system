// setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api', // This will proxy requests starting with /api to the target URL
    createProxyMiddleware({
      target: 'http://examination.24x7retail.com', // The API URL you're trying to access
      changeOrigin: true, // This helps with setting up the correct origin for CORS
      secure: false, // Set this to true if your API uses HTTPS
    })
  );
};
