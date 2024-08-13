/* CORS 관련 오류 방지 Proxy 설정 */

const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://speed-you-back.link',	  // 서버 URL
      changeOrigin: true,
    })
  );
};