function validatePassword(password) {
  if (typeof password !== 'string') return false;
  return password.length >= 8 && /[0-9]/.test(password) && /[A-Z]/.test(password)
    && /[a-z]/.test(password) && /^[a-zA-Z0-9]+$/.test(password);
}
module.exports = validatePassword;
