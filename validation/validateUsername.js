function validateUsername(username) {
  if (typeof username !== 'string') return false;
  return username.length >= 6 && username.length <= 30 && /^[a-zA-Z0-9.]+$/.test(username);
}
module.exports = validateUsername;
