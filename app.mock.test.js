const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        if (!email || typeof email !== 'string') return false
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        return re.test(email)
    })
})

const validateEmail = require('./validation/validateEmail')
const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users', () => {
    test('returns 200 and the expected payload for a valid user', async () => {
        const response = await request(app).post('/users').send({
            username: 'User.name123',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toEqual({
            userId: '1',
            message: 'Valid User'
        })
    })

    test('accepts boundary values that still satisfy the requirements', async () => {
        const response = await request(app).post('/users').send({
            username: 'User.1',
            password: 'Abcdefg1',
            email: 'name@mail.example.org'
        })

        expect(response.statusCode).toBe(200)
        expect(response.body.message).toBe('Valid User')
    })

    test.each([
        ['username is shorter than 6 characters', {
            username: 'user1',
            password: 'Password123',
            email: 'student@example.com'
        }],
        ['username contains invalid characters', {
            username: 'user!name',
            password: 'Password123',
            email: 'student@example.com'
        }],
        ['password is shorter than 8 characters', {
            username: 'Username',
            password: 'Pass12A',
            email: 'student@example.com'
        }],
        ['password is missing an uppercase letter', {
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        }],
        ['password is missing a number', {
            username: 'Username',
            password: 'Password',
            email: 'student@example.com'
        }],
        ['password contains special characters', {
            username: 'Username',
            password: 'Password123!',
            email: 'student@example.com'
        }],
        ['email is missing the @ symbol', {
            username: 'Username',
            password: 'Password123',
            email: 'studentexample.com'
        }],
        ['email is missing a valid domain extension', {
            username: 'Username',
            password: 'Password123',
            email: 'student@example'
        }],
        ['username is missing entirely', {
            password: 'Password123',
            email: 'student@example.com'
        }]
    ])('returns 400 when %s', async (_description, payload) => {
        const response = await request(app).post('/users').send(payload)

        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toEqual({ error: 'Invalid User' })
        expect(response.body.userId).toBeUndefined()
    })
})
