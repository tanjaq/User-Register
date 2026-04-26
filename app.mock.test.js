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

const validPayload = {
    username: 'User.Name99',
    password: 'Password123',
    email: 'student@example.com'
}

describe('POST /users', () => {
    test('returns success response for valid user', async () => {
        const response = await request(app).post('/users').send(validPayload)

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({ userId: '1', message: 'Valid User' })
    })

    test('returns status 400 when username is shorter than 6 characters', async () => {
        const response = await request(app).post('/users').send({
            ...validPayload,
            username: 'user1'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ error: 'Invalid User' })
    })

    test('returns status 400 when username contains disallowed characters', async () => {
        const response = await request(app).post('/users').send({
            ...validPayload,
            username: 'User_name'
        })

        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when password does not meet complexity rules', async () => {
        const response = await request(app).post('/users').send({
            ...validPayload,
            password: 'password'
        })

        expect(response.statusCode).toBe(400)
    })

    test('returns status 400 when email has no at-symbol', async () => {
        const response = await request(app).post('/users').send({
            ...validPayload,
            email: 'student.example.com'
        })

        expect(response.statusCode).toBe(400)
    })

    test('returns only error payload for invalid user', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        })

        expect(response.statusCode).toBe(400)
        expect(response.body).toEqual({ error: 'Invalid User' })
        expect(response.body.userId).toBeUndefined()
    })
})