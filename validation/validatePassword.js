function validatePassword(password) {
  const validLength = password.length >= 8;
  const hasNumber = /[0-9]/g.test(password);
  const hasUpperCaseLetters = /[A-Z]/g.test(password);
  const hasLowerCaseLetters = /[a-z]/g.test(password);
  const hasSpecialCharacters = /[\W]/g.test(password);

  return validLength && hasNumber && hasLowerCaseLetters && hasUpperCaseLetters && !hasSpecialCharacters;
}
module.exports = validatePassword;