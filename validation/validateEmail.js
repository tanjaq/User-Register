function validateEmail(email) {
 // This function is intentionally slow: blocks for ~2 seconds to validate an email.
 // This simulates a real-world scenario like checking email validity against an external service.
 const start = Date.now();
 while (Date.now() - start < 2000) {
 // Busy-wait for 2 seconds
 }
 if (!email || typeof email !== 'string') return false;
 const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
 return re.test(email);
}
module.exports = validateEmail;
