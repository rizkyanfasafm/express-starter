import request from 'supertest';
import { expect, it, describe, beforeEach, afterAll } from 'vitest';
import { createApp } from '@/app';
import { prisma } from '@/db/prisma';
import { hashPassword } from '@/utils/password';
import { signAccessToken, signRefreshToken } from '@/utils/jwt';

const app = createApp();

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: '@test.com' } } });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: { contains: '@test.com' } } });
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'register@test.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
  });

  it('should fail with duplicate email', async () => {
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User', email: 'duplicate@test.com', password: 'password123' });

    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test User 2', email: 'duplicate@test.com', password: 'password123' });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });

  it('should fail with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'invalid', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail with short password', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({ name: 'Test', email: 'short@test.com', password: '123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/login', () => {
  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: 'login@test.com' } });
    await prisma.user.create({
      data: {
        name: 'Login User',
        email: 'login@test.com',
        password: await hashPassword('password123'),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'login@test.com' } });
  });

  it('should login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
    expect(res.body.data.user.email).toBe('login@test.com');
  });

  it('should fail with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'login@test.com', password: 'wrongpassword' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it('should fail with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nonexistent@test.com', password: 'password123' });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});

describe('POST /api/auth/refresh', () => {
  let userId: number;
  let refreshToken: string;

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: 'refresh@test.com' } });
    const user = await prisma.user.create({
      data: { name: 'Refresh User', email: 'refresh@test.com', password: 'hashed' },
    });
    userId = user.id;
    refreshToken = signRefreshToken({ id: user.id, email: user.email });
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'refresh@test.com' } });
  });

  it('should refresh tokens with valid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveProperty('accessToken');
    expect(res.body.data).toHaveProperty('refreshToken');
  });

  it('should fail with invalid refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: 'invalid-token' });

    expect(res.status).toBe(401);
  });

  it('should fail with token not in database', async () => {
    await prisma.refreshToken.deleteMany({ where: { userId } });
    const fakeToken = signRefreshToken({ id: userId, email: 'refresh@test.com' });
    const res = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken: fakeToken });

    expect(res.status).toBe(401);
  });
});

describe('POST /api/auth/logout', () => {
  let refreshToken: string;

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: 'logout@test.com' } });
    const user = await prisma.user.create({
      data: { name: 'Logout User', email: 'logout@test.com', password: 'hashed' },
    });
    refreshToken = signRefreshToken({ id: user.id, email: user.email });
    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'logout@test.com' } });
  });

  it('should logout and invalidate refresh token', async () => {
    const res = await request(app)
      .post('/api/auth/logout')
      .send({ refreshToken });

    expect(res.status).toBe(200);

    const refreshRes = await request(app)
      .post('/api/auth/refresh')
      .send({ refreshToken });

    expect(refreshRes.status).toBe(401);
  });
});

describe('POST /api/auth/logout-all', () => {
  let accessToken: string;
  let userId: number;

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: 'logoutall@test.com' } });
    const user = await prisma.user.create({
      data: { name: 'LogoutAll User', email: 'logoutall@test.com', password: 'hashed' },
    });
    userId = user.id;
    accessToken = signAccessToken({ id: user.id, email: user.email });

    await prisma.refreshToken.createMany({
      data: [
        { userId: user.id, token: 'token1', expiresAt: new Date(Date.now() + 86400000) },
        { userId: user.id, token: 'token2', expiresAt: new Date(Date.now() + 86400000) },
      ],
    });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'logoutall@test.com' } });
  });

  it('should logout from all devices', async () => {
    const res = await request(app)
      .post('/api/auth/logout-all')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);

    const tokens = await prisma.refreshToken.findMany({ where: { userId } });
    expect(tokens.length).toBe(0);
  });

  it('should fail without auth', async () => {
    const res = await request(app).post('/api/auth/logout-all');

    expect(res.status).toBe(401);
  });
});

describe('GET /api/auth/me', () => {
  let accessToken: string;

  beforeEach(async () => {
    await prisma.user.deleteMany({ where: { email: 'me@test.com' } });
    const user = await prisma.user.create({
      data: { name: 'Me User', email: 'me@test.com', password: 'hashed' },
    });
    accessToken = signAccessToken({ id: user.id, email: user.email });
  });

  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: 'me@test.com' } });
  });

  it('should return current user', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.status).toBe(200);
    expect(res.body.data.user.email).toBe('me@test.com');
  });

  it('should fail without token', async () => {
    const res = await request(app).get('/api/auth/me');

    expect(res.status).toBe(401);
  });

  it('should fail with invalid token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', 'Bearer invalid-token');

    expect(res.status).toBe(401);
  });
});
