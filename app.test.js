const request = require('supertest');
const initApp = require('./app');
const checkUser = require('./validation/validateUsername');
const checkPass = require('./validation/validatePassword');
const checkMail = require('./validation/validateEmail');

const server = initApp(checkUser, checkPass, checkMail);

describe('Negatiivsed testid: vigased või puudulikud andmed', () => {
    
    test('kasutajanimi puudub', async () => {
        const res = await request(server).post('/users').send({
            username: '',
            password: 'Password1',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('parool puudub', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: '',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('valesti vormistatud e-mail (domeen puudu)', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: 'Password1',
            email: 'student@example'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('e-mail ilma @ märgita', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: 'Password1',
            email: 'studentexample.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('parool sisaldab keelatud erimärke', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: 'Password1!',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('paroolis puuduvad väikesed tähed', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: 'PASSWORD1',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('paroolis puuduvad suured tähed', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: 'password1',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('liiga lühike parool', async () => {
        const res = await request(server).post('/users').send({
            username: 'ValidUsername',
            password: 'Pass1',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('kasutajanimes on keelatud sümbolid', async () => {
        const res = await request(server).post('/users').send({
            username: 'Invalid@Name',
            password: 'Password1',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('liiga lühike kasutajanimi', async () => {
        const res = await request(server).post('/users').send({
            username: 'abc',
            password: 'Password1',
            email: 'student@example.com'
        });
        expect(res.body.error).toBe('Invalid User');
    });

    test('vastus ei tohi sisaldada userId-d vea korral', async () => {
        const res = await request(server).post('/users').send({
            username: 'er',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.body.userId).toBeUndefined();
    });

    test('veateade peab olema "Invalid User"', async () => {
        const res = await request(server).post('/users').send({
            username: 'er',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.body).toEqual({ error: "Invalid User" });
    });

    test('peaks tagastama staatusekoodi 400', async () => {
        const res = await request(server).post('/users').send({
            username: 'user',
            password: 'password',
            email: 'not-an-email'
        });
        expect(res.statusCode).toBe(400);
    });
});

describe('Positiivsed testid: korrektsed andmed', () => {

    test('vastuse body peab sisaldama korrektset userId-d ja sõnumit', async () => {
        const res = await request(server).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.body.userId).toBe("1");
    });

    test('eduka päringu vastus peab olema JSON vormingus', async () => {
        const res = await request(server).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.headers['content-type']).toMatch(/json/);
    });

    test('kasutaja ID peab olema defineeritud', async () => {
        const res = await request(server).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.body.userId).toBeDefined();
    });

    test('objekt peab vastama oodatud kujule', async () => {
        const res = await request(server).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.body).toEqual({ userId: "1", message: "Valid User" });
    });

    test('tagastab staatuse 200', async () => {
        const res = await request(server).post('/users').send({
            username: 'Username',
            password: 'Password123',
            email: 'student@example.com'
        });
        expect(res.statusCode).toBe(200);
    });
});