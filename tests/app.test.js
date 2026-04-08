const request = require('supertest');
const app = require('../app');

describe('User API Tests', () => {
    const testUser = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123'
    };

    test('POST /register - peaks uue kasutaja registreerima', async () => {
        const res = await request(app)
            .post('/register')
            .send(testUser);
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('message', 'User registered successfully');
    });

    test('POST /register - ei tohi lubada duplikaat e-maili', async () => {
        await request(app).post('/register').send(testUser);
        const res = await request(app)
            .post('/register')
            .send(testUser);
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message', 'User already exists');
    });

    test('POST /login - peaks edukalt sisse logima', async () => {
        await request(app).post('/register').send(testUser);
        const res = await request(app)
            .post('/login')
            .send({
                email: testUser.email,
                password: testUser.password
            });
        
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('token');
    });

    test('GET /users - peaks tagastama kasutajate nimekirja', async () => {
        const res = await request(app).get('/users');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
});