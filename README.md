# Deviget Frontend Test

![Node.js CI](https://github.com/pablen/deviget-reddit-client/workflows/Node.js%20CI/badge.svg?branch=master)

Demo: [http://deviget-reddit-client.vercel.app/](http://deviget-reddit-client.vercel.app/)

## Instalation and running in development mode

```
$ npm i
$ npm start
```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### `npm run test`

Launches the test runner in the interactive watch mode.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />

### `npm run cypress`

Launches the end-to-end test runner in the interactive watch mode.<br />

1. First you need to run the app locally:

```
$ npm run start
```

2. Verify the local URL matches the `baseUrl` value defined in `cypress.json`.
3. Run Cypress.

```
$ npm run cypress
```

4. Run the tests by clicking the _Run all specs_ button.
