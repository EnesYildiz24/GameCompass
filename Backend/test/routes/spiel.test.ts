import { describe, it, beforeAll, afterAll, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Spiel } from '../../src/model/SpielModel';
import { spielRouter } from '../../src/routes/spiel';
import axios from 'axios';


vi.mock('axios');
const mockedAxios = axios as unknown as { get: typeof axios.get };


const rawgGamesMock = {
  data: {
    results: [
      {
        name: 'Test Game 1',
        slug: 'test-game-1',
        released: '2024-01-01',
        developer: 'Test Dev',
        background_image: 'https://example.com/image.jpg',
        rating: 4.5,
        genres: [{ id: 1, name: 'Action' }],
        platforms: [{ platform: { name: 'PC' } }],
      },
      {
        name: 'Test Game 2',
        slug: 'test-game-2',
        released: '2023-12-12',
        developer: 'Test Studio',
        background_image: 'https://example.com/image2.jpg',
        rating: 4.2,
        genres: [{ id: 2, name: 'Adventure' }],
        platforms: [{ platform: { name: 'PlayStation 5' } }],
      },
    ],
  },
};

describe('Integrationstest: /import-rawg', () => {
  let mongoServer: MongoMemoryServer;
  let app: express.Express;

  beforeAll(async () => {
    
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    await mongoose.connect(uri);
    app = express();
    app.use(express.json());
    app.use('/api/games', spielRouter);

    
    mockedAxios.get = vi.fn().mockResolvedValue(rawgGamesMock);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('importiert Spiele aus der RAWG-API und speichert sie in der DB', async () => {
    const res = await request(app).post('/api/games/import-rawg');
  
    expect(res.status).toBe(201);
    expect(res.body.count).toBe(60);
  
    const spiele = await Spiel.find();
    expect(spiele.length).toBe(60);
    expect(spiele[0].name).toBe('Test Game 1');
  });
});