const { rateLimit } = require('../middleware/rateLimiter');

describe('rateLimit middleware', () => {
  let limiter;
  let req;
  let res;
  let next;

  beforeEach(() => {
    limiter = rateLimit({ windowMs: 1000, maxRequests: 3 });
    req = { ip: '127.0.0.1' };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('allows requests under the limit', () => {
    limiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('allows multiple requests under the limit', () => {
    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);
    expect(next).toHaveBeenCalledTimes(3);
  });

  it('blocks requests over the limit', () => {
    limiter(req, res, next);
    limiter(req, res, next);
    limiter(req, res, next);
    next.mockClear();
    limiter(req, res, next);
    expect(next).not.toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(429);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: expect.any(String) }));
  });

  it('uses user ID when available', () => {
    const authedReq = { ip: '127.0.0.1', user: { id: 'user123' } };
    limiter(authedReq, res, next);
    expect(next).toHaveBeenCalled();
  });

  it('resets after window expires', async () => {
    const fastLimiter = rateLimit({ windowMs: 100, maxRequests: 1 });
    fastLimiter(req, res, next);
    next.mockClear();
    fastLimiter(req, res, next);
    expect(next).not.toHaveBeenCalled();

    await new Promise((r) => setTimeout(r, 150));
    next.mockClear();
    fastLimiter(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
