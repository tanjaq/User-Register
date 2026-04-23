const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

const validUser = {
    username: 'Username',
    password: 'Password123',
    email: 'student@example.com'
}

function registerUser(overrides = {}) {
    return request(app)
        .post('/users')
        .send({ ...validUser, ...overrides })
}

describe('POST /users', () => {
    describe('given valid user data', () => {
        test('returns status 200', async () => {
            const response = await registerUser()

            expect(response.statusCode).toBe(200)
        })

        test('returns application json content type', async () => {
            const response = await registerUser()

            expect(response.headers['content-type']).toContain('application/json')
        })

        test('returns the expected success payload', async () => {
            const response = await registerUser()

            expect(response.body).toEqual({ userId: '1', message: 'Valid User' })
        })
    })

    describe('given invalid user data', () => {
        test.each([
            ['username is too short', { username: 'user' }],
            ['username contains invalid characters', { username: 'User_name' }],
            ['password is too short', { password: 'Pass12' }],
            ['password is missing an uppercase letter', { password: 'password123' }],
            ['password is missing a lowercase letter', { password: 'PASSWORD123' }],
            ['password is missing a number', { password: 'Password' }],
            ['password contains a special character', { password: 'Password123!' }],
            ['email format is invalid', { email: 'not-an-email' }],
            ['email is not a string', { email: { address: 'student@example.com' } }],
            ['username is missing', { username: undefined }],
            ['password is missing', { password: undefined }],
            ['email is missing', { email: undefined }]
        ])('returns status 400 when %s', async (_, overrides) => {
            const response = await registerUser(overrides)

            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual({ error: 'Invalid User' })
            expect(response.body.userId).not.toBeDefined()
        })
    })
})