const createApp = require('./app')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')


const port = 3000;

const app = createApp(validateUsername, validatePassword, validateEmail)

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});