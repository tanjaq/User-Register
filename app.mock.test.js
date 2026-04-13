jest.mock('./validation/validateEmail', () => jest.fn(() => true))

const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBeDefined();
    })

    test('returns correct message, userId value and content-type', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBe('1')
        expect(response.body.message).toBe('Valid User')
        expect(response.headers['content-type']).toMatch(/application\/json/)
    })
})

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })
    test('returns error message and does not include userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
        expect(response.headers['content-type']).toMatch(/application\/json/)
    })
})

describe('edge cases and performance-friendly tests', () => {
    test('missing username returns 400 and no userId', async () => {
        const validateUsernameMock = (u) => !!u && u.length >= 6
        const validatePasswordMock = (p) => !!p && p.length >= 8
        const validateEmailMock = require('./validation/validateEmail')

        const appFast = createApp(validateUsernameMock, validatePasswordMock, validateEmailMock)

        const response = await request(appFast).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.userId).toBeUndefined()
        expect(validateEmailMock).toHaveBeenCalled()
    })

    test('missing password returns 400 and no userId', async () => {
        const validateUsernameMock = (u) => !!u && u.length >= 6
        const validatePasswordMock = jest.fn().mockReturnValue(false)
        const validateEmailMock = require('./validation/validateEmail')

        const appFast = createApp(validateUsernameMock, validatePasswordMock, validateEmailMock)

        const response = await request(appFast).post('/users').send({
            username: 'Username',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body.userId).toBeUndefined()
    })

})