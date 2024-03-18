const createApp = require('./app')
const request = require('supertest')

const mockedValidatePassword = jest.fn(password => password.length >= 8);
const mockedValidateUsername = jest.fn(username => username.length >= 6 && username.length <= 30)

const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

const app = createApp(mockedValidateUsername, mockedValidatePassword)

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.body.userId).toBeDefined();
    })

    // test response content type?
    // test response message
    // test response user id value
    // ...
})

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        })
        expect(response.statusCode).toBe(400)
    })

    // test response message
    // test that response does NOT have userId
    // test incorrect username or password according to requirements
    // test missing username or password
    // ...
})