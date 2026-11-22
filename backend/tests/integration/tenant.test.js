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

async function registerAndLogin(email) {
  await request(app).post('/api/v1/auth/register').send({
    email,
    password: 'password123',
    name: email.split('@')[0],
  });
  const login = await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password: 'password123' });
  return login.body.data.accessToken;
}

async function firstWorkspace(token) {
  const res = await request(app)
    .get('/api/v1/workspaces')
    .set('Authorization', `Bearer ${token}`);
  return res.body.data.workspaces[0]._id;
}

describe('Tenant isolation', () => {
  it("prevents listing another workspace's projects", async () => {
    const tokenA = await registerAndLogin('alice@example.com');
    const tokenB = await registerAndLogin('bob@example.com');

    const workspaceIdA = await firstWorkspace(tokenA);

    const create = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        workspaceId: workspaceIdA,
        name: 'Weather API',
        slug: 'weather-api',
      });
    expect(create.status).toBe(201);

    const forbidden = await request(app)
      .get(`/api/v1/projects?workspaceId=${workspaceIdA}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(forbidden.status).toBe(403);

    const own = await request(app)
      .get(`/api/v1/projects?workspaceId=${await firstWorkspace(tokenB)}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(own.status).toBe(200);
    expect(own.body.data.projects).toHaveLength(0);
  });

  it("prevents revoking another project's key", async () => {
    const tokenA = await registerAndLogin('carol@example.com');
    const tokenB = await registerAndLogin('dave@example.com');

    const workspaceIdA = await firstWorkspace(tokenA);
    const project = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        workspaceId: workspaceIdA,
        name: 'Payments API',
        slug: 'payments-api',
      });
    const projectId = project.body.data.project._id;

    const key = await request(app)
      .post(`/api/v1/projects/${projectId}/keys`)
      .set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'demo' });
    expect(key.status).toBe(201);
    expect(key.body.data.rawKey).toMatch(/^af_test_/);
    expect(key.body.data.apiKey.keyHash).toBeUndefined();

    const workspaceIdB = await firstWorkspace(tokenB);
    const projectB = await request(app)
      .post('/api/v1/projects')
      .set('Authorization', `Bearer ${tokenB}`)
      .send({
        workspaceId: workspaceIdB,
        name: 'Other API',
        slug: 'other-api',
      });
    const projectBId = projectB.body.data.project._id;

    const crossTenant = await request(app)
      .post(
        `/api/v1/projects/${projectBId}/keys/${key.body.data.apiKey._id}/revoke`
      )
      .set('Authorization', `Bearer ${tokenB}`);
    expect(crossTenant.status).toBe(404);
  });
});
