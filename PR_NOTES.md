# Pull request notes

## What changed

- Completed `app.test.js` with a reusable API test suite.
- Completed `app.mock.test.js` with the same test cases and `jest.mock()` for `validateEmail`.
- Added a small guard in `app.js` so omitted `username`, `password`, or `email` return `400 Invalid User` instead of crashing validation.

## Test cases covered

- Valid registration returns `200` with JSON and the expected success body.
- Invalid username:
  - shorter than 6 characters
  - unauthorized characters
- Invalid password:
  - shorter than 8 characters
  - missing uppercase letters
  - contains special characters
- Invalid email:
  - missing `@`
  - missing valid domain extension
- Missing fields:
  - username
  - password
  - email

## Commands to run locally

```bash
npm install
npm test
npm test -- app.mock.test.js
```

Include the resulting Jest coverage table and the `Time:` line from both runs in the PR description.
