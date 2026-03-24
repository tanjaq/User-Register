const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

const mockValidateEmail = jest.fn()

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

    test('returns 400 when email validation fails', async () => {
        mockValidateEmail.mockReturnValue(false)

        const res = await request(mockApp).post('/users').send(validUser)

        expect(res.statusCode).toBe(400)
        expect(res.body.error).toBeDefined()
    })
})
