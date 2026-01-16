import request from 'supertest';
import { expect, it, describe, beforeEach, afterAll } from 'vitest';
import { createApp } from '@/app';
import { prisma } from '@/db/prisma';

describe('POST /api/auth/register', () => {
  const app = createApp();

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
