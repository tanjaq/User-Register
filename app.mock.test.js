
const createApp = require('./app');
const request = require('supertest');

jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        return email === 'student@example.com';
    });
});

const validateUsername = require('./validation/validateUsername');
const validatePassword = require('./validation/validatePassword');
const validateEmail = require('./validation/validateEmail');

const app = createApp(validateUsername, validatePassword, validateEmail);

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

    test('response content type should be JSON', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.headers['content-type']).toMatch(/json/);
    });

    test('response message should be Valid User', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body).toEqual({ userId: "1", message: "Valid User" });
    });

    test('user id value should be valid', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body.userId).toBe("1");
    });
});

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        });
        expect(response.statusCode).toBe(400);
    });

    test('response message should be Invalid User', async () => {
        const response = await request(app).post('/users').send({
            username: 'er',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body).toEqual({ error: "Invalid User" });
    });

    test('response should not have userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'er',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(response.body.userId).toBeUndefined();
    });

    test('username too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'abc',
            password: 'Password1',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('username with invalid characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'Invalid@Name',
            password: 'Password1',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('password too short', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: 'Pass1',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('password missing uppercase', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: 'password1',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('password missing lowercase', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: 'PASSWORD1',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('password contains special characters', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: 'Password1!',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('email missing @', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: 'Password1',
            email: 'studentexample.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('email invalid domain', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: 'Password1',
            email: 'student@example'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('password missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'ValidUsername',
            password: '',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });

    test('username missing', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password1',
            email: 'student@example.com'
        });
        expect(response.body.error).toBe('Invalid User');
    });
});