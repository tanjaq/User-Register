const createApp = require('./app');
const validateUsername = require('./validation/validateUsername');
const validatePassword = require('./validation/validatePassword');
const runRegistrationApiTestSuite = require('./registrationApiTestSuite');

jest.mock('./validation/validateEmail', () => jest.fn((email) => {
  if (!email || typeof email !== 'string') {
    return false;
  }

  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
  return re.test(email);
}));

const validateEmail = require('./validation/validateEmail');
const app = createApp(validateUsername, validatePassword, validateEmail);

runRegistrationApiTestSuite(app);
