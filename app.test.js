const createApp = require('./app');
const validateUsername = require('./validation/validateUsername');
const validatePassword = require('./validation/validatePassword');
const validateEmail = require('./validation/validateEmail');
const runRegistrationApiTestSuite = require('./registrationApiTestSuite');

const app = createApp(validateUsername, validatePassword, validateEmail);

runRegistrationApiTestSuite(app);
