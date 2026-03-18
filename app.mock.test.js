jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        if (!email || typeof email !== 'string') return false
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i
        return re.test(email)
    })
})

const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

const validUser = {
    username: 'ValidUser',
    password: 'Password123',
    email: 'student@example.com'
}

const postUser = (user) => request(app).post('/users').send(user)

describe('given correct username, password, and email', () => {
    test('return status 200', async () => {
        const response = await postUser(validUser)
        expect(response.statusCode).toBe(200)
    })

    test('returns userId and message', async () => {
        const response = await postUser(validUser)
        expect(response.body).toEqual({
            userId: '1',
            message: 'Valid User'
        })
    })
})

describe('given incorrect or missing username, password, or email', () => {
    test('return status 400 for short username', async () => {
        const response = await postUser({
            ...validUser,
            username: 'user'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for username with special characters', async () => {
        const response = await postUser({
            ...validUser,
            username: 'user$name'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for short password', async () => {
        const response = await postUser({
            ...validUser,
            password: 'Pass1'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for password without uppercase', async () => {
        const response = await postUser({
            ...validUser,
            password: 'password123'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for password without number', async () => {
        const response = await postUser({
            ...validUser,
            password: 'Password'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for password with special characters', async () => {
        const response = await postUser({
            ...validUser,
            password: 'Password123!'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for invalid email format', async () => {
        const response = await postUser({
            ...validUser,
            email: 'studentexample.com'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for email without extension', async () => {
        const response = await postUser({
            ...validUser,
            email: 'student@example'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for missing username', async () => {
        const response = await postUser({
            password: validUser.password,
            email: validUser.email
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for missing password', async () => {
        const response = await postUser({
            username: validUser.username,
            email: validUser.email
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })

    test('return status 400 for missing email', async () => {
        const response = await postUser({
            username: validUser.username,
            password: validUser.password
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
        expect(response.body.userId).toBeUndefined()
    })
})