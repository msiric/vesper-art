import './secret';
export const production = process.env.NODE_ENV === 'production';
export const clientOrigin = process.env.CLIENT_URI || 'http://127.0.0.1:5175';
export function validateRuntime() {
  if (process.env.DEMO_MODE !== 'true') throw new Error('This deployment must use DEMO_MODE=true');
  for (const name of ['ACCESS_TOKEN_SECRET', 'REFRESH_TOKEN_SECRET', 'DEMO_PROXY_SECRET']) {
    if ((process.env[name] || '').length < 32) throw new Error(`${name} must have at least 32 random characters`);
  }
  if (production && new URL(clientOrigin).protocol !== 'https:') throw new Error('Production CLIENT_URI must use HTTPS');
}
