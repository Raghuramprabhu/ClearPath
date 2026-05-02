/**
 * Simple in-memory rate limiter middleware.
 * In production, use Redis or a proper rate limiting service.
 */
const rateLimit = ({ windowMs = 60 * 1000, maxRequests = 30 } = {}) => {
  const requestCounts = new Map();

  // Clean up old entries every minute to prevent memory leaks
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of requestCounts.entries()) {
      if (now - data.windowStart > windowMs) {
        requestCounts.delete(key);
      }
    }
  }, windowMs);

  return (req, res, next) => {
    const clientKey = req.user?.id || req.ip || 'anonymous';
    const now = Date.now();
    const clientData = requestCounts.get(clientKey);

    if (!clientData || now - clientData.windowStart > windowMs) {
      requestCounts.set(clientKey, { windowStart: now, count: 1 });
      return next();
    }

    if (clientData.count >= maxRequests) {
      return res.status(429).json({
        error: 'Too many requests. Please try again later.',
        retryAfterMs: windowMs - (now - clientData.windowStart),
      });
    }

    clientData.count += 1;
    next();
  };
};

module.exports = { rateLimit };
