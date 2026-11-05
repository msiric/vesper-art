const { test, before, after, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const http = require('node:http');
require('dotenv').config();
const { Client } = require('pg');

const demoUrl = new URL(process.env.PG_DB_URL);
assert.equal(demoUrl.hostname, '127.0.0.1');
assert.equal(demoUrl.pathname, '/vesper_demo');
const databaseName = 'vesper_payments_' + crypto.randomBytes(6).toString('hex');
const paymentsUrl = new URL(demoUrl);
paymentsUrl.pathname = '/' + databaseName;
process.env.PG_DB_URL = paymentsUrl.toString();
process.env.DEMO_MODE = 'false';
process.env.STRIPE_SECRET = 'sk_test_offline';
process.env.STRIPE_WEBHOOK = 'whsec_offline_test_secret';

// validateRuntime refuses to boot unless DEMO_MODE is on.
require('../dist/config/runtime').validateRuntime = () => {};
const { featureFlags } = require('../dist/common/constants');
const { connectToDatabase } = require('../dist/utils/database');
const { seedDemo } = require('../dist/utils/demo');
const { createAccessToken } = require('../dist/utils/auth');
const { calculateTotalCharge } = require('../dist/utils/payment');
const { postDownload } = require('../dist/controllers/checkout');
const { managePaymentIntent } = require('../dist/controllers/stripe');
const { stripe: stripeClient } = require('../dist/lib/stripe');
const stripeService = require('../dist/services/stripe');
const orderService = require('../dist/services/order');
const artworkService = require('../dist/services/artwork');
const socketApi = require('../dist/lib/socket').default;
const { User } = require('../dist/entities/User');
const { Cover } = require('../dist/entities/Cover');
const { Media } = require('../dist/entities/Media');
const { Version } = require('../dist/entities/Version');
const { Artwork } = require('../dist/entities/Artwork');
const { Discount } = require('../dist/entities/Discount');
const catalog = require('../common/demo/catalog.json');

const origin = process.env.CLIENT_URI || 'http://127.0.0.1:5175';
const admin = new Client({ connectionString: demoUrl.toString() });
let created = false, db, server, base, seller, versionId, artworkId, discountId;
let refunds = [], emits = [];
const totals = calculateTotalCharge({ foundVersion: { personal: 10, commercial: 25 }, foundDiscount: {}, licenseType: 'personal' });

before(async () => {
  assert.equal(featureFlags.payment, true);
  await admin.connect();
  await admin.query(`CREATE DATABASE "${databaseName}"`);
  created = true;
  db = await connectToDatabase();
  await db.runMigrations();
  await seedDemo(db);
  stripeClient._requestSender._request = () => { throw new Error('Stripe network access is disabled in tests'); };
  stripeClient.paymentIntents.retrieve = async () => { throw new Error('Unexpected intent lookup'); };
  stripeClient.refunds.create = async (params, options) => { refunds.push({ params, options }); return { id: 're_test' }; };
  socketApi.io.to = (room) => ({ emit: (name) => emits.push({ room, name, orders: countOrdersFor(room) }) });
  seller = await createUser({ stripeId: 'acct_test_seller' });
  ({ versionId, artworkId } = await createCommercialArtwork(seller.id));
  discountId = crypto.randomUUID();
  await db.getRepository(Discount).insert({ id: discountId, name: 'TEST20', discount: 20, active: true });
  server = http.createServer(require('../dist/app').default);
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  base = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve) => server.close(resolve));
  if (db?.isInitialized) await db.destroy();
  if (created) await admin.query(`DROP DATABASE "${databaseName}"`);
  await admin.end();
});

beforeEach(() => { refunds = []; emits = []; });

async function countOrdersFor(sellerId) {
  const [{ count }] = await db.query('SELECT COUNT(*)::int AS count FROM "order" WHERE "sellerId" = $1', [sellerId]);
  return count;
}

async function createUser(extra = {}) {
  const id = crypto.randomUUID();
  const user = { id, name: `pay_${id.slice(0, 8)}`, email: `${id}@example.invalid`, fullName: `Buyer ${id.slice(0, 4)}`, password: 'disabled', verified: true, active: true, demoExpiresAt: new Date(Date.now() + 3600000), ...extra };
  await db.getRepository(User).insert(user);
  return user;
}

async function createCommercialArtwork(ownerId) {
  const ids = { cover: crypto.randomUUID(), media: crypto.randomUUID(), version: crypto.randomUUID(), artwork: crypto.randomUUID() };
  const image = { source: '/demo-assets/media/test.jpg', orientation: 'square', dominant: '#000000', height: '640', width: '640' };
  await db.getRepository(Cover).insert({ id: ids.cover, ...image });
  await db.getRepository(Media).insert({ id: ids.media, ...image });
  await db.getRepository(Version).insert({ id: ids.version, artworkId: ids.artwork, title: 'Commercial test artwork', description: '', availability: 'available', type: 'commercial', license: 'commercial', use: 'separate', personal: 1000, commercial: 2500, coverId: ids.cover, mediaId: ids.media });
  await db.getRepository(Artwork).insert({ id: ids.artwork, ownerId, currentId: ids.version, active: true, visibility: 'visible' });
  return { versionId: ids.version, artworkId: ids.artwork };
}

const newIntentId = () => 'pi_' + crypto.randomBytes(12).toString('hex');

function orderDataFor(buyer, overrides = {}) {
  return {
    buyerId: buyer.id, sellerId: seller.id, artworkId, versionId, discountId: null,
    spent: totals.buyerTotal, earned: totals.sellerTotal, fee: totals.platformTotal,
    licenseData: { licenseAssignee: buyer.fullName, licenseAssignor: seller.fullName, licenseUsage: 'individual', licenseCompany: 'unavailable', licenseType: 'personal', licensePrice: totals.licensePrice },
    ...overrides,
  };
}

function succeededEvent({ intentId, orderData, amountReceived = orderData.spent }) {
  return { id: 'evt_' + crypto.randomBytes(8).toString('hex'), object: 'event', type: 'payment_intent.succeeded', data: { object: { id: intentId, object: 'payment_intent', status: 'succeeded', amount_received: amountReceived, metadata: { orderData: JSON.stringify(orderData) } } } };
}

async function deliver(event, signature) {
  const payload = JSON.stringify(event);
  const header = signature ?? stripeClient.webhooks.generateTestHeaderString({ payload, secret: process.env.STRIPE_WEBHOOK });
  const response = await fetch(base + '/webhook/events', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Stripe-Signature': header }, body: payload });
  return { status: response.status, data: await response.json() };
}

async function ordersFor(intentId) {
  return db.query('SELECT "buyerId", spent FROM "order" WHERE "intentId" = $1', [intentId]);
}

async function licenseCount(buyerId) {
  const [{ count }] = await db.query('SELECT COUNT(*)::int AS count FROM license WHERE "ownerId" = $1', [buyerId]);
  return count;
}

test('calculateTotalCharge adds buyer fees and applies discounts to the buyer total only', () => {
  const version = { personal: 10, commercial: 25 };
  assert.deepEqual(totals, { buyerTotal: 1285, sellerTotal: 850, platformTotal: 435, licensePrice: 1000 });
  assert.deepEqual(calculateTotalCharge({ foundVersion: version, foundDiscount: { discount: 0.2 }, licenseType: 'personal' }), { buyerTotal: 1085, sellerTotal: 850, platformTotal: 235, licensePrice: 1000 });
  assert.deepEqual(calculateTotalCharge({ foundVersion: version, foundDiscount: {}, licenseType: 'commercial' }), { buyerTotal: 2860, sellerTotal: 2125, platformTotal: 735, licensePrice: 2500 });
});

test('a redelivered payment creates exactly one order and never refunds', async () => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const event = succeededEvent({ intentId, orderData: orderDataFor(buyer) });
  const earlierOrders = await countOrdersFor(seller.id);
  for (let attempt = 0; attempt < 2; attempt++) {
    const r = await deliver(event);
    assert.equal(r.status, 200, JSON.stringify(r.data));
    assert.equal(r.data.message, 'Order processed successfully');
  }
  assert.deepEqual(await ordersFor(intentId), [{ buyerId: buyer.id, spent: totals.buyerTotal }]);
  assert.equal(await licenseCount(buyer.id), 1);
  assert.equal(refunds.length, 0);
  assert.equal(emits.length, 1);
  assert.equal(await emits[0].orders, earlierOrders + 1);
});

test('a concurrent duplicate that hits the unique constraint resolves as processed', async (t) => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const event = succeededEvent({ intentId, orderData: orderDataFor(buyer) });
  const lookup = orderService.fetchOrderByIntent;
  let skipped = 0;
  const precheck = t.mock.method(orderService, 'fetchOrderByIntent', async (args) => (skipped++ < 2 ? undefined : lookup(args)));
  const results = await Promise.all([deliver(event), deliver(event)]);
  for (const r of results) assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.equal(precheck.mock.callCount(), 3);
  assert.equal((await ordersFor(intentId)).length, 1);
  assert.equal(await licenseCount(buyer.id), 1);
  assert.equal(refunds.length, 0);
  assert.equal(emits.length, 1);
});

test('an amount mismatch refunds once per delivery with a stable idempotency key and creates no order', async () => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const event = succeededEvent({ intentId, orderData: orderDataFor(buyer), amountReceived: totals.buyerTotal - 100 });
  for (let attempt = 0; attempt < 2; attempt++) assert.equal((await deliver(event)).status, 200);
  assert.equal(refunds.length, 2);
  for (const refund of refunds) {
    assert.deepEqual(refund.params, { payment_intent: intentId, reverse_transfer: true, refund_application_fee: true });
    assert.deepEqual(refund.options, { idempotencyKey: `refund-${intentId}` });
  }
  assert.equal((await ordersFor(intentId)).length, 0);
  assert.equal(await licenseCount(buyer.id), 0);
});

test('order metadata that fails validation is refunded instead of fulfilled', async () => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const orderData = orderDataFor(buyer);
  delete orderData.licenseData.licensePrice;
  assert.equal((await deliver(succeededEvent({ intentId, orderData }))).status, 200);
  assert.equal(refunds.length, 1);
  assert.equal((await ordersFor(intentId)).length, 0);
});

test('a transient failure is rethrown for Stripe to retry and never refunds', async (t) => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const event = succeededEvent({ intentId, orderData: orderDataFor(buyer) });
  const failing = t.mock.method(orderService, 'addNewOrder', async () => { throw new Error('Connection terminated unexpectedly'); });
  assert.equal((await deliver(event)).status, 500);
  assert.equal(refunds.length, 0);
  assert.equal((await ordersFor(intentId)).length, 0);
  assert.equal(await licenseCount(buyer.id), 0);
  failing.mock.restore();
  assert.equal((await deliver(event)).status, 200);
  assert.equal((await ordersFor(intentId)).length, 1);
  assert.equal(refunds.length, 0);
});

test('webhooks with a bad signature are rejected before any processing', async () => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const event = succeededEvent({ intentId, orderData: orderDataFor(buyer) });
  const forged = stripeClient.webhooks.generateTestHeaderString({ payload: JSON.stringify(event), secret: 'whsec_wrong' });
  assert.equal((await deliver(event, forged)).status, 400);
  assert.equal((await deliver(event, '')).status, 400);
  const tampered = stripeClient.webhooks.generateTestHeaderString({ payload: JSON.stringify({ ...event, id: 'evt_other' }), secret: process.env.STRIPE_WEBHOOK });
  assert.equal((await deliver(event, tampered)).status, 400);
  assert.equal((await ordersFor(intentId)).length, 0);
  assert.equal(refunds.length, 0);
});

test('failed payments are acknowledged and unknown webhook paths respond', async () => {
  const event = { id: 'evt_failed', object: 'event', type: 'payment_intent.payment_failed', data: { object: { id: newIntentId(), object: 'payment_intent' } } };
  const r = await deliver(event);
  assert.equal(r.status, 200, JSON.stringify(r.data));
  assert.equal(refunds.length, 0);
  const missing = await fetch(base + '/webhook/unknown', { method: 'POST', signal: AbortSignal.timeout(5000) });
  assert.equal(missing.status, 404);
});

test('managePaymentIntent keeps its error for each rejected request', async (t) => {
  const buyer = await createUser();
  const request = (overrides = {}) => managePaymentIntent({ userId: buyer.id, versionId, licenseUsage: 'individual', licenseCompany: 'unavailable', licenseType: 'personal', connection: db.manager, ...overrides });
  await assert.rejects(request({ userId: crypto.randomUUID() }), { status: 404, message: 'User not found' });
  await assert.rejects(request({ versionId: crypto.randomUUID() }), { status: 404, message: 'Artwork not found' });
  const real = artworkService.fetchVersionDetails;
  const obsolete = t.mock.method(artworkService, 'fetchVersionDetails', async (args) => {
    const version = await real(args);
    return { ...version, artwork: { ...version.artwork, currentId: crypto.randomUUID() } };
  });
  await assert.rejects(request(), { status: 400, message: 'There is a newer version of this artwork' });
  obsolete.mock.restore();
  await assert.rejects(request({ userId: seller.id }), { status: 400, message: 'You are the owner of this artwork' });
  await assert.rejects(request({ discountId: crypto.randomUUID() }), { status: 500, message: 'Could not apply discount' });
  await assert.rejects(request({ discountId }), { status: 500, message: 'Could not process the payment' });
  await assert.rejects(request({ licenseType: 'invalid' }), { name: 'ValidationError' });
  const free = catalog.artwork[0].version.data.id;
  await assert.rejects(request({ versionId: free }), { status: 400, message: 'License is not valid' });
  assert.equal((await deliver(succeededEvent({ intentId: newIntentId(), orderData: orderDataFor(buyer) }))).status, 200);
  await assert.rejects(request(), { status: 400, message: 'There is already an identical license assigned to you' });
});

test('managePaymentIntent creates an intent once and updates it while pending', async (t) => {
  const buyer = await createUser();
  const intentId = newIntentId();
  const request = (overrides = {}) => managePaymentIntent({ userId: buyer.id, versionId, licenseUsage: 'individual', licenseCompany: 'unavailable', licenseType: 'personal', connection: db.manager, ...overrides });
  const constructed = t.mock.method(stripeService, 'constructStripeIntent', async () => ({ id: intentId, client_secret: 'cs_test' }));
  assert.deepEqual(await request(), { intent: { id: intentId, secret: 'cs_test' } });
  assert.equal(constructed.mock.callCount(), 1);
  const created = constructed.mock.calls[0].arguments[0];
  assert.equal(created.intentPaid, totals.buyerTotal);
  assert.equal(created.intentSold, totals.sellerTotal);
  assert.equal(created.sellerId, 'acct_test_seller');
  assert.deepEqual(created.orderData, orderDataFor(buyer));
  assert.deepEqual(await db.query('SELECT "ownerId", "versionId" FROM intent WHERE id = $1', [intentId]), [{ ownerId: buyer.id, versionId }]);

  t.mock.method(stripeService, 'retrieveStripeIntent', async () => ({ id: intentId, status: 'requires_payment_method' }));
  const updated = t.mock.method(stripeService, 'updateStripeIntent', async () => ({ id: intentId, client_secret: 'cs_test' }));
  await request({ discountId });
  assert.equal(constructed.mock.callCount(), 1);
  const update = updated.mock.calls[0].arguments[0];
  assert.equal(update.intentPaid, 1085);
  assert.equal(update.orderData.discountId, discountId);
  assert.equal(update.orderData.buyerId, undefined);
  assert.equal((await db.query('SELECT id FROM intent WHERE "ownerId" = $1', [buyer.id])).length, 1);
});

test('free downloads reject duplicates and notify the seller only after commit', async () => {
  const buyer = await createUser();
  const accessToken = createAccessToken({ userData: { id: buyer.id, jwtVersion: 0 } });
  const version = catalog.artwork[3].version.data.id;
  const download = () => fetch(`${base}/api/download/${version}`, { method: 'POST', headers: { Origin: origin, Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ licenseUsage: 'individual', licenseCompany: 'unavailable', licenseType: 'personal' }) });
  const first = await download();
  assert.equal(first.status, 200, JSON.stringify(await first.json()));
  assert.equal(emits.length, 1);
  assert.equal(emits[0].room, catalog.data.id);
  assert.equal(await emits[0].orders, 1);
  const second = await download();
  assert.equal(second.status, 400);
  assert.equal((await second.json()).message, 'There is already an identical license assigned to you');
  assert.equal(emits.length, 1);
  const rows = await db.query('SELECT spent, "intentId" FROM "order" WHERE "buyerId" = $1', [buyer.id]);
  assert.deepEqual(rows, [{ spent: 0, intentId: null }]);
});

test('postDownload keeps its error for each rejected request', async (t) => {
  const buyer = await createUser();
  const free = catalog.artwork[4].version.data.id;
  const request = (overrides = {}) => postDownload({ userId: buyer.id, versionId: free, licenseUsage: 'individual', licenseCompany: 'unavailable', licenseType: 'personal', connection: db.manager, ...overrides });
  await assert.rejects(request({ versionId: crypto.randomUUID() }), { status: 404, message: 'Artwork not found' });
  await assert.rejects(request({ userId: crypto.randomUUID() }), { status: 404, message: 'User not found' });
  await assert.rejects(request({ licenseType: 'commercial' }), { status: 400, message: 'License is not valid' });
  const real = artworkService.fetchVersionDetails;
  const obsolete = t.mock.method(artworkService, 'fetchVersionDetails', async (args) => {
    const version = await real(args);
    return { ...version, artwork: { ...version.artwork, currentId: crypto.randomUUID() } };
  });
  await assert.rejects(request(), { status: 400, message: 'There is a newer version of this artwork' });
  obsolete.mock.restore();
  await assert.rejects(request({ versionId }), { name: 'ValidationError' });
  await assert.rejects(request({ userId: catalog.data.id }), { status: 400, message: 'You are the owner of this artwork' });
  assert.equal(emits.length, 0);
});
