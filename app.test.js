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

    test('return status 200 on email with subdomain', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@mail.example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('return correct content type', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.headers["content-type"]).toMatch('application/json');
    })

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(response.body.userId).toBeDefined();
    })

    test('returns success message', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(res.body.message).toBe('Valid User')
    })
})

describe('given incorrect or missing username and password', () => {
    test('returns 400 for short username', async () => {
        const res = await request(app).post('/users').send({
            username: 'user',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid char username', async () => {
        const res = await request(app).post('/users').send({
            username: 'xXx_U$3RN4M3!',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid length username', async () => {
        const res = await request(app).post('/users').send({
            username: 'ILoveStressTestingInputfieldsForFun',
            password: 'Password123',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid length password', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'P4rool',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for missing number in password', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for special char in password', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'Passw0rd!',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid UPPERCASE only password', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'PASSWORD123',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid lowercase only password', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid email', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'wrongmail'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid with no extension email', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns 400 for invalid with invalid extension email', async () => {
        const res = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.d'
        })
        expect(res.statusCode).toBe(400)
    })

    test('returns error message', async () => {
        const res = await request(app).post('/users').send({
            username: 'bad',
            password: '123',
            email: 'x'
        })
        expect(res.body.error).toBe('Invalid User')
    })

    test('does not return userId', async () => {
        const res = await request(app).post('/users').send({
            username: 'bad',
            password: '123',
            email: 'x'
        })
        expect(res.body.userId).toBeUndefined()
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