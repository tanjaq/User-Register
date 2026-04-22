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

    test('returns json with userId "1" and message "Valid User"', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body.userId).toBeDefined();
        expect(response.body.userId).toBe('1')
        expect(response.body.message).toBe('Valid User')
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

    test('returns error message "Invalid User" and no userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('returns 400 for username shorter than 6 characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'usr',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 for username with invalid characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'User@Name!',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 for password without uppercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 for password without a number', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PasswordABC',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns 400 for invalid email format', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })
})