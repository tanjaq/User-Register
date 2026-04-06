const request = require('supertest')
const createApp = require('./app')
const {
    validateUsername,
    validatePassword,
    validateEmail
} = require('./validators')

// 🔥 artificial delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const testRunStart = Date.now()

afterAll(() => {
    const durationMs = Date.now() - testRunStart
    console.log(`Regular test run time: ${durationMs}ms`)
})

const validPayload = {
    username: 'User.name1',
    password: 'Password123',
    email: 'student@example.com'
}

describe('POST /users validation flow (REAL)', () => {

    test('returns 200 with user details when validators approve', async () => {
        await delay(2000) // 🔥 makes this test slow

        const app = createApp(
            validateUsername,
            validatePassword,
            validateEmail
        )

        const response = await request(app).post('/users').send(validPayload)

        expect(response.status).toBe(200)
        expect(response.body).toEqual({
            userId: '1',
            message: 'Valid User'
        })
    })

    test('returns 400 when username validation fails', async () => {
        await delay(2000)

        const app = createApp(
            () => false,
            validatePassword,
            validateEmail
        )

        const response = await request(app).post('/users').send(validPayload)

        expect(response.status).toBe(400)
    })

    test('returns 400 when password validation fails', async () => {
        await delay(2000)

        const app = createApp(
            validateUsername,
            () => false,
            validateEmail
        )

        const response = await request(app).post('/users').send(validPayload)

        expect(response.status).toBe(400)
    })

    test('returns 400 when email validation fails', async () => {
        await delay(2000)

        const app = createApp(
            validateUsername,
            validatePassword,
            () => false
        )

        const response = await request(app).post('/users').send(validPayload)

        expect(response.status).toBe(400)
    })
})