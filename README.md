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

   $ npm test

> tests@1.0.0 test
> jest --coverage

 PASS  validation/validateUsername.test.js
 PASS  validation/validatePassword.test.js
 PASS  ./app.mock.test.js
 PASS  validation/validateEmail.test.js (11.057 s)
 PASS  ./app.test.js (27.558 s)
---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |
 User-Register |     100 |      100 |     100 |     100 |
  app.js       |     100 |      100 |     100 |     100 |
 ...validation |     100 |      100 |     100 |     100 |
  ...eEmail.js |     100 |      100 |     100 |     100 |
  ...ssword.js |     100 |      100 |     100 |     100 |
  ...ername.js |     100 |      100 |     100 |     100 |
---------------|---------|----------|---------|---------|-------------------

Test Suites: 5 passed, 5 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        27.944 s
Ran all test suites.

## Ülesanne 2: Mocked API testid
* Mocki emaili validatsioon kasutades `jest.mock()`
* Kirjuta samad testid `app.mock.test.js` faili
   * Testid peaksid olema identsed Ülesandega 1
* Käivita: `npm test -- app.mock.test.js`
   * Lisa coverage info
   * Lisa testide jooksuaja info
   * Võrdle jooksumisaega (Ülesanne 1 vs Ülesanne 2)

   $ npm test -- app.mock.test.js

> tests@1.0.0 test
> jest --coverage app.mock.test.js

 PASS  ./app.mock.test.js
  POST /users
    √ returns 200 and valid user payload for valid input (44 ms)
    √ returns 400 and error payload when username is shorter than 6 characters (6 ms)
    √ returns 400 and error payload when username contains special characters (5 ms)
    √ returns 400 and error payload when password is shorter than 8 characters (5 ms)
    √ returns 400 and error payload when password is missing an uppercase letter (4 ms)
    √ returns 400 and error payload when password is missing a lowercase letter (4 ms)
    √ returns 400 and error payload when password is missing a number (4 ms)
    √ returns 400 and error payload when password contains special characters (3 ms)
    √ returns 400 and error payload when email is missing @ (5 ms)
    √ returns 400 and error payload when email is missing a valid domain extension (5 ms)
    √ returns 400 and error payload when username is missing (3 ms)
    √ returns 400 and error payload when password is missing (3 ms)
    √ returns 400 and error payload when email is missing (3 ms)

---------------|---------|----------|---------|---------|-------------------
File           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
---------------|---------|----------|---------|---------|-------------------
All files      |     100 |      100 |     100 |     100 |
 User-Register |     100 |      100 |     100 |     100 |
  app.js       |     100 |      100 |     100 |     100 |
 ...validation |     100 |      100 |     100 |     100 |
  ...eEmail.js |     100 |      100 |     100 |     100 |
  ...ssword.js |     100 |      100 |     100 |     100 |
  ...ername.js |     100 |      100 |     100 |     100 |
---------------|---------|----------|---------|---------|-------------------
Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
Snapshots:   0 total
Time:        0.807 s, estimated 2 s
Ran all test suites matching /app.mock.test.js/i.


1 yl oli umbes 28 sek, 2 yl aga alla 1 sekundi