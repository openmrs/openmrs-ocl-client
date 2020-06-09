<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

### [![Build Status](https://travis-ci.org/openmrs/openmrs-ocl-client.svg?branch=master)](https://travis-ci.org/openmrs/openmrs-ocl-client) [![Coverage Status](https://coveralls.io/repos/github/openmrs/openmrs-ocl-client/badge.svg?branch=master)](https://coveralls.io/github/openmrs/openmrs-ocl-client?branch=master)

# openmrs-ocl-client
> OCL client for OpenMRS is a web service that will allow OpenMRS users to manage their dictionaries in the cloud,
> allow re-usability of the existing concepts and allow one to create custom concepts to complement existing ones while building their dictionaries.

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
var OCL_API_HOST = "<your endpoint, e.g https://api.qa.openconceptlab.org>";
var TRADITIONAL_OCL_HOST = "<your endpoint, e.g https://qa.openconceptlab.org>";
```
These variables will automatically be injected into the app at runtime. This is the same strategy we use while deploying the application.

## Contributing to this project
- Visit the project [wiki](https://wiki.openmrs.org/display/projects/Contributing+to+OCL+for+OpenMRS%3A+Developer+Guide) for a layout of the project and how you can start contributing.

### Gotchas
Things we've pulled our hair out for so you don't have to
- Have an env-config file before running the e2e tests

## Support
- Talk to us at [OpenMRS Talk](https://talk.openmrs.org/t/ocl-for-openmrs-squad/25831)

## License
- [MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
