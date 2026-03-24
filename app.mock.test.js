const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const mockValidateEmail = jest.fn()

const app = createApp(validateUsername, validatePassword, validateEmail)
const mockApp = createApp(validateUsername, validatePassword, mockValidateEmail)

describe('POST /users (mocked email validation)', () => {

    const validUser = {
        username: 'Username',
        password: 'Password123',
        email: 'student@example.com'
    }

    beforeEach(() => {
        mockValidateEmail.mockReset()
        mockValidateEmail.mockReturnValue(true)
    })

    test('calls validateEmail with correct value', async () => {
        await request(mockApp).post('/users').send(validUser)
        expect(mockValidateEmail).toHaveBeenCalledWith('student@example.com')
    })

    test('calls validateEmail exactly once', async () => {
        await request(mockApp).post('/users').send(validUser)
        expect(mockValidateEmail).toHaveBeenCalledTimes(1)
    })

    test('returns 400 when email validation fails (mocked)', async () => {
        mockValidateEmail.mockReturnValue(false)

        const res = await request(mockApp).post('/users').send(validUser)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBeDefined()
    })
})

describe('POST /users (real validation)', () => {

    const validUser = {
        username: 'Username',
        password: 'Password123',
        email: 'student@example.com'
    }

    const invalidUser = {
        username: 'user',
        password: 'password',
        email: 'not-an-email'
    }

    describe('given valid input', () => {

        test('returns 200', async () => {
            const res = await request(app).post('/users').send(validUser)
            expect(res.statusCode).toBe(200)
        })

        test('returns userId as string', async () => {
            const res = await request(app).post('/users').send(validUser)
            expect(typeof res.body.userId).toBe('string')
        })

        test('includes message', async () => {
            const res = await request(app).post('/users').send(validUser)
            expect(typeof res.body.message).toBe('string')
        })

        test('content-type is json', async () => {
            const res = await request(app).post('/users').send(validUser)
            expect(res.headers['content-type']).toMatch(/application\/json/)
        })
    })

    describe('given invalid input', () => {

        test('returns 400 for invalid username/password/email', async () => {
            const res = await request(app).post('/users').send(invalidUser)
            expect(res.statusCode).toBe(400)
        })

        test('returns only error field', async () => {
            const res = await request(app).post('/users').send(invalidUser)
            expect(Object.keys(res.body)).toEqual(['error'])
        })

        test('does not return userId', async () => {
            const res = await request(app).post('/users').send(invalidUser)
            expect(res.body.userId).toBeUndefined()
        })

        test('empty fields return 400', async () => {
            const res = await request(app).post('/users').send({
                username: '',
                password: '',
                email: ''
            })

            expect(res.statusCode).toBe(400)
        })

        test('missing username', async () => {
            const res = await request(app).post('/users').send({
                password: 'Password123',
                email: 'student@example.com'
            })

            expect(res.statusCode).toBe(400)
        })

        test('missing password', async () => {
            const res = await request(app).post('/users').send({
                username: 'Username',
                email: 'student@example.com'
            })

            expect(res.statusCode).toBe(400)
        })

        test('missing email', async () => {
            const res = await request(app).post('/users').send({
                username: 'Username',
                password: 'Password123'
            })

            expect(res.statusCode).toBe(400)
        })
    })
})