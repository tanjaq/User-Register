const createApp = require('../app')
const request = require('supertest')
const validateUsername = require('../validation/validateUsername')
const validatePassword = require('../validation/validatePassword')

const app = createApp(validateUsername, validatePassword)

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(200)
    });

    // test response message
    test('returns response message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.body.message).toBe("Valid User");
    });

    // test response user id value
    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.body.userId).toBeDefined();
    });

});

describe('given incorrect or missing username and password', () => {
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        })
        expect(response.statusCode).toBe(400)
    });

    // test that response have error message
    test('return an error', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: ''
        })
        expect(response.body.error).toBe("Invalid User");
        ;
    });

    // test that response does NOT have userId
    test('response does not have userId', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: ''
        })
        expect(response.body.userId).toBeUndefined();
    });

    // test incorrect username or password according to requirements
    test('Incorect Username', async () => {
        const response = await request(app).post('/users').send({
            username: 'User',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(400);
        ;
    });

    test('Incorect Password', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Pass1'
        })
        expect(response.statusCode).toBe(400);
        ;
    });

    // test missing username or password
    test('Username is missing', async () => {
        const response = await request(app).post('/users').send({
            username: '',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(400);
        ;
    })

    test('Password is missing', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: ''
        })
        expect(response.statusCode).toBe(400);
        ;
    })

});