const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)
const validUser = {
    username: 'ValidUser123',
    password: 'Password123',
    email: 'student@example.com'
}

describe('given correct username and password', () => {
    test('returns success response with userId', async () => {
        const response = await request(app).post('/users').send(validUser)
        expect(response.statusCode).toBe(200)
        expect(response.headers['content-type']).toMatch(/application\/json/)
        expect(response.body).toEqual({ userId: '1', message: 'Valid User' })
    })
})

describe('given incorrect or missing username and password', () => {
    const invalidCases = [
        {
            name: 'username is too short',
            payload: { ...validUser, username: 'user' }
        },
        {
            name: 'password is missing uppercase letter',
            payload: { ...validUser, password: 'password123' }
        },
        {
            name: 'username contains invalid characters',
            payload: { ...validUser, username: 'Invalid@User' }
        },
        {
            name: 'email format is invalid',
            payload: { ...validUser, email: 'not-an-email' }
        },
        {
            name: 'password is missing',
            payload: { ...validUser, password: '' }
        }
    ]

    test.each(invalidCases)('returns error when $name', async ({ payload }) => {
        const response = await request(app).post('/users').send(payload)
        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toMatch(/application\/json/)
        expect(response.body).toEqual({ error: 'Invalid User' })
        expect(response.body.userId).toBeUndefined()
    })
})