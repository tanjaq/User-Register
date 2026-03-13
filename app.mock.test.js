jest.mock('./validation/validateEmail', () => jest.fn(() => true))

const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBeDefined();
    })
    // test response content type?
    test('return response content type', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toMatch(/json/)
    })
    // test response message
    test('return response message', async () => { //fix test
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.message).toBe('Valid User')
    })
    // test response user id value
        test('return response user id value', async () => { //fix test
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(Number(response.body.userId)).toBeGreaterThan(0)
    // ...
    })
})

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    // test response message
    test('return error message', async () => { //fix test
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
    })

    // test that response does NOT have userId
    test('return no userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined();
    })
    // test incorrect username or password according to requirements
    test('return error message for incorrect username', async () => { //fix test
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.error).toBe('Invalid User')
    })
    // test missing username or password
    test('return error message for missing username', async () => {//fix test
        const response = await request(app).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
    })
    // ...
})
