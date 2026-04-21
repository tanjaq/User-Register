# Next steps

From your own clone or fork of the repository:

```bash
git checkout -b feature/registration-api-tests
# copy these files in, or apply ../user-register-pr.patch
npm install
npm test
npm test -- app.mock.test.js

git add app.js app.test.js app.mock.test.js registrationApiTestSuite.js PR_NOTES.md NEXT_STEPS.md
git commit -m "Add registration API tests and mocked email validation tests"
git push origin feature/registration-api-tests
```

Then open a pull request and paste in:

- the Jest coverage table from `npm test`
- the `Time:` line from `npm test`
- the `Time:` line from `npm test -- app.mock.test.js`
- a short note that the mocked suite avoids the intentionally slow email validation
