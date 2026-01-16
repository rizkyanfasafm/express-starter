import request from 'supertest';
import {expect, it} from "vitest";
import {createApp} from "@/app";

it('can health check', async () => {
  const app = createApp();
  const res = await request(app).get('/health');
  expect(res.status).toBe(200);
});
