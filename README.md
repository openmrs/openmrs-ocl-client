<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

### [![Build Status](https://github.com/openmrs/openmrs-ocl-client/actions/workflows/build.yml/badge.svg)](https://github.com/openmrs/openmrs-ocl-client/actions/workflows/build.yml) [![Coverage Status](https://coveralls.io/repos/github/openmrs/openmrs-ocl-client/badge.svg?branch=master)](https://coveralls.io/github/openmrs/openmrs-ocl-client?branch=master)

## Automated Tests Workflows
[![Basic Dictionary Management](https://github.com/openmrs/openmrs-ocl-client/actions/workflows/basic-dictionary.yml/badge.svg)](https://github.com/openmrs/openmrs-ocl-client/actions/workflows/basic-dictionary.yml)
[![Organization Management](https://github.com/openmrs/openmrs-ocl-client/actions/workflows/organisation-management.yml/badge.svg)](https://github.com/openmrs/openmrs-ocl-client/actions/workflows/organisation-management.yml)

# OpenMRS Dictionary Manager

The OpenMRS Dictionary Manager is a tool to create and maintain OpenMRS concept dictionaries in the cloud, using both expert-curated concepts from sources such as CIEL as well as custom implementation-specific concepts.

## Available Scripts
### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:8080](http://localhost:8080) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

## Setup

### Native Environment Setup
- Clone a forked version of the repository to your computer;  
`git clone https://github.com/yourusername/openmrs-ocl-client.git`
      
- In the root directory of the project install all the dependencies;  
`npm install`

### Running the Docker Image
- Build the Docker image using the provided Docker file in the root folder. 
`docker-compose build`.

- Run the docker image using docker-compose  
`docker-compose up`.

- Navigate to [http://localhost:8080/](http://localhost:8080/).

### Choosing an API server
The API accessed by this UI falls back to the OpenMRS demo environment.
To specify your own API server create a file called `env-config.js` under the public directory containing;
```javascript
var OCL_API_HOST = "<your endpoint, e.g https://api.staging.openconceptlab.org>";
var TRADITIONAL_OCL_HOST = "<your endpoint, e.g https://staging.openconceptlab.org>";
var OCL_SIGNUP_URL = "<your endpoint, e.g https://app.staging.openconceptlab.org/#/accounts/signup>"
```
These variables will automatically be injected into the app at runtime. This is the same strategy we use while deploying the application.

### Running Cypress Tests
As opposed to the tests built into the package using Jest, we also supply some end-to-end tests written using [Cypress](https://www.cypress.io/). These are run automatically on each PR or commit. In the CI environments, we actually spin up a local instance of the OCL API and then the OpenMRS Dictionary Manager via Docker. This can be done locally by running the [`start_local_instance.sh`](start_local_instance.sh) script. From there, the CI will run `npm test:integration` which will run Cypress and all tests locally.

If Cypress fails to run on your local instance for whatever reason, you can use the [`run_e2e.sh`](run_e2e.sh) script to run the Cypress tests inside a Docker container. This is useful for running the tests locally, but if tests fail, it is easier to use the Cypress UI to diagnose the issues. To run Cypress with the UI (assuming Cypress works locally), you can run `npx cypress open`. Unfortunately, it's not possible to run the Cypress UI in the Docker container to the best of my knowledge.

## Contributing to this project
- Visit the project [wiki](https://wiki.openmrs.org/display/projects/Contributing+to+OCL+for+OpenMRS%3A+Developer+Guide) for a layout of the project and how you can start contributing.

### Gotchas
Things we've pulled our hair out for so you don't have to
- Have an env-config file before running the e2e tests

## Support
- Talk to us at [OpenMRS Talk](https://talk.openmrs.org/t/ocl-for-openmrs-squad/25831)

## License
- [MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
