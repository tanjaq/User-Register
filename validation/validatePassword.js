function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;

  const validLength = password.length >= 8;
  const hasNumber = /[0-9]/.test(password);
  const hasUpperCaseLetters = /[A-Z]/.test(password);
  const hasLowerCaseLetters = /[a-z]/.test(password);
  const hasSpecialCharacters = /[^a-zA-Z0-9]/.test(password);

  return (
    validLength &&
    hasNumber &&
    hasLowerCaseLetters &&
    hasUpperCaseLetters &&
    !hasSpecialCharacters
  );
}

module.exports = validatePassword;