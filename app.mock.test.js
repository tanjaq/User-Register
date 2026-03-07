jest.mock('./validation/validateEmail', () => jest.fn())

const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

jest.setTimeout(10000)

const validUser = {
    username: 'ValidUser',
    password: 'Password1',
    email: 'student@example.com'
}

const postUser = (overrides = {}) => request(app).post('/users').send({
    ...validUser,
    ...overrides
})

beforeEach(() => {
    validateEmail.mockClear()
    validateEmail.mockReturnValue(true)
})

describe('POST /users with mocked email validation', () => {
    describe('given valid username, password and email', () => {
        test('returns 200 with Valid User payload', async () => {
            const response = await postUser()

            expect(validateEmail).toHaveBeenCalledWith(validUser.email)
            expect(response.statusCode).toBe(200)
            expect(response.headers['content-type']).toMatch(/json/)
            expect(response.body).toEqual({ userId: '1', message: 'Valid User' })
        })
    })

    describe('username validation', () => {
        test('rejects username shorter than 6 characters', async () => {
            const response = await postUser({ username: 'short' })

            expect(response.statusCode).toBe(400)
            expect(response.body).toEqual({ error: 'Invalid User' })
            expect(response.body).not.toHaveProperty('userId')
        })

        test('rejects username longer than 30 characters', async () => {
            const response = await postUser({ username: 'a'.repeat(31) })

            expect(response.statusCode).toBe(400)
        })

        test('rejects username with special characters', async () => {
            const response = await postUser({ username: 'User@name' })

            expect(response.statusCode).toBe(400)
        })
    })

    describe('password validation', () => {
        test('rejects password shorter than 8 characters', async () => {
            const response = await postUser({ password: 'Pwd1Aa' })

            expect(response.statusCode).toBe(400)
        })

        test('rejects password without uppercase letters', async () => {
            const response = await postUser({ password: 'password1' })

            expect(response.statusCode).toBe(400)
        })

        test('rejects password without lowercase letters', async () => {
            const response = await postUser({ password: 'PASSWORD1' })

            expect(response.statusCode).toBe(400)
        })

        test('rejects password without numbers', async () => {
            const response = await postUser({ password: 'Password' })

            expect(response.statusCode).toBe(400)
        })

        test('rejects password with special characters', async () => {
            const response = await postUser({ password: 'Password1!' })

            expect(response.statusCode).toBe(400)
        })
    })

    describe('email validation', () => {
        test('rejects invalid email format', async () => {
            validateEmail.mockReturnValue(false)
            const response = await postUser({ email: 'studentexample.com' })

            expect(validateEmail).toHaveBeenCalledWith('studentexample.com')
            expect(response.statusCode).toBe(400)
        })

        test('rejects email without domain extension', async () => {
            validateEmail.mockReturnValue(false)
            const response = await postUser({ email: 'student@example' })

            expect(validateEmail).toHaveBeenCalledWith('student@example')
            expect(response.statusCode).toBe(400)
        })
    })
})
