# Testide kokkuvõte

Kõik testid jooksid edukalt. Coverage on 100% kõikides failides. Testide jooksuaeg oli ~23 sekundit.

## Testide tulemused

PASS  validation/validateUsername.test.js  
PASS  validation/validatePassword.test.js  
PASS  ./app.mock.test.js  
PASS  validation/validateEmail.test.js (10.292 s)  
PASS  ./app.test.js (22.524 s)  

## Coverage

| Fail                        | Statements | Branches | Functions | Lines |
|------------------------------|-----------|---------|-----------|-------|
| app.js                       | 100%      | 100%    | 100%      | 100%  |
| validation/validateUsername.js | 100%    | 100%    | 100%      | 100%  |
| validation/validatePassword.js | 100%    | 100%    | 100%      | 100%  |
| validation/validateEmail.js    | 100%    | 100%    | 100%      | 100%  |

## Testide jooksuaeg

22.752 s

## Ülesanne 2: Mocked API testid

Kõik mockitud testid jooksid edukalt. Coverage on endiselt 100%. Testide jooksuaeg on tunduvalt lühem, kuna mockimine eraldab emaili valideerimise loogika.  

### Testide tulemused (mockitud)

PASS  ./app.mock.test.js  
  given correct username and password
  - return status 200
  - returns userId
  - response content type is JSON
  - returns correct message
  - userId is "1"

  given incorrect or missing username and password
  - return status 400
  - returns error message
  - does not return userId
  - missing username returns 400
  - missing password returns 400
  - missing email returns 400

### Coverage

| Fail                        | Statements | Branches | Functions | Lines |
|------------------------------|-----------|---------|-----------|-------|
| app.js                       | 100%      | 100%    | 100%      | 100%  |
| validation/validateUsername.js | 100%    | 100%    | 100%      | 100%  |
| validation/validatePassword.js | 100%    | 100%    | 100%      | 100%  |

### Testide jooksuaeg

0.528 s