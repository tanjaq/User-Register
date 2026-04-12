jest.mock('./validation/validateEmail', () => jest.fn())

const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

beforeEach(() => {
    validateEmail.mockReset()
})

describe('given correct username and password', () => {
    test('return status 200', async () => {
        validateEmail.mockReturnValue(true)

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        validateEmail.mockReturnValue(true)

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBeDefined();
    })

    test('returns correct message', async () => {
        validateEmail.mockReturnValue(true)

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.message).toBe("Valid User")
    })

    test('content-type is json', async () => {
        validateEmail.mockReturnValue(true)

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toMatch(/json/)
    })

    test('userId has correct value', async () => {
        validateEmail.mockReturnValue(true)

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
        validateEmail.mockReturnValue(false)

        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns error message', async () => {
        validateEmail.mockReturnValue(false)

        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe("Invalid User")
    })

    test('does NOT return userId', async () => {
        validateEmail.mockReturnValue(false)

        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined()
    })

    test('missing username returns 400', async () => {
        validateEmail.mockReturnValue(true)

        const response = await request(app).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('missing password returns 400', async () => {
        validateEmail.mockReturnValue(true)

        const response = await request(app).post('/users').send({
            username: 'Username',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('missing email returns 400 (coverage for validateEmail)', async () => {
        validateEmail.mockReturnValue(false)

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })

        expect(response.statusCode).toBe(400)
    })

    test('email is not a string returns 400', async () => {
        validateEmail.mockReturnValue(false)

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 12345
        })

        expect(response.statusCode).toBe(400)
    })
})