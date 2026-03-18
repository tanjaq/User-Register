function validateEmail(email) {
  const start = Date.now();
  while (Date.now() - start < 2000) {
  }

  if (!email || typeof email !== 'string') return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}

module.exports = validateEmail;