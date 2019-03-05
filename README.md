<img src="https://cloud.githubusercontent.com/assets/668093/12567089/0ac42774-c372-11e5-97eb-00baf0fccc37.jpg" alt="OpenMRS"/>

[![Build Status](https://travis-ci.org/openmrs/openmrs-ocl-client.svg?branch=master)](https://travis-ci.org/openmrs/openmrs-ocl-client)
[![Coverage Status](https://coveralls.io/repos/github/openmrs/openmrs-ocl-client/badge.svg?branch=master)](https://coveralls.io/github/openmrs/openmrs-ocl-client?branch=master)
# openmrs-ocl-client

> OCL client for OpenMRS is a web service that will allow OpenMRS users to manage their concepts on the web,
> allow reusability of the existing concepts and allow one to create their concepts if they are not in existence.

## Build
## Requirements
### Ensure you have NodeJS and Npm installed before you start the installation process
- To download NodeJS and Npm [click here](https://nodejs.org/en/download/). OR To install Node.js and Npm via package manager [click here](https://nodejs.org/en/download/package-manager/)
### Npm is distributed with Node.js- which means that when you download Node.js, you automatically get npm installed on your computer.
### Set-up Process (Manual Environment Setup)
```
- Fork the repository by clicking on the Fork button located below the navigation bar on the right side of the page.
- Clone the forked repository to your computer ensure to run the command below in the directory you want to store the project.
    # git clone [the url of the repository] For example; 
    # git clone https://github.com/yourusername/openmrs-ocl-client.git
    # Create a .env file in the root directory with the variables API URL and Traditional OCL URL as shown below to access app in dev mode;
      REACT_APP_OCL_API_HOST=https://api.qa.openconceptlab.org/
      REACT_APP_TRADITIONAL_OCL_HOST=https://qa.openconceptlab.org
      
- In the root directory of the project install all the dependencies using the command below 
    $ npm install
```
### Run in development
```
- After installing all the dependencies:
```
1. Run the command below to start the server
    ```
    npm start
    ```
- The site should now be running at http://localhost:3000/ in the browser where you will see the app, You can change the port to your wish.
### To change ports
```
- Modify scripts part of package.json and add the port you want to use:
```
```
1. For MacOs or Linux:
"start": "PORT=3006 npm run build:css && react-scripts start"
```
```
2. For Windows:
"start": "set PORT=3006 && npm run build:css && react-scripts start"
```
```
For instances where port 3000 is being used it will prompt you to reply with letter Y to change the port automatically.
```
## Setting up with Docker

 Our environments are running in docker. 

 Ensure you have docker installed and running locally. Install docker [from here](https://www.docker.com/community-edition).

```
- Fork the repository by clicking on the Fork button located below the navigation bar on the right side of the page.

- Clone the forked repository to your computer and ensure to run the command below in the directory you want to store the project.

    $ git clone [the url of the repository] For example: 

    $ git clone https://github.com/yourusername/openmrs-ocl-client.git
```
### Running the Docker Image
```
- Build the Docker image using the provided Dockerfile in the root folder. 
   
$ docker build -t openmrs/ocl-client:local .

- Run the docker image using docker-compose

$ docker-compose -f docker/docker-compose.yml up -d

- Navigate to your http://localhost:8081/
You should now see your app running :)
```

### Running tests
```
To run tests 
 $ npm test -- -u --coverage
```

### Creating a Sass build
```
- To compile Sass to CSS each time you make a change to a file with a .scss file 
  extension, run the command below.

$ npm run build:css

- For automated Sass compilation with styles hot reloading, run the command below

$ npm run watch:css
```

## How to contribute to this project?
 - Please read [OpenMRS wiki](https://wiki.openmrs.org/) for awareness on the code of conduct used in OpenMRS organization 
 - And to get you started with the project please use the OpenMRS-OCL [documentation](https://docs.google.com/document/d/1R_Fgr5SBl4xFNJgj6yMJNVY63b5H_OUqM55o1GFqFKs/edit#heading=h.rc908wooykzg)

## Support

Talk to us on [OpenMRS Talk](https://talk.openmrs.org/)

## License

[MPL 2.0 w/ HD](http://openmrs.org/license/) © [OpenMRS Inc.](http://www.openmrs.org/)
