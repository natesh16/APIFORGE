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
}, 120000);

afterAll(async () => {
  await mongoose.disconnect();
  await mongod.stop();
}, 120000);

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

describe('Workspaces', () => {
  it('creates a workspace and returns it', async () => {
    const token = await registerAndLogin('workspace@example.com');
    const res = await request(app)
      .post('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Demo Workspace',
        slug: 'demo-workspace',
      });
    expect(res.status).toBe(201);
    expect(res.body.data.workspace.name).toBe('Demo Workspace');
    expect(res.body.data.workspace.slug).toBe('demo-workspace');
  });

  it('lists workspaces for authenticated user', async () => {
    const token = await registerAndLogin('workspace2@example.com');
    const res = await request(app)
      .get('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data.workspaces)).toBe(true);
  });

  it('rejects creating workspace with duplicate slug', async () => {
    const token = await registerAndLogin('workspace3@example.com');
    // First creation
    await request(app)
      .post('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Dup', slug: 'dup-slug' });
    // Second attempt with same slug should fail
    const res = await request(app)
      .post('/api/v1/workspaces')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Dup', slug: 'dup-slug' });
    expect(res.status).toBe(409);
  });
});