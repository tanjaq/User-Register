function createApp(validateUsername, validatePassword, validateEmail) {
    const express = require('express')
    const cors = require('cors')

    const app = express()

    app.use(express.json())
    app.use(cors())

    app.use(express.static(__dirname + '/public'));

    app.post('/users', (req, res) => {
      const { username, password, email } = req.body || {}

      const validUsername = typeof username === 'string' && validateUsername(username)
      const validPassword = typeof password === 'string' && validatePassword(password)
      const validEmail =  typeof email === 'string' && validateEmail(email)

      if (validUsername && validPassword && validEmail) {
        res.send({userId: '1', message: "Valid User"})
      } else {
        res.status(400).send({error: "Invalid User"})
      }
    })

    return app
}

module.exports = createApp;