const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users - valid inputs', () => {
    test('returns 200, userId, and message', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUser',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.userId).toBeDefined()
        expect(response.body.message).toBe('Valid User')
    })
})

describe('POST /users - invalid inputs', () => {
    const invalidCases = [
        {}, // all missing
        { username: '', password: '', email: '' },
        { username: 'usr', password: '123', email: 'invalid' },
        { username: 'short', password: 'nopass1', email: 'a@b' },
        { username: null, password: 'Password1', email: 'test@example.com' },
        { username: 'ValidName', password: null, email: 'test@example.com' },
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