process.env.JWT_SECRET = 'unit-test-secret';
process.env.JWT_TTL    = '300';

import express from 'express';
import request from 'supertest';
import { beforeAll, describe, expect, it, vi } from 'vitest';


vi.mock('../../src/service/AuthenticationService', () => ({
  login: vi.fn(async (e, p) =>
    e === 'user@example.com' && p === 'supersecret'
      ? { id: 1, role: 'USER', username: 'demo' }
      : null
  ),
}));

vi.mock('../../src/service/JWTService', () => ({
  verifyJWT: vi.fn(() => ({ sub: 1, role: 'USER', username: 'demo' })),
}));

let loginRouter: express.Router;

beforeAll(async () => {
  loginRouter = (await import('../../src/routes/login')).loginRouter;
});

const buildApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/login', loginRouter);
  return app;
};

describe('loginRouter', () => {
  it('POST /login – invalid body → 400', async () => {
    const res = await request(buildApp()).post('/login').send({ email: 'bad', password: '123' });
    expect(res.status).toBe(400);
  });

  it('POST /login – valid credentials → 201 + cookie', async () => {
    const res = await request(buildApp())
      .post('/login')
      .send({ email: 'user@example.com', password: 'supersecret' });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 1, role: 'USER', username: 'demo' });
    expect(res.headers['set-cookie'][0]).toMatch(/access_token=/);
  });

  it('GET /login – no cookie → 401 false', async () => {
    const res = await request(buildApp()).get('/login');
    expect(res.status).toBe(401);
    expect(res.body).toBe(false);
  });

  it('DELETE /login → 200 & cookie cleared', async () => {
    const res = await request(buildApp()).delete('/login');
    expect(res.status).toBe(200);
    expect(res.headers['set-cookie'][0]).toMatch(/access_token=;/);
  });
})
