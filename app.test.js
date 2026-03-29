const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')
const validateEmail = require('./validation/validateEmail')

const app = createApp(validateUsername, validatePassword, validateEmail)

// Testide jooksuaja mõõtmine
const startTime = Date.now();
let server;

beforeAll((done) => {
    server = app.listen(3001, done);
});

afterAll((done) => {
    server.close(done);
    const endTime = Date.now();
    console.log('\n=================================');
    console.log('📊 ÜLESANNE 1 - TESTIDE TULEMUSED');
    console.log('=================================');
    console.log(`⏱️  Testide kogu jooksuaeg: ${endTime - startTime} ms`);
    console.log('=================================\n');
});

describe('Kasutaja registreerimissüsteemi API testid', () => {
    
    // ============ KASUTAJANIME TESTID ============
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

        test('✅ Kehtiv kasutajanimi - miinimum pikkus (6)', async () => {
            const response = await request(app).post('/users').send({
                username: 'abcdef',
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('❌ Liiga lühike kasutajanimi (<6)', async () => {
            const response = await request(app).post('/users').send({
                username: 'abc',
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Liiga pikk kasutajanimi (>30)', async () => {
            const response = await request(app).post('/users').send({
                username: 'a'.repeat(31),
                password: 'TestPassword123',
                email: 'john@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Kasutajanimi erimärkidega', async () => {
            const response = await request(app).post('/users').send({
                username: 'john@doe',
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
            expect(response.body.error).toMatch(/missing/i)
        })
    })

    // ============ PAROOLI TESTID ============
    describe('Parooli valideerimine', () => {
        
        test('✅ Kehtiv parool', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('❌ Liiga lühike parool (<8)', async () => {
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

        test('❌ Parool ilma väikese täheta', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'WEAKPASS123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Parool ilma numbrita', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'WeakPassword',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Parool erimärkidega', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'WeakPass@123',
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
            expect(response.body.error).toMatch(/missing/i)
        })
    })

    // ============ EMAILI TESTID ============
    describe('Emaili valideerimine', () => {
        
        test('✅ Kehtiv email - .com', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@example.com'
            })
            expect(response.statusCode).toBe(200)
        })

        test('✅ Kehtiv email - .org', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@example.org'
            })
            expect(response.statusCode).toBe(200)
        })

        test('✅ Kehtiv email - .edu', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@university.edu'
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

        test('❌ Vigane email - puudub domeen', async () => {
            const response = await request(app).post('/users').send({
                username: 'validuser',
                password: 'StrongPass123',
                email: 'user@'
            })
            expect(response.statusCode).toBe(400)
        })

        test('❌ Vigane email - kehtetu domeenilaiend', async () => {
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

    // ============ KOMPLEKSTESTID ============
    describe('Kompleksstsenaariumid', () => {
        
        test('✅ Kõik väljad korrektsed', async () => {
            const response = await request(app).post('/users').send({
                username: 'perfect.user',
                password: 'PerfectPass123',
                email: 'perfect@example.com'
            })
            expect(response.statusCode).toBe(200)
            expect(response.body.userId).toBe('1')
            expect(response.body.message).toBe('Valid User')
        })

        test('❌ Tühi päring', async () => {
            const response = await request(app).post('/users').send({})
            expect(response.statusCode).toBe(400)
        })
    })
})