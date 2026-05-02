const jwt = require('jsonwebtoken');
const { authenticate } = require('../middleware/auth');

describe('authenticate middleware', () => {
  let req;
  let res;
  let next;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  it('returns 401 when no token is present', () => {
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Authentication required' });
    expect(next).not.toHaveBeenCalled();
  });

  it('returns 401 for invalid token', () => {
    req.cookies.auth_token = 'invalid-token';
    authenticate(req, res, next);
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid or expired token' });
    expect(next).not.toHaveBeenCalled();
  });

  it('attaches user to req for valid token', () => {
    const user = { id: '123', email: 'test@example.com', name: 'Test User' };
    const token = jwt.sign(user, 'fallback_secret', { expiresIn: '1h' });
    req.cookies.auth_token = token;
    authenticate(req, res, next);
    expect(next).toHaveBeenCalled();
    expect(req.user).toBeDefined();
    expect(req.user.email).toBe('test@example.com');
  });

  it('returns 401 for expired token', () => {
    const user = { id: '123', email: 'test@example.com' };
    const token = jwt.sign(user, 'fallback_secret', { expiresIn: '0s' });
    req.cookies.auth_token = token;

    // Wait a moment for token to expire
    setTimeout(() => {
      authenticate(req, res, next);
      expect(res.status).toHaveBeenCalledWith(401);
    }, 10);
  });
});
