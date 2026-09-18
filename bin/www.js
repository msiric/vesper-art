import 'dotenv/config';
import http from 'node:http';
import app from '../app';
import socketApi from '../lib/socket';
import { connectToDatabase } from '../utils/database';
import { seedDemo } from '../utils/demo';

(async () => {
  const db = await connectToDatabase();
  await db.runMigrations({transaction:'all'});
  await seedDemo(db);
  const server = http.createServer(app);
  server.requestTimeout = 30000;
  server.headersTimeout = 15000;
  socketApi.io.attach(server);
  server.listen(Number(process.env.PORT || 5075), '0.0.0.0', () => console.log('Vesper demo API is ready'));
  const shutdown = () => { socketApi.io.close(); server.close(() => db.destroy().finally(() => process.exit(0))); setTimeout(() => process.exit(1),10000).unref(); };
  process.once('SIGTERM',shutdown); process.once('SIGINT',shutdown);
})().catch(error => { console.error('Vesper startup failed:', error.message); process.exitCode=1; });
