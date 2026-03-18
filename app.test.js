const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

const VALID_USER = {
    username: 'Username',
    password: 'Password123',
    email: 'student@example.com'
}

describe('given correct username, password and email', () => {
    test('returns status 200', async () => {
        const response = await request(app).post('/users').send(VALID_USER)
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send(VALID_USER)
        expect(response.body.userId).toBeDefined()
    })

    test('returns userId value of "1"', async () => {
        const response = await request(app).post('/users').send(VALID_USER)
        expect(response.body.userId).toBe('1')
    })

    test('returns success message', async () => {
        const response = await request(app).post('/users').send(VALID_USER)
        expect(response.body.message).toBe('Valid User')
    })

    test('response content-type is JSON', async () => {
        const response = await request(app).post('/users').send(VALID_USER)
        expect(response.headers['content-type']).toMatch(/json/)
    })
})

describe('given incorrect or missing credentials', () => {
    test('returns status 400 when all fields are invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns error message when credentials are invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
    })

    test('does NOT return userId when credentials are invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined()
    })

    test('returns status 400 when username is too short (< 6 chars)', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            username: 'abc'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when username is too long (> 30 chars)', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            username: 'a'.repeat(31)
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when username contains special characters', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            username: 'User@Name!'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password has no uppercase letter', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            password: 'password123'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password has no number', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            password: 'PasswordOnly'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is too short (< 8 chars)', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            password: 'Pass1'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password contains special characters', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            password: 'Password123!'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email is missing @ symbol', async () => {
        const response = await request(app).post('/users').send({
            ...VALID_USER,
            email: 'invalidemail.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when username is missing', async () => {
        const response = await request(app).post('/users').send({
            password: VALID_USER.password,
            email: VALID_USER.email
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is missing', async () => {
        const response = await request(app).post('/users').send({
            username: VALID_USER.username,
            email: VALID_USER.email
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email is missing', async () => {
        const response = await request(app).post('/users').send({
            username: VALID_USER.username,
            password: VALID_USER.password
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when body is empty', async () => {
        const response = await request(app).post('/users').send({})
        expect(response.statusCode).toBe(400)
    })
})