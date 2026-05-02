const express = require('express');
const request = require('supertest');

// We test the ippo routes by creating a mini express app
// Mock the gemini service to avoid real API calls
jest.mock('../services/gemini', () => ({
  generateIppoBreakdown: jest.fn().mockResolvedValue({
    original_task: 'Test task',
    steps: [
      { step_number: 1, step: 'First step', effort_minutes: 5, momentum_starter: true, celebration_message: 'Great start!' },
      { step_number: 2, step: 'Second step', effort_minutes: 10, momentum_starter: false, celebration_message: 'Keep going!' },
    ],
    momentum_tip: 'Start small',
    estimated_total_minutes: 15,
  }),
  generateIppoRecovery: jest.fn().mockResolvedValue({
    acknowledgement: 'It is okay to feel stuck.',
    recovery_steps: [{ step: 'Breathe', duration_seconds: 30, icon: '🌬️' }],
    momentum_starter: 'Open the file',
    encouragement: 'You can do this.',
  }),
}));

const ippoRouter = require('../routes/ippo');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/ippo', ippoRouter);
  return app;
};

describe('Ippo Routes', () => {
  let app;
  beforeAll(() => { app = createApp(); });

  describe('POST /api/ippo/breakdown', () => {
    it('returns 400 when taskDescription is missing', async () => {
      const res = await request(app).post('/api/ippo/breakdown').send({});
      expect(res.status).toBe(400);
      expect(res.body.error).toBeDefined();
    });

    it('returns breakdown for valid task', async () => {
      const res = await request(app).post('/api/ippo/breakdown').send({ taskDescription: 'Build a feature' });
      expect(res.status).toBe(200);
      expect(res.body.breakdown).toBeDefined();
      expect(res.body.breakdown.steps.length).toBeGreaterThan(0);
    });

    it('accepts neurodivergent mode flag', async () => {
      const res = await request(app).post('/api/ippo/breakdown').send({ taskDescription: 'Build a feature', neurodivergentMode: true });
      expect(res.status).toBe(200);
      expect(res.body.mode).toBe('supportive');
    });
  });

  describe('POST /api/ippo/recovery', () => {
    it('returns 400 when taskDescription is missing', async () => {
      const res = await request(app).post('/api/ippo/recovery').send({});
      expect(res.status).toBe(400);
    });

    it('returns recovery protocol', async () => {
      const res = await request(app).post('/api/ippo/recovery').send({ taskDescription: 'Overwhelming task' });
      expect(res.status).toBe(200);
      expect(res.body.recovery).toBeDefined();
      expect(res.body.private).toBe(true);
    });
  });

  describe('POST /api/ippo/complete', () => {
    it('returns celebration for step completion', async () => {
      const res = await request(app).post('/api/ippo/complete').send({ taskTitle: 'Test', stepNumber: 1, totalSteps: 3 });
      expect(res.status).toBe(200);
      expect(res.body.message).toBeDefined();
      expect(res.body.progress.percentComplete).toBe(33);
    });

    it('returns full completion celebration', async () => {
      const res = await request(app).post('/api/ippo/complete').send({ taskTitle: 'Test', stepNumber: 3, totalSteps: 3, isFullComplete: true });
      expect(res.status).toBe(200);
      expect(res.body.isFullComplete).toBe(true);
    });
  });
});
