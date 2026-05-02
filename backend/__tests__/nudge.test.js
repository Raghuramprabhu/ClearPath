const express = require('express');
const request = require('supertest');

jest.mock('../services/gemini', () => ({
  generateGentleNudge: jest.fn().mockResolvedValue({
    message: 'Hey, just checking in on this task. No pressure at all.',
    options: [
      { id: 'more_time', label: 'I need more time', action: 'reschedule' },
      { id: 'need_input', label: 'I need input from someone', action: 'schedule_help' },
      { id: 'need_support', label: 'I need support', action: 'escalate_with_context' },
    ],
    tone_check: 'supportive',
  }),
}));

const nudgeRouter = require('../routes/nudge');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/nudge', nudgeRouter);
  return app;
};

describe('Nudge Routes', () => {
  let app;
  beforeAll(() => { app = createApp(); });

  describe('POST /api/nudge/check', () => {
    it('returns 400 when required fields are missing', async () => {
      const res = await request(app).post('/api/nudge/check').send({});
      expect(res.status).toBe(400);
    });

    it('generates a gentle nudge', async () => {
      const res = await request(app).post('/api/nudge/check').send({
        taskName: 'API docs', assigneeName: 'Raghu', daysSinceUpdate: 4, deadline: 'May 5',
      });
      expect(res.status).toBe(200);
      expect(res.body.nudge).toBeDefined();
      expect(res.body.metadata.managerNotified).toBe(false);
    });
  });

  describe('POST /api/nudge/respond', () => {
    it('returns 400 for missing responseOption', async () => {
      const res = await request(app).post('/api/nudge/respond').send({});
      expect(res.status).toBe(400);
    });

    it('handles more_time response without notifying manager', async () => {
      const res = await request(app).post('/api/nudge/respond').send({ taskId: '1', responseOption: 'more_time' });
      expect(res.status).toBe(200);
      expect(res.body.managerNotified).toBe(false);
      expect(res.body.action).toBe('rescheduled');
    });

    it('handles need_support response with manager notification', async () => {
      const res = await request(app).post('/api/nudge/respond').send({ taskId: '1', responseOption: 'need_support' });
      expect(res.status).toBe(200);
      expect(res.body.managerNotified).toBe(true);
    });

    it('returns 400 for invalid response option', async () => {
      const res = await request(app).post('/api/nudge/respond').send({ taskId: '1', responseOption: 'invalid' });
      expect(res.status).toBe(400);
    });
  });
});
