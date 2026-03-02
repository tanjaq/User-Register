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

        expect(response.body.userId).toBeDefined()
    })

    test('response content type is json', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.headers['content-type']).toMatch(/json/)
    })

    test('response does not contain error message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.body.error).toBeUndefined()
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

    test('does not return userId on error', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })

        expect(response.body.userId).toBeUndefined()
    })

    test('returns error message', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })

        expect(response.body.error).toBeDefined()
    })

    test('fails when username is missing', async () => {
        const response = await request(app).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400)
    })

    test('fails when password is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400)
    })

    test('fails when email is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })

        expect(response.statusCode).toBe(400)
    })
})

