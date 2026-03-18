const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

// Mock validateEmail to isolate tests
jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        if (!email || typeof email !== 'string') return false
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        return re.test(email)
    })
})

const validateEmail = require('./validation/validateEmail')
const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users - valid inputs', () => {
    test('returns 200, userId, and message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username123',
            password: 'Password1',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.userId).toBeDefined()
        expect(response.body.message).toBe('Valid User')
    })
})

describe('POST /users - invalid inputs', () => {
    const invalidCases = [
        { username: 'usr', password: '123', email: 'notanemail' },
        { username: 'short', password: 'weak', email: '' },
        { username: '', password: 'Password123', email: 'test@example.com' },
        { username: 'ValidName', password: '', email: 'test@example.com' },
        { username: 'ValidName', password: 'Password123', email: null },
    ]

    invalidCases.forEach((input, index) => {
        test(`invalid input case #${index + 1} returns 400 and error`, async () => {
            const response = await request(app).post('/users').send(input)
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toBe('Invalid User')
        })
    })
})