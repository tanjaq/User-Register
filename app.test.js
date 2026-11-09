const createApp = require('./app');
const request = require('supertest');
const validateUsername = require('./validation/validateUsername');
const validatePassword = require('./validation/validatePassword');
const validateEmail = require('./validation/validateEmail');
const app = createApp(validateUsername, validatePassword, validateEmail);
const validUser = { username: 'Username', password: 'Password123', email: 'student@example.com' };
const cases = [
  [
    "valid user",
    {},
    true
  ],
  [
    "username six characters",
    {
      "username": "User12"
    },
    true
  ],
  [
    "username thirty characters",
    {
      "username": "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
    },
    true
  ],
  [
    "username allows periods",
    {
      "username": "User.123"
    },
    true
  ],
  [
    "username five characters",
    {
      "username": "User1"
    },
    false
  ],
  [
    "username thirty one characters",
    {
      "username": "UUUUUUUUUUUUUUUUUUUUUUUUUUUUUUU"
    },
    false
  ],
  [
    "username spaces",
    {
      "username": "User name"
    },
    false
  ],
  [
    "username underscore",
    {
      "username": "User_name"
    },
    false
  ],
  [
    "username hyphen",
    {
      "username": "User-name"
    },
    false
  ],
  [
    "username missing",
    {
      "username": null
    },
    false
  ],
  [
    "username numeric",
    {
      "username": 123456
    },
    false
  ],
  [
    "password eight characters",
    {
      "password": "Pass1234"
    },
    true
  ],
  [
    "password seven characters",
    {
      "password": "Pass123"
    },
    false
  ],
  [
    "password no uppercase",
    {
      "password": "password123"
    },
    false
  ],
  [
    "password no lowercase",
    {
      "password": "PASSWORD123"
    },
    false
  ],
  [
    "password no number",
    {
      "password": "Password"
    },
    false
  ],
  [
    "password punctuation",
    {
      "password": "Password123!"
    },
    false
  ],
  [
    "password underscore",
    {
      "password": "Password123_"
    },
    false
  ],
  [
    "password spaces",
    {
      "password": "Password 123"
    },
    false
  ],
  [
    "password missing",
    {
      "password": null
    },
    false
  ],
  [
    "password numeric",
    {
      "password": 12345678
    },
    false
  ],
  [
    "valid org email",
    {
      "email": "student@example.org"
    },
    true
  ],
  [
    "invalid email no at",
    {
      "email": "student.example.com"
    },
    false
  ],
  [
    "invalid email no extension",
    {
      "email": "student@example"
    },
    false
  ],
  [
    "invalid email whitespace",
    {
      "email": "student @example.com"
    },
    false
  ],
  [
    "missing email",
    {
      "email": null
    },
    false
  ],
  [
    "numeric email",
    {
      "email": 12345
    },
    false
  ]
];

describe('POST /users registration requirements', () => {
  test.each(cases)('%s', async (name, changes, accepted) => {
    const body = { ...validUser, ...changes };
    Object.keys(body).forEach((key) => { if (body[key] === null) delete body[key]; });
    const response = await request(app).post('/users').send(body);
    expect(response.status).toBe(accepted ? 200 : 400);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    if (accepted) {
      expect(response.body).toEqual({ userId: '1', message: 'Valid User' });
    } else {
      expect(response.body).toEqual({ error: 'Invalid User' });
      expect(response.body).not.toHaveProperty('userId');
    }
  });

  test('empty object is rejected', async () => {
    const response = await request(app).post('/users').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid User' });
  });
});
