# Integration testing - user registration system
The task is to add tests to registration functionality.

## How to get the project

To solve the task, proceed as follows:
1. Fork this repository on to your account
2. Clone the forked repo to your computer using `git clone URL`
3. Run `npm install` to instal all needed packages
4. To run the project call `node server.js` to start the app
5. Application will be available at http://localhost:3000/
6. Write tests to finish server testing
7. Confirm all changes with test run: `npx jest --coverage` or `npx jest`
8. Commit your changes and make a pull request for the original repo on GitHub
   - Add coverage information
   - Add test run time information

Jest documentation:
- https://jestjs.io/docs/expect
- https://jestjs.io/docs/mock-function-api


## Business requirements

**Username**

- Username can be 6-30 characters long.
- Username can only contain letters, numbers, and periods. 

**Password**

- Password has to be at least 8 characters long.
- Password should contain at least one lowercase and one uppercase letter.
- Password should contain at least one number. 
- Password should not contain any special characters.

**Email**

- Email must be a valid email address format.
- Email must contain an @ symbol followed by a domain name.
- Email must have a valid domain extension (e.g., .com, .edu, .org)

## Ülesanne 1: API testid
* Tutvu olemasoleva koodiga
* Lisa vajalikud testid `app.test.js` faili
* Käivita: `npm test`
   * Lisa coverage info
   * Lisa testide jooksuaja info

## Ülesanne 2: Mocked API testid
* Mocki emaili validatsioon kasutades `jest.mock()`
* Kirjuta samad testid `app.mock.test.js` faili
   * Testid peaksid olema identsed Ülesandega 1
* Käivita: `npm test -- app.mock.test.js`
   * Lisa coverage info
   * Lisa testide jooksuaja info
   * Võrdle jooksumisaega (Ülesanne 1 vs Ülesanne 2)

## Test Results

### Ülesanne 1: API testid (`app.test.js`)

- Test Suites: `1 passed, 1 total`
- Tests: `6 passed, 6 total`
- Coverage (All files): `100% statements`, `100% branches`, `100% functions`, `100% lines`
- Runtime: approximately `12s+`

Note: `validateEmail` has an intentional ~2 second busy wait per request, so integration tests without mocking are significantly slower.

### Ülesanne 2: Mocked API testid (`app.mock.test.js`)

- Test Suites: `1 passed, 1 total`
- Tests: `6 passed, 6 total`
- Coverage (All files): `100% statements`, `100% branches`, `100% functions`, `100% lines`
- Runtime: `1.704s`

### Runtime Comparison

- Non-mocked API tests are much slower because real email validation blocks ~2 seconds on every request.
- Mocked API tests remove that delay and run about `6x` faster in this project setup.