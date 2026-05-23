const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users', () => {
    test('returns 200 and valid user payload for valid input', async () => {
        const response = await request(app).post('/users').send({
            username: 'User.Name123',
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

    test.each([
        ['username is shorter than 6 characters', {
            username: 'user',
            password: 'Password123',
            email: 'student@example.com'
        }],
        ['username contains special characters', {
            username: 'user!23',
            password: 'Password123',
            email: 'student@example.com'
        }],
        ['password is shorter than 8 characters', {
            username: 'Valid.User',
            password: 'Pass123',
            email: 'student@example.com'
        }],
        ['password is missing an uppercase letter', {
            username: 'Valid.User',
            password: 'password123',
            email: 'student@example.com'
        }],
        ['password is missing a lowercase letter', {
            username: 'Valid.User',
            password: 'PASSWORD123',
            email: 'student@example.com'
        }],
        ['password is missing a number', {
            username: 'Valid.User',
            password: 'Password',
            email: 'student@example.com'
        }],
        ['password contains special characters', {
            username: 'Valid.User',
            password: 'Password123!',
            email: 'student@example.com'
        }],
        ['email is missing @', {
            username: 'Valid.User',
            password: 'Password123',
            email: 'studentexample.com'
        }],
        ['email is missing a valid domain extension', {
            username: 'Valid.User',
            password: 'Password123',
            email: 'student@example'
        }],
        ['username is missing', {
            password: 'Password123',
            email: 'student@example.com'
        }],
        ['password is missing', {
            username: 'Valid.User',
            email: 'student@example.com'
        }],
        ['email is missing', {
            username: 'Valid.User',
            password: 'Password123'
        }]
    ])('returns 400 and error payload when %s', async (_scenario, payload) => {
        const response = await request(app).post('/users').send(payload)

        expect(response.statusCode).toBe(400)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toEqual({
            error: 'Invalid User'
        })
        expect(response.body.userId).toBeUndefined()
    })
})