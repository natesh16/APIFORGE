const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let app;
let mongod;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await mongoose.connect(process.env.MONGODB_URI);
  app = require('../../src/app');
}, 60000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
});

describe('Management API flow', () => {
  it('runs workspace -> project -> key -> route -> analytics -> logs', async () => {
    await request(app).post('/api/v1/auth/register').send({
      email: 'flow@example.com',
      password: 'password123',
      name: 'Flow',
    });

    const login = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'flow@example.com', password: 'password123' });
    expect(login.status).toBe(200);
    const token = login.body.data.accessToken;
    const auth = (req) => req.set('Authorization', `Bearer ${token}`);

    const ws = await auth(request(app).get('/api/v1/workspaces'));
    expect(ws.status).toBe(200);
    const workspaceId = ws.body.data.workspaces[0]._id;

    const projectRes = await auth(
      request(app).post('/api/v1/projects')
    ).send({ workspaceId, name: 'Demo API', slug: 'demo-api' });
    expect(projectRes.status).toBe(201);
    const projectId = projectRes.body.data.project._id;

    const keyRes = await auth(
      request(app).post(`/api/v1/projects/${projectId}/keys`)
    ).send({
      name: 'demo',
      rateLimit: { limit: 5, windowSeconds: 60 },
    });
    expect(keyRes.status).toBe(201);
    expect(keyRes.body.data.rawKey).toMatch(/^af_test_/);
    expect(keyRes.body.data.apiKey.keyHash).toBeUndefined();
    const keyId = keyRes.body.data.apiKey._id;

    const keys = await auth(
      request(app).get(`/api/v1/projects/${projectId}/keys`)
    );
    expect(keys.status).toBe(200);
    expect(keys.body.data.keys).toHaveLength(1);
    expect(keys.body.data.keys[0].keyHash).toBeUndefined();

    const routeRes = await auth(
      request(app).post(`/api/v1/projects/${projectId}/routes`)
    ).send({
      method: 'GET',
      path: '/hello',
      handlerType: 'STATIC_JSON',
      handlerConfig: {
        type: 'STATIC_JSON',
        payload: { message: 'Hello from APIForge' },
      },
      cacheTTL: 30,
    });
    expect(routeRes.status).toBe(201);
    const routeId = routeRes.body.data.route._id;

    const patch = await auth(
      request(app).patch(
        `/api/v1/projects/${projectId}/routes/${routeId}`
      )
    ).send({ cacheTTL: 60 });
    expect(patch.status).toBe(200);
    expect(patch.body.data.route.cacheTTL).toBe(60);

    const analytics = await auth(
      request(app).get(
        `/api/v1/projects/${projectId}/analytics/overview`
      )
    );
    expect(analytics.status).toBe(200);
    expect(analytics.body.data.totalRequests).toBe(0);

    const logs = await auth(
      request(app).get(`/api/v1/projects/${projectId}/logs`)
    );
    expect(logs.status).toBe(200);
    expect(logs.body.data.items).toHaveLength(0);

    const revoke = await auth(
      request(app).post(
        `/api/v1/projects/${projectId}/keys/${keyId}/revoke`
      )
    );
    expect(revoke.status).toBe(200);
    expect(revoke.body.data.key.revokedAt).toBeDefined();

    const del = await auth(
      request(app).delete(
        `/api/v1/projects/${projectId}/routes/${routeId}`
      )
    );
    expect(del.status).toBe(204);
  });
});
