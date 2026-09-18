import fs from 'node:fs/promises';
import createError from 'http-errors';
import { getConnection, startTransaction } from '../utils/database';
import { tokens } from '../config/secret';
import { sanitizePayload, verifyTokenValidity } from '../utils/helpers';
import { User } from '../entities/User';
import { demoContext } from '../utils/demo-context';
import { DEMO_LOCK } from '../utils/demo';

export async function verifyUserToken(accessToken) {
  if (!/^Bearer [^ ]+$/.test(accessToken || '')) throw createError(401, 'Session expired');
  const { data } = verifyTokenValidity(accessToken.slice(7), tokens.accessToken);
  const user = await getConnection().getRepository(User).findOne({ where: { id: data.id }, select: {id:true,active:true,verified:true,jwtVersion:true,demoExpiresAt:true,stripeId:true} });
  if (!user?.active || !user.verified || user.jwtVersion !== data.jwtVersion || !user.demoExpiresAt || user.demoExpiresAt <= new Date()) throw createError(401, 'Session expired');
  return { ...data, stripeId: user.stripeId };
}

export const requestHandler = (promise, transaction, params) => async (req, res, next) => {
  let runner;
  try {
    sanitizePayload(req, res, next);
    const bound = params ? params(req, res, next) : {};
    const userId = res.locals.user?.id;
    runner = transaction ? await startTransaction() : null;
    const connection = runner ? runner.manager : getConnection();
    if (userId && !['GET','HEAD','OPTIONS'].includes(req.method) && !req.originalUrl.startsWith('/api/auth/')) {
      if (!runner) throw createError(503, 'Demo write must use a transaction');
      await connection.query('SELECT pg_advisory_xact_lock($1)', [DEMO_LOCK]);
      const updated = await connection.query('UPDATE "user" SET "demoWrites" = "demoWrites" + 1 WHERE id = $1 AND "demoWrites" < 60 AND "demoExpiresAt" > NOW() RETURNING id', [userId]);
      if (!updated[1]) throw createError(429, 'This temporary account has reached its demo action limit.');
    }
    const afterCommit = [];
    const result = await demoContext.run({ userId, connection, afterCommit }, () => promise({ ...bound, ...(userId ? { userId } : {}), stripeId: res.locals.user?.stripeId || null, connection }));
    if (runner) await runner.commitTransaction();
    for (const notify of afterCommit) notify();
    res.json(result || { message: 'OK' });
  } catch (error) {
    if (runner?.isTransactionActive) await runner.rollbackTransaction();
    next(error);
  } finally {
    if (runner) await runner.release();
    if (req.file?.path) await fs.unlink(req.file.path).catch(() => {});
  }
};
export const isAuthenticated = async (req, res, next) => {
  try { res.locals.user = await verifyUserToken(req.headers.authorization); next(); } catch (error) { next(error); }
};
export const isAuthenticatedNoFail = async (req, res, next) => {
  try { res.locals.user = await verifyUserToken(req.headers.authorization); } catch { /* Public read remains anonymous. */ }
  next();
};
export const isNotAuthenticated = (req, res, next) => req.headers.authorization ? next(createError(403, 'Already authenticated')) : next();
export const isAuthorized = (req, res, next) => {
  if ((req.params.userId && req.params.userId !== res.locals.user.id) || (req.params.accountId && req.params.accountId !== res.locals.user.stripeId)) return next(createError(403, 'Not authorized'));
  next();
};
