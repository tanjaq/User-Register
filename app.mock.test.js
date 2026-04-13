const createApp = require('./app')
const request = require('supertest')

// 1. Tell Jest to replace these modules with mock functions
jest.mock('./validation/validateUsername')
jest.mock('./validation/validatePassword')
jest.mock('./validation/validateEmail')

// 2. Import the mocked versions
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

describe('Mocked Business requirements - Success', () => {
    test('should return 200 when all validations pass', async () => {
        // Force every mock to say "Yes, this is valid"
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Valid User',
            userId: expect.any(String)
        });
    })
})

describe('Business requirements - Username', () => {

    test('Username: should fail if shorter than 6 characters', async () => {
        validateUsername.mockReturnValue(false);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: '12345',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
        expect(response.body.userId).toBeUndefined();
    })

    test('Username: should fail if longer than 30 characters', async () => {
        validateUsername.mockReturnValue(false);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'a'.repeat(31), // Generates a 31-char string
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Username: should fail if forbidden characters (@) are used', async () => {
        validateUsername.mockReturnValue(false);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc@123',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Username: should fail if left empty', async () => {
        validateUsername.mockReturnValue(false);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Username: should pass if it contains letters, numbers, and periods', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            message: 'Valid User',
            userId: expect.any(String) // We expect a string like "1"
        });
    })
})

describe('Business requirements - Password', () => {

    test('Password: should fail if shorter than 8 characters', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Pass123', // 7 chars
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
        expect(response.body.userId).toBeUndefined();
    })

    test('Password: should fail if no lowercase letter is used', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'PASSWORD123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Password: should fail if no uppercase letter is used', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'password123',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Password: should fail if left empty', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: '',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Password: should fail if no number is used', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        validateEmail.mockReturnValue(true);
        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'testPassword',
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Password: should fail if it contains special characters', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(false);
        validateEmail.mockReturnValue(true);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password@123', // contains '@'
            email: 'student@example.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })
})

describe('Business requirements - Email', () => {
    test('Email: should fail if @ symbol is missing', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(false);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password123',
            email: 'studentexample.com'
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
        expect(response.body.userId).toBeUndefined();
    })

    test('Email: should fail if domain name is missing', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(false);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password123',
            email: 'student@' // Missing domain
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Email: should fail if domain extension is missing', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(false);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password123',
            email: 'student@example' // Missing .com, .org, etc.
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })

    test('Email: should fail if left empty', async () => {
        validateUsername.mockReturnValue(true);
        validatePassword.mockReturnValue(true);
        validateEmail.mockReturnValue(false);

        const response = await request(app).post('/users').send({
            username: 'abc.123',
            password: 'Password123',
            email: ''
        })

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual({ error: 'Invalid User' });
    })
})