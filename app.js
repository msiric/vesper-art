import 'dotenv/config';
import 'reflect-metadata';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import createError from 'http-errors';
import { clientOrigin, validateRuntime } from './config/runtime';
import { demoGuard } from './middleware/demo-guard';
import { requestHandler, isAuthenticated } from './middleware';
import { createDemoSession } from './utils/demo';
import { getConnection } from './utils/database';
import { User } from './entities/User';
import { DemoUpload } from './entities/DemoUpload';
import { sendRefreshToken } from './utils/auth';
import { postRefreshToken } from './controllers/auth';
import { handleDelegatedError } from './utils/helpers';
import api from './routes/api';
import socketApi from './lib/socket';

validateRuntime();
const app = express();
app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false, crossOriginResourcePolicy: {policy:'same-site'} }));
app.get('/healthz', (_, res) => res.json({ status: 'ok', demo: true }));
app.use('/api', demoGuard);
app.use(cors({ origin: clientOrigin, credentials: true }));
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: false, limit: '16kb', parameterLimit: 50 }));
app.use(cookieParser());
app.use(compression());
app.post('/api/demo/session', requestHandler(createDemoSession, true, (_, res) => ({ response: res })));
app.post('/api/auth/refresh_token', requestHandler(postRefreshToken, true, (req, res) => ({ cookies: req.cookies, response: res })));
app.post('/api/auth/logout', isAuthenticated, requestHandler(async ({ userId, response, connection }) => {
  await connection.getRepository(User).increment({ id: userId }, 'jwtVersion', 1);
  sendRefreshToken({ response, refreshToken: '' });
  socketApi.disconnectUser(userId);
  return { accessToken: '', user: '' };
}, true, (_, res) => ({ response: res })));
app.use('/api/auth', (_, res) => res.status(403).json({ message: 'Use Start live demo; real accounts and email are disabled.', expose: true }));
app.get('/api/demo/assets/:id', async (req, res, next) => {
  try {
    if (!/^[\da-f-]{36}$/.test(req.params.id)) throw createError(404, 'Image not found');
    const file = await getConnection().getRepository(DemoUpload).createQueryBuilder('file').addSelect('file.content').innerJoin('file.owner','owner').where('file.id = :id AND owner.demoExpiresAt > NOW()', {id:req.params.id}).getOne();
    if (!file) throw createError(404, 'Temporary image expired');
    res.type(file.mimeType).set('Cache-Control','private, max-age=300').send(file.content);
  } catch (error) { next(error); }
});
// View analytics are unnecessary personal-data collection and unbounded writes for a portfolio demo.
app.post('/api/artwork/:id/analytics', (_, res) => res.json({ message: 'Demo view tracking disabled' }));
app.use('/api/users/:id/email', (_,res) => res.status(403).json({message:'Demo accounts use fictional email addresses.',expose:true}));
app.use('/api/users/:id/password', (_,res) => res.status(403).json({message:'Demo accounts do not have passwords.',expose:true}));
app.use('/api', api);
app.use((_,res) => res.status(404).json({message:'Endpoint not found'}));
app.use((error,req,res,next) => {
  if (res.headersSent) return next(error);
  const result = handleDelegatedError({err:error});
  res.status(result.status).json(result);
});
export default app;
