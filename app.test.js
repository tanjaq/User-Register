const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('POST /users - Valid User Registration', () => {
    test('should return status 200 with valid credentials', async () => {
        const startTime = Date.now()
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Password123',
            email: 'user@example.com'
        })
        const endTime = Date.now()
        console.log(`✓ Valid user registration: ${endTime - startTime}ms`)
        expect(response.statusCode).toBe(200)
    })

    test('should return userId in response', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUser',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.body.userId).toBeDefined()
        expect(response.body.userId).toBe('1')
    })

    test('should return success message', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUser',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.body.message).toBe('Valid User')
    })

    test('should return JSON content type', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUser',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.type).toBe('application/json')
    })

    test('should accept username with numbers and dots', async () => {
        const response = await request(app).post('/users').send({
            username: 'user.name123',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(200)
    })
})

describe('POST /users - Invalid Username', () => {
    test('should return 400 for username too short (< 6 chars)', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for username too long (> 30 chars)', async () => {
        const longUsername = 'a'.repeat(31)
        const response = await request(app).post('/users').send({
            username: longUsername,
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for username with special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'user@name',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for missing username', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should not return userId for invalid username', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.body.userId).toBeUndefined()
    })

    test('should return error message for invalid username', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.body.error).toBe('Invalid User')
    })
})

describe('POST /users - Invalid Password', () => {
    test('should return 400 for password too short (< 8 chars)', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Pass123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for password without uppercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for password without lowercase letter', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'PASSWORD123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for password without number', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'PasswordAbc',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for password with special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Password@123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for missing password', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: '',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 when only password is invalid among all fields', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'invalidpwd',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
    })
})

describe('POST /users - Invalid Email', () => {
    test('should return 400 for invalid email format', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Password123',
            email: 'not-an-email'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for email without @', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Password123',
            email: 'userexample.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for email without domain extension', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Password123',
            email: 'user@example'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return 400 for missing email', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Password123',
            email: ''
        })
        expect(response.statusCode).toBe(400)
    })

    test('should accept valid email formats', async () => {
        const validEmails = [
            'user@example.com',
            'test.user@example.co.uk',
            'user123@test-domain.org'
        ]
        
        for (const email of validEmails) {
            const response = await request(app).post('/users').send({
                username: 'validUser',
                password: 'Password123',
                email: email
            })
            expect(response.statusCode).toBe(200)
        }
    })
})

describe('POST /users - Multiple Invalid Fields', () => {
    test('should return 400 when all fields are invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'weak',
            email: 'invalid-email'
        })
        expect(response.statusCode).toBe(400)
        expect(response.body.error).toBe('Invalid User')
    })

    test('should return 400 when username and password are invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'abc',
            password: 'weak123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(400)
    })

    test('should return error not userId when multiple fields invalid', async () => {
        const response = await request(app).post('/users').send({
            username: 'abc',
            password: 'weak',
            email: 'invalid'
        })
        expect(response.body.userId).toBeUndefined()
        expect(response.body.error).toBeDefined()
    })
})

describe('POST /users - Edge Cases', () => {
    test('should accept exactly 6 character username', async () => {
        const response = await request(app).post('/users').send({
            username: 'abcdef',
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('should accept exactly 30 character username', async () => {
        const response = await request(app).post('/users').send({
            username: 'a'.repeat(30),
            password: 'Password123',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(200)
    })

    test('should accept exactly 8 character password', async () => {
        const response = await request(app).post('/users').send({
            username: 'validUser',
            password: 'Passw0rd',
            email: 'user@example.com'
        })
        expect(response.statusCode).toBe(200)
    })
})