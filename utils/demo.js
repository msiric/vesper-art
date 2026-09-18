import crypto from 'node:crypto';
import createError from 'http-errors';
import catalog from '../common/demo/catalog.json';
import { Artwork } from '../entities/Artwork';
import { Avatar } from '../entities/Avatar';
import { Cover } from '../entities/Cover';
import { Media } from '../entities/Media';
import { User } from '../entities/User';
import { Version } from '../entities/Version';
import { fetchUserByAuth } from '../services/user';
import { createAccessToken, createRefreshToken, sendRefreshToken } from './auth';
import { formatTokenData } from './helpers';

export const DEMO_LOCK = 735210;
export async function seedDemo(db) {
  await db.transaction(async (manager) => {
    await manager.query('SELECT pg_advisory_xact_lock($1)', [DEMO_LOCK]);
    if (await manager.getRepository(User).existsBy({ id: catalog.data.id })) return;
    await manager.insert(Avatar, catalog.avatar.data);
    await manager.insert(User, { ...catalog.data, password: 'disabled', demoExpiresAt: null });
    for (const artwork of catalog.artwork) {
      await manager.insert(Cover, artwork.version.cover.data);
      await manager.insert(Media, artwork.version.media.data);
      await manager.insert(Version, artwork.version.data);
      await manager.insert(Artwork, artwork.data);
    }
  });
}

export async function pruneExpiredSessions(manager) {
  await manager.query('DELETE FROM "user" WHERE "demoExpiresAt" <= NOW()');
  // Older artwork versions and image metadata use inverse/scalar relations.
  await manager.query('DELETE FROM version WHERE NOT EXISTS (SELECT 1 FROM artwork WHERE artwork.id::text = version."artworkId")');
  await manager.query('DELETE FROM cover WHERE NOT EXISTS (SELECT 1 FROM version WHERE version."coverId" = cover.id)');
  await manager.query('DELETE FROM media WHERE NOT EXISTS (SELECT 1 FROM version WHERE version."mediaId" = media.id)');
  await manager.query('DELETE FROM avatar WHERE NOT EXISTS (SELECT 1 FROM "user" WHERE "user"."avatarId" = avatar.id)');
}

export async function createDemoSession({ response, connection }) {
  await connection.query('SELECT pg_advisory_xact_lock($1)', [DEMO_LOCK]);
  await pruneExpiredSessions(connection);
  const [{ count }] = await connection.query('SELECT COUNT(*)::int AS count FROM "user" WHERE "demoExpiresAt" IS NOT NULL');
  if (count >= 50) throw createError(503, 'All temporary demo accounts are in use. The read-only gallery is still available.');
  const id = crypto.randomUUID();
  await connection.insert(User, {
    id, name: `demo_${id.slice(0, 8)}`, email: `${id}@example.invalid`,
    fullName: 'Demo Visitor', password: 'disabled', verified: true, active: true,
    generated: true, demoExpiresAt: new Date(Date.now() + 86400000),
  });
  const user = await fetchUserByAuth({ userId: id, connection });
  const { tokenPayload, userInfo } = formatTokenData({ user });
  sendRefreshToken({ response, refreshToken: createRefreshToken({ userData: tokenPayload }) });
  return { user: userInfo, accessToken: createAccessToken({ userData: tokenPayload }), demo: true };
}
