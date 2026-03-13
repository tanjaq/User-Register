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

### Ülesanne 1 tulemused (terminalist)

#### Coverage (`npx jest app.test.js --coverage`)

```bash
PASS  ./app.test.js (20.237 s)
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        20.361 s, estimated 21 s
```

Coverage kokkuvõte:

```text
All files                 | 97.05 | 92.3 | 100 | 100
app.js                    | 100   | 92.3 | 100 | 100 | Uncovered: 13
validateEmail.js          | 85.71 | 75   | 100 | 100 | Uncovered: 9
validatePassword.js       | 100   | 100  | 100 | 100
validateUsername.js       | 100   | 100  | 100 | 100
```

#### Testide jooksuaeg (`npx jest app.test.js --verbose`)

```bash
PASS  ./app.test.js (20.251 s)
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        20.307 s, estimated 21 s
```

## Ülesanne 2: Mocked API testid
* Mocki emaili validatsioon kasutades `jest.mock()`
* Kirjuta samad testid `app.mock.test.js` faili
   * Testid peaksid olema identsed Ülesandega 1
* Käivita: `npm test -- app.mock.test.js`
   * Lisa coverage info
   * Lisa testide jooksuaja info
   * Võrdle jooksumisaega (Ülesanne 1 vs Ülesanne 2)

### Ülesanne 2 tulemused (terminalist)

#### Coverage (`npm test -- app.mock.test.js`)

```bash
PASS  ./app.mock.test.js
Test Suites: 1 passed, 1 total
Tests:       10 passed, 10 total
Snapshots:   0 total
Time:        0.314 s, estimated 1 s
```

Coverage kokkuvõte:

```text
All files                 | 100 | 95.45 | 100 | 100
app.js                    | 100 | 92.3  | 100 | 100 | Uncovered: 13
validatePassword.js       | 100 | 100   | 100 | 100
validateUsername.js       | 100 | 100   | 100 | 100
```

#### Testide jooksuaeg (`/usr/bin/time -p npm test -- app.mock.test.js`)

```bash
real 1.12
user 1.21
sys 0.27
```

### Jooksuaja võrdlus (Ülesanne 1 vs Ülesanne 2)

| Mõõdik | Ülesanne 1 (`app.test.js`) | Ülesanne 2 (`app.mock.test.js`) | Vahe |
|---|---:|---:|---:|
| Jest Time | 20.447 s | 0.314 s | ~98.5% kiirem |
| Shell real | 21.51 s | 1.12 s | ~94.8% kiirem |