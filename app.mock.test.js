jest.mock('./validation/validateEmail', () => jest.fn());

const createApp = require('./app');
const request = require('supertest');
const validateUsername = require('./validation/validateUsername');
const validatePassword = require('./validation/validatePassword');
const validateEmail = require('./validation/validateEmail');

const app = createApp(validateUsername, validatePassword, validateEmail);

beforeEach(() => {
    validateEmail.mockReturnValue(true);
});

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(200);
    });

    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body.userId).toBeDefined();
    });

    test('returns correct userId value', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body.userId).toBe('1');
    });

    test('returns correct message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body.message).toBe('Valid User');
    });

    test('returns JSON content type', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.headers['content-type']).toMatch(/json/);
    });

    test('accepts username with minimum length', async () => {
        const response = await request(app).post('/users').send({
            username: 'User12',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(200);
    });

    test('accepts username with maximum length', async () => {
        const response = await request(app).post('/users').send({
            username: 'A'.repeat(30),
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(200);
    });

    test('accepts username with periods', async () => {
        const response = await request(app).post('/users').send({
            username: 'john.doe123',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(200);
    });

    test('accepts password with minimum length', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Passw0rd',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(200);
    });
});

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        validateEmail.mockReturnValueOnce(false);

        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        });
        expect(response.statusCode).toBe(400);
    });

    test('returns error message', async () => {
        validateEmail.mockReturnValueOnce(false);

        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('does not return userId', async () => {
        validateEmail.mockReturnValueOnce(false);

        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        });
        expect(response.body.userId).toBeUndefined();
    });

    test('fails when username is too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'usr',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when username has invalid characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'invalid_user!',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password is too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Pass1',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password has no uppercase letters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password has no lowercase letters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'PASSWORD123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password has no number', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password contains special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123!',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when email format is invalid', async () => {
        validateEmail.mockReturnValueOnce(false);

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'invalid-email'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when email is missing', async () => {
        validateEmail.mockReturnValueOnce(false);

        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when username is missing', async () => {
        const response = await request(app).post('/users').send({
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });

    test('fails when password contains underscore', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password_123',
            email: 'student@example.com'
        });
        expect(response.statusCode).toBe(400);
    });
});