const request = require('supertest')
const createApp = require('./app')

jest.mock('./validation/validateEmail', () => jest.fn())
const validateEmail = require('./validation/validateEmail')

const testRunStart = Date.now()

afterAll(() => {
  const durationMs = Date.now() - testRunStart
  console.log(`Mocked test run time: ${durationMs}ms`)
})

const validPayload = {
  username: 'User.name1',
  password: 'Password123',
  email: 'student@example.com'
}

beforeEach(() => {
  jest.clearAllMocks()
})

describe('POST /users validation flow with mocked email validator', () => {

  test('returns 200 with user details when validators approve', async () => {
    const mockValidateUsername = jest.fn().mockReturnValue(true)
    const mockValidatePassword = jest.fn().mockReturnValue(true)
    validateEmail.mockReturnValue(true)

    const app = createApp(
      mockValidateUsername,
      mockValidatePassword,
      validateEmail
    )

    const response = await request(app).post('/users').send(validPayload)

    expect(response.status).toBe(200)
    expect(response.body).toEqual({ userId: '1', message: 'Valid User' })
  })

  test('returns 400 when username validation fails', async () => {
    const app = createApp(
      () => false,
      () => true,
      validateEmail
    )

    const response = await request(app).post('/users').send(validPayload)

    expect(response.status).toBe(400)
  })

  test('returns 400 when password validation fails', async () => {
    const app = createApp(
      () => true,
      () => false,
      validateEmail
    )

    const response = await request(app).post('/users').send(validPayload)

    expect(response.status).toBe(400)
  })

  test('returns 400 when email validation fails', async () => {
    validateEmail.mockReturnValue(false)

    const app = createApp(
      () => true,
      () => true,
      validateEmail
    )

    const response = await request(app).post('/users').send(validPayload)

    expect(response.status).toBe(400)
  })
})