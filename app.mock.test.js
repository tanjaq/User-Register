const createApp = require('./app')
const request = require('supertest')

// Mock all validators for "valid inputs"
const mockValidateUsername = jest.fn(() => true)
const mockValidatePassword = jest.fn(() => true)
const mockValidateEmail = jest.fn(() => true)

const validApp = createApp(mockValidateUsername, mockValidatePassword, mockValidateEmail)

describe('POST /users - valid inputs', () => {
    test('returns 200, userId, and message', async () => {
        const response = await request(validApp).post('/users').send({
            username: 'ValidUser',
            password: 'StrongPass123!',
            email: 'student@example.com'
        })
        expect(response.statusCode).toBe(200)
        expect(response.body.userId).toBeDefined()
        expect(response.body.message).toBe('Valid User')
    })
})