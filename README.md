<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

# openmrs-ocl-client
> OCL client for OpenMRS is a web service that will allow OpenMRS users to manage their dictionaries in the cloud,
> allow re-usability of the existing concepts and allow one to create custom concepts to complement existing ones while building their dictionaries.

## Available Scripts
### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />

## Set-up Process

### Manual Environment Setup
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

## Contributing to this project
- Visit the project [wiki](https://wiki.openmrs.org/display/projects/Contributing+to+OCL+for+OpenMRS%3A+Developer+Guide) for a layout of the project and how you can start contributing.

## Support
- Talk to us at [OpenMRS Talk](https://talk.openmrs.org/t/ocl-for-openmrs-squad/25831)

## License
- [MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
