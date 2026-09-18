import crypto from 'node:crypto';
import { demoContext } from '../utils/demo-context';
import { Server } from 'socket.io';
import { verifyUserToken } from '../middleware';
import { clientOrigin, production } from '../config/runtime';

const io = new Server({
  path: '/api/socket.io', transports: ['polling'], maxHttpBufferSize: 16384,
  cors: { origin: clientOrigin, credentials: true },
  allowRequest: (req, callback) => {
    const expected = Buffer.from(process.env.DEMO_PROXY_SECRET || '');
    const supplied = Buffer.from(req.headers['x-demo-proxy-secret'] || '');
    const proxy = !production || (expected.length === supplied.length && crypto.timingSafeEqual(expected,supplied));
    callback(null, proxy && (req.headers.origin === clientOrigin || (!production && !req.headers.origin)) && io.engine.clientsCount < 20);
  },
});
const socketApi = { io, users: new Map(), sockets: new Map() };
io.use(async (socket,next) => {
  try { socket.data.user = await verifyUserToken(`Bearer ${socket.handshake.auth.token || ''}`); next(); }
  catch { next(new Error('Session expired')); }
});
io.on('connection', socket => {
  const user = socket.data.user;
  socket.join(user.id);
  // A forgotten browser tab must not keep a free instance awake forever.
  const timer = setTimeout(() => socket.disconnect(true), Math.min(180000, user.exp * 1000 - Date.now()));
  timer.unref();
  socket.on('disconnectUser', () => socket.disconnect(true));
  socket.on('disconnect', () => clearTimeout(timer));
});
socketApi.sendNotification = (userId) => {
  const notify = () => io.to(userId).emit('sendNotification');
  const pending = demoContext.getStore()?.afterCommit;
  if (pending) pending.push(notify); else notify();
};
socketApi.disconnectUser = userId => io.in(userId).disconnectSockets(true);
export default socketApi;
