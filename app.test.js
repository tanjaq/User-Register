const createApp = require('./app')
const request = require('supertest')

// Use real validators for invalid input tests
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

// Mock only email to isolate tests
jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        if (!email || typeof email !== 'string') return false
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        return re.test(email)
    })
})
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users - invalid inputs', () => {
    const invalidCases = [
        {username: 'usr', password: 'StrongPass123!', email: 'student@example.com'},
        {username: 'ValidUser', password: '123', email: 'student@example.com'},
        {username: 'ValidUser', password: 'StrongPass123!', email: 'not-an-email'},
        {username: '', password: '', email: 'student@example.com'},
        {username: 'ValidUser', password: 'StrongPass123!', email: ''},
        {username: '', password: '', email: ''}, // empty strings instead of null/undefined
        {username: '', password: '', email: ''}
    ]

    invalidCases.forEach((input, index) => {
        test(`invalid input case #${index + 1} returns 400 and error`, async () => {
            const response = await request(app).post('/users').send(input)
            expect(response.statusCode).toBe(400)
            expect(response.body.error).toBe('Invalid User')
            expect(response.body.userId).toBeUndefined()
        })
    })
})