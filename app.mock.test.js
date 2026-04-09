const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

//Mock validateEmail to isolate tests
jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        //Simulate real world simulation
        if (!email || typeof email !== 'string') return false;
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;
        return re.test(email);
    })
})

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
        expect(response.body.userId).toBeDefined()
    })

    test('response content type is JSON', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers['content-type']).toMatch(/json/)
    })

    test('returns correct message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.message).toBe('Valid User')
    })

    test('userId is "1"', async () => {
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
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('returns error message', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.error).toBe('Invalid User')
    })

    test('does not return userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })
        expect(response.body.userId).toBeUndefined()
    })

    test('missing username returns 400', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('missing password returns 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: '',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('missing email returns 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: ''
        })
        expect(response.statusCode).toBe(400)
    })
})