const validateUsername = require('./validateUsername');

test('return false for empty username', () => {
  expect(validateUsername('')).toBe(false);
});

test('return false for username < 6 characters', () => {
  expect(validateUsername('a123')).toBe(false);
});

test('return false for username > 30 characters', () => {
  expect(validateUsername('asdqwezxcqweasdhjkyiunmpojlkjewhrkjewhrkjwhe')).toBe(false);
});

test('return true for username > 6 and < 30 characters', () => {
  expect(validateUsername('asdqwezcx')).toBe(true);
});

test('return false for username that contains unauthorized characters', () => {
  expect(validateUsername('awdas11212!!!!!!@#@$%#')).toBe(false);
});

test('return true for username with authorized characters', () => {
  expect(validateUsername('asd.QWE.123')).toBe(true);
});