const createApp = require('./app');
const request = require('supertest');

const mockedValidatePassword = jest.fn(password => password.length >= 8);
const mockedValidateUsername = jest.fn(username => username.length <= 30 && username.length >= 6);

const app = createApp(mockedValidateUsername, mockedValidatePassword);

describe('correct username and password', () => {
    // Проверка, что при правильных данных возвращается статус 200
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        });
        expect(response.statusCode).toBe(200);
    });

    // Проверка наличия поля userId в ответе
    test('returns userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        });
        expect(response.body.userId).toBeDefined();
    });

    // Проверка наличия поля message в ответе
    test('returns message', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        });
        expect(response.body.message).toBeDefined();
    });

    // Проверка, что в ответе присутствует JSON
    test('response content type', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        });
        expect(response.headers['content-type']).toMatch(/json/);
    });


    // Проверка, что метод запроса - POST
    test('request type is POST', async () => {
        const response = await request(app)
            .post('/users')
            .send({
                username: 'Username',
                password: 'Password123'
            });
        expect(response.req.method).toBe('POST');
    });

        // Проверка userId 
        test('response does NOT have userId', async () => {
            const response = await request(app).post('/users').send({
                username: 'Username',
                password: 'Password123'
            });
            expect(response.body.message).toBe("Valid User");
        });
});


describe('incorrect or missing username or/and password', () => {
    // Проверка, что при неправильных данных возвращается статус 400
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        });
        expect(response.statusCode).toBe(400);
    });

    // Проверка на возвращение ошибки
    test('error message', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'Password123'
        });
        expect(response.body.error).toBeDefined();
    });
    
    // Проверка отсутствия userId в ответе
    test('response does NOT have userId', async () => {
        const response = await request(app).post('/users').send({
            username: 'user',
            password: 'password'
        });
        expect(response.body.userId).toBeUndefined();
    });

    // Проверка, что при отсутствии пароля возвращается статус 400
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: ' '
        });
        expect(response.statusCode).toBe(400);
    });

    // Проверка отсутствия userId бещ пароля в ответе
        test('response does NOT have userId', async () => {
            const response = await request(app).post('/users').send({
                username: 'Username',
                password: ' '
            });
            expect(response.body.error).toBe("Invalid User");
        });

        

    // Проверка, что при отсутствии имени пользователя возвращается статус 400
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: ' ',
            password: 'Password123'
        });
        expect(response.statusCode).toBe(400);
    });

    // Проверка, что при отсутствии имени пользователя и пароля возвращается статус 400
    test('return status 400', async () => {
        const response = await request(app).post('/users').send({
            username: ' ',
            password: ' '
        });
        expect(response.statusCode).toBe(400);
    });

});
