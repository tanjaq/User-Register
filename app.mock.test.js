const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

// Mokeeri validateEmail
jest.mock('./validation/validateEmail', () => {
    return jest.fn((email) => {
        if (!email || typeof email !== 'string') return false;
        const re = /^[^\s@]+@([^\s@]+\.)+(com|org|edu|net|io)$/i;
        return re.test(email);
    })
})

const validateEmail = require('./validation/validateEmail')
const app = createApp(validateUsername, validatePassword, validateEmail)

const startTime = Date.now();
let server;

beforeAll((done) => {
    server = app.listen(3002, done);
});

afterAll((done) => {
    server.close(done);
    const endTime = Date.now();
    console.log('\n=================================');
    console.log('📊 ÜLESANNE 2 - MOKEERITUD TESTIDE TULEMUSED');
    console.log('=================================');
    console.log(`⏱️  Testide kogu jooksuaeg: ${endTime - startTime} ms`);
    console.log('=================================\n');
});

// IDENTSED TESTID nagu app.test.js
describe('Kasutaja registreerimissüsteemi MOKEERITUD API testid', () => {
    
    describe('Kasutajanime valideerimine', () => {
        
        test('✅ Kehtiv kasutajanimi - ainult tähed', async () => {
            const response = await request(app).post('/users').send({
                username: 'JohnDoe',
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('✅ Kehtiv kasutajanimi - tähed ja numbrid', async () => {
            const response = await request(app).post('/users').send({
                username: 'John123',
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('✅ Kehtiv kasutajanimi - tähed, numbrid ja punktid', async () => {
            const response = await request(app).post('/users').send({
                username: 'john.doe.123',
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('❌ Liiga lühike kasutajanimi', async () => {
            const response = await request(app).post('/users').send({
                username: 'abc',
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Puuduv kasutajanimi', async () => {
            const response = await request(app).post('/users').send({
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(400)
        })
    })

    describe('Parooli valideerimine', () => {
        
        test('✅ Kehtiv parool', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('❌ Liiga lühike parool', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'Pass123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Parool ilma suure täheta', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'weakpass123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Puuduv parool', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(400)
        })
    })

    describe('Emaili valideerimine (mokeeritud)', () => {
        
        test('✅ Kehtiv email', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('❌ Vigane email - puudub @', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'userexample.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Vigane email - kehtetu domeen', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@example.invalid'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Puuduv email', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123'
            })
            expect(response.statusCode).toBe(400)
        })
    })

    describe('Kompleksstsenaariumid', () => {
        
        test('✅ Kõik väljad korrektsed', async () => {
            const response = await request(app).post('/users').send({
                username: 'perfect.user',
                password: 'PerfectPass123',
                email: 'perfect@example.com'
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.userId).toBe('1')
        })

        test('❌ Tühi päring', async () => {
            const response = await request(app).post('/users').send({})
            expect(response.statusCode).toBe(400)
        })
    })
})