const { sanitizeInput } = require('../middleware/sanitize');

describe('sanitizeInput middleware', () => {
  const createReq = (body) => ({ body });
  const res = {};
  const next = jest.fn();

  beforeEach(() => next.mockClear());

  it('strips script tags from strings', () => {
    const req = createReq({ text: 'hello <script>alert("xss")</script> world' });
    sanitizeInput(req, res, next);
    expect(req.body.text).toBe('hello alert("xss") world');
    expect(next).toHaveBeenCalled();
  });

  it('strips HTML tags from strings', () => {
    const req = createReq({ text: '<b>bold</b> <img src=x>' });
    sanitizeInput(req, res, next);
    expect(req.body.text).toBe('bold');
    expect(next).toHaveBeenCalled();
  });

  it('strips javascript: protocol', () => {
    const req = createReq({ link: 'javascript:alert(1)' });
    sanitizeInput(req, res, next);
    expect(req.body.link).not.toContain('javascript:');
    expect(next).toHaveBeenCalled();
  });

  it('strips event handlers', () => {
    const req = createReq({ text: 'onclick=alert(1)' });
    sanitizeInput(req, res, next);
    expect(req.body.text).not.toMatch(/onclick/i);
    expect(next).toHaveBeenCalled();
  });

  it('trims whitespace', () => {
    const req = createReq({ text: '  hello  ' });
    sanitizeInput(req, res, next);
    expect(req.body.text).toBe('hello');
  });

  it('handles nested objects', () => {
    const req = createReq({ data: { inner: '<script>xss</script>' } });
    sanitizeInput(req, res, next);
    expect(req.body.data.inner).not.toContain('<script>');
  });

  it('handles arrays', () => {
    const req = createReq({ items: ['<b>one</b>', '<script>two</script>'] });
    sanitizeInput(req, res, next);
    expect(req.body.items[0]).toBe('one');
    expect(req.body.items[1]).not.toContain('<script>');
  });

  it('passes through numbers and booleans unchanged', () => {
    const req = createReq({ count: 42, active: true });
    sanitizeInput(req, res, next);
    expect(req.body.count).toBe(42);
    expect(req.body.active).toBe(true);
  });

  it('handles null body gracefully', () => {
    const req = { body: null };
    sanitizeInput(req, res, next);
    expect(next).toHaveBeenCalled();
  });
});
