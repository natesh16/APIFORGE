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

describe('Auth', () => {
  it('registers a user and returns user object', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
      name: 'Test',
    });
    expect(res.status).toBe(201);
    expect(res.body.data.user.email).toBe('test@example.com');
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects duplicate email', async () => {
    const res = await request(app).post('/api/v1/auth/register').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(409);
  });

  it('logs in successfully', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
    expect(res.body.data.refreshToken).toBeDefined();
    expect(res.body.data.user.passwordHash).toBeUndefined();
  });

  it('rejects wrong password', async () => {
    const res = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'wrong',
    });
    expect(res.status).toBe(401);
  });

  it('refreshes an access token', async () => {
    const login = await request(app).post('/api/v1/auth/login').send({
      email: 'test@example.com',
      password: 'password123',
    });
    const res = await request(app)
      .post('/api/v1/auth/refresh')
      .send({ refreshToken: login.body.data.refreshToken });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });
});
