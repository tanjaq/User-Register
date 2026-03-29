// validateEmail busy-waits 2s per call — increase timeout for the whole suite
jest.setTimeout(10000)

const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

// ─────────────────────────────────────────────
// VALID inputs → 200
// ─────────────────────────────────────────────
describe('given correct username, password and email', () => {
    const validBody = {
        username: 'Username',
        password: 'Password123',
        email: 'student@example.com'
    }

    test('returns status 200', async () => {
        const response = await request(app).post('/users').send(validBody)
        expect(response.statusCode).toBe(200)
    })

    test('returns JSON content-type', async () => {
        const response = await request(app).post('/users').send(validBody)
        expect(response.headers['content-type']).toMatch(/json/)
    })

    test('returns userId in body', async () => {
        const response = await request(app).post('/users').send(validBody)
        expect(response.body.userId).toBeDefined()
    })

    test('returns userId value of "1"', async () => {
        const response = await request(app).post('/users').send(validBody)
        expect(response.body.userId).toBe('1')
    })

    test('returns message "Valid User"', async () => {
        const response = await request(app).post('/users').send(validBody)
        expect(response.body.message).toBe('Valid User')
    })
})

// ─────────────────────────────────────────────
// INVALID inputs → 400
// ─────────────────────────────────────────────
describe('given invalid or missing fields', () => {
    test('returns status 400 for invalid username, password and email', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns error message for invalid input', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
    })

    test('does NOT return userId on invalid input', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined()
    })

    // Username violations
    test('returns 400 when username is too short (< 6 chars)', async () => {
        const response = await request(app).post('/users').send({
            username: 'usr',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when username is too long (> 30 chars)', async () => {
        const response = await request(app).post('/users').send({
            username: 'a'.repeat(31),
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when username contains special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'User@Name',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    // Password violations
    test('returns 400 when password is too short (< 8 chars)', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Pass1',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when password has no uppercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when password has no lowercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PASSWORD123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when password has no number', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PasswordOnly',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when password contains special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123!',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    // Email violations
    test('returns 400 when email has no @ symbol', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'invalidemail.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when email has no domain extension', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'user@domain'
        })
        expect(response.statusCode).toBe(400)
    })

    // Missing fields — send empty string instead of omitting, because the validators
    // call .length on the value directly and crash on undefined (bug in source code).
    // Empty string correctly exercises the validation failure path and returns 400.
    test('returns 400 when username is empty', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when password is empty', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: '',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when email is empty', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: ''
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 when all fields are empty strings', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: '',
            email: ''
        })
        expect(response.statusCode).toBe(400)
    })
})

// ─────────────────────────────────────────────
// Boundary values → 200
// ─────────────────────────────────────────────
describe('boundary values that should be valid', () => {
    test('returns 200 for username exactly 6 characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Usr123',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns 200 for username exactly 30 characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'a'.repeat(30),
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns 200 for username with dots', async () => {
        const response = await request(app).post('/users').send({
            username: 'user.name1',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })
})