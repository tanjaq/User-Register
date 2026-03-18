const validatePassword = require('./validatePassword');

test('return false for empty password', () => {
  expect(validatePassword('')).toBe(false);
});
test('return false for password < 8 characters', () => {
  expect(validatePassword('a123')).toBe(false);
});
test('return false for password = 7 characters', () => {
  expect(validatePassword('QA12ws4')).toBe(false);
});
test('return true for password = 8 characters', () => {
  expect(validatePassword('QWE123as')).toBe(true);
});
test('return true for password => 8 characters', () => {
  expect(validatePassword('QWERTYas34')).toBe(true);
});
test('return false for password => 8 characters, no numbers', () => {
  expect(validatePassword('QWERTYUIui')).toBe(false);
});
test('return false for password => 8 characters, no lowercase', () => {
  expect(validatePassword('ASDQWE123')).toBe(false);
});
test('return false for password => 8 characters, no uppercase', () => {
  expect(validatePassword('asdqweq123')).toBe(false);
});
test('return false for password => 8 characters, no letters', () => {
  expect(validatePassword('657657657')).toBe(false);
});
test('return false for password with special characters', () => {
  expect(validatePassword('asdQW&*()123')).toBe(false);
});
test('return false for password with special characters and underscore', () => {
  expect(validatePassword('asdq_QW$%^12')).toBe(false);
});