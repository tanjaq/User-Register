const createApp = require('./app')
const request = require('supertest')
const validateUsername = require('./validation/validateUsername')
const validatePassword = require('./validation/validatePassword')

const app = createApp(validateUsername, validatePassword)

describe('General request tests', ()=>{
    test('request method shoul be a POST', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.req.method).toBe('POST');
    })
    test('request should have a right entered values', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'User',
            password: 'badpass'
        })
        expect(response.request._data.username).toBe('User')
        expect(response.request._data.password).toBe('badpass')  
    })
    test('request should be application/json type', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.type).toBe('application/json')
    })
    test('no username and no password given', async ()=>{
        const response = await request(app).post('/users').send({
            username: '',
            password: ''
        })
        expect(response.statusCode).toBe(400)
    })
})

describe('given correct username and password', () => {
    test('return status 200', async () => {
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.statusCode).toBe(200)
    })
    test('result have userId', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.body.userId).toBeDefined()
    })
    test('result have positive message', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'Username',
            password: 'Password123'
        })
        expect(response.body.message).toBe("Valid User");
    })
})

describe('given incorrect username or Password', ()=>{
    test('return status 400', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'User',
            password: 'badpass'
        })
        expect(response.statusCode).toBe(400);
    })
    test('return an error in body', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'User',
            password: 'badpass'
        })
        expect(response.body.error).toBe("Invalid User");
    })
    test('result should not have userId', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'User',
            password: 'badpass'
        })
        expect(response.body.userId).not.toBeDefined()
    })
    test('no username was given', async ()=>{
        const response = await request(app).post('/users').send({
            username: '',
            password: 'badpass'
        })
        expect(response.statusCode).toBe(400);
    })
    test('only username is correct', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'AgoodUsername',
            password: 'badpass'
        })
        expect(response.statusCode).toBe(400);
    })
    test('only password is correct', async ()=>{
        const response = await request(app).post('/users').send({
            username: 'User',
            password: 'AgoodPassword123'
        })
        expect(response.statusCode).toBe(400);
    })

})