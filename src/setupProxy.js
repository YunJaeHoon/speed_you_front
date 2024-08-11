/* CORS 관련 오류 방지 Proxy 설정 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://43.203.196.229:8080',	  // 서버 URL
      changeOrigin: true,
    })
  );
};