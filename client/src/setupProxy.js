import { createProxyMiddleware } from 'http-proxy-middleware';

export default (app) => {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      changeOrigin: true,
    })
  );
  app.use(
    '/stripe',
    createProxyMiddleware({
      target: 'http://localhost:5000/',
      changeOrigin: true,
    })
  );
};
