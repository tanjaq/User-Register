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

    test('returns content type json', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toContain('application/json')
    })

    test('returns success message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.message).toBe('Valid User')
    })

    test('returns user id value 1', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBe('1')
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

    test('returns error message', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
    })

    test('does not return userId when user is invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined()
    })

    test('returns status 400 when username is too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'user1',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when username is too long', async () => {
        const response = await request(app).post('/users').send({
            username: 'a'.repeat(31),
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when username contains invalid characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'user_name',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Pass12',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is missing uppercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is missing lowercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PASSWORD123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is missing number', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password contains special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123!',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email format is invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email is missing @ symbol', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'studentexample.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email is missing domain extension', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email has too short extension', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.x'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email is missing text before @', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: '@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when username is empty', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password is empty', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: '',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(400)
    })
})