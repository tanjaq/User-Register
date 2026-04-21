const request = require('supertest');

const validPayload = {
  username: 'Username.1',
  password: 'Password123',
  email: 'student@example.com',
};

const invalidCases = [
  {
    name: 'username is shorter than 6 characters',
    payload: {...validPayload, username: 'user1'},
  },
  {
    name: 'username contains unauthorized characters',
    payload: {...validPayload, username: 'User!23'},
  },
  {
    name: 'password is shorter than 8 characters',
    payload: {...validPayload, password: 'Pass12'},
  },
  {
    name: 'password does not contain uppercase letters',
    payload: {...validPayload, password: 'password123'},
  },
  {
    name: 'password contains special characters',
    payload: {...validPayload, password: 'Password!123'},
  },
  {
    name: 'email is missing @',
    payload: {...validPayload, email: 'studentexample.com'},
  },
  {
    name: 'email is missing a valid domain extension',
    payload: {...validPayload, email: 'student@example'},
  },
  {
    name: 'username is missing',
    payload: {password: validPayload.password, email: validPayload.email},
  },
  {
    name: 'password is missing',
    payload: {username: validPayload.username, email: validPayload.email},
  },
  {
    name: 'email is missing',
    payload: {username: validPayload.username, password: validPayload.password},
  },
];

function runRegistrationApiTestSuite(app) {
  describe('POST /users', () => {
    test('returns 200, json and the expected body for a valid user', async () => {
      const response = await request(app).post('/users').send(validPayload);

      expect(response.statusCode).toBe(200);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({
        userId: '1',
        message: 'Valid User',
      });
    });

    test.each(invalidCases)('returns 400 and error payload when $name', async ({payload}) => {
      const response = await request(app).post('/users').send(payload);

      expect(response.statusCode).toBe(400);
      expect(response.headers['content-type']).toMatch(/json/);
      expect(response.body).toEqual({error: 'Invalid User'});
      expect(response.body.userId).toBeUndefined();
    });
  });
}

module.exports = runRegistrationApiTestSuite;
