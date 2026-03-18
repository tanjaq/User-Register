function validateUsername(username) {
  const validLength = username.length >= 6 && username.length <=30;
  const allowedcharacters = /^[a-zA-Z0-9.]+$/g.test(username);

  return validLength && allowedcharacters;
}
module.exports = validateUsername;