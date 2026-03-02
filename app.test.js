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

    test('returns correct userId value', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBe('1')
    })

    test('returns success message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.message).toBe('Valid User')
    })

    test('response content type is JSON', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toMatch(/json/)
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

    test('response does NOT have userId', async () => {
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
        expect(response.body.error).toBe('Invalid User')
    })

    test('rejects username that is too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'short',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
    })

    test('rejects password that is too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Pass1',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects password without uppercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects password without lowercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PASSWORD123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects password without number', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PasswordABC',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects password with special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password@123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects invalid email format', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects email without @ symbol', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'studentexample.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects email without domain extension', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects missing email', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects missing username', async () => {
        const response = await request(app).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects missing password', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })
})

describe('valid username requirements', () => {
    test('accepts username with 6 characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'user12',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('accepts username with 30 characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'user.name.with.dots123456789',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('accepts username with letters and numbers', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username123',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('accepts username with periods', async () => {
        const response = await request(app).post('/users').send({
            username: 'user.name.test',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('rejects username with special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'user@name',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('rejects username that is too long', async () => {
        const response = await request(app).post('/users').send({
            username: 'user.name.with.too.many.characters.here',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })
})

describe('valid email requirements', () => {
    test('accepts valid email with .com domain', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('accepts valid email with .edu domain', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@university.edu'
        })
        expect(response.statusCode).toBe(200)
    })

    test('accepts valid email with .org domain', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'contact@organization.org'
        })
        expect(response.statusCode).toBe(200)
    })
})