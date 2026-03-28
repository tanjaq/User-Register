function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;

  const validLength = username.length >= 6 && username.length <= 30;
  const allowedCharacters = /^[a-zA-Z0-9.]+$/.test(username);

  return validLength && allowedCharacters;
}

module.exports = validateUsername;