const validateEmail = require('./validateEmail');

test('return false for empty email', () => {
  expect(validateEmail('')).toBe(false);
});

test('return false for missing @', () => {
  expect(validateEmail('userdomain.com')).toBe(false);
});

test('return false for missing domain', () => {
  expect(validateEmail('user@')).toBe(false);
});

test('return true for simple valid email', () => {
  expect(validateEmail('user@example.com')).toBe(true);
});

test('return true for email with subdomain', () => {
  expect(validateEmail('name@mail.example.co')).toBe(true);
});