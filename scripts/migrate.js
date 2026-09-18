import { connectToDatabase } from '../utils/database';
import { seedDemo } from '../utils/demo';

(async () => {
  const db = await connectToDatabase();
  try {
    await db.runMigrations({ transaction: 'all' });
    await seedDemo(db);
    console.log('Vesper migrations and repeatable demo seed complete');
  } finally { await db.destroy(); }
})().catch(() => { console.error('Migration failed; check the isolated database target and migration history'); process.exitCode = 1; });
