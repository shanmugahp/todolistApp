# todolistApp
Todo list APP created usng MERN stack

Running instructions.

Download the sourcecode : 
`git clone https://github.com/shanmugahp/todolistApp
`\

The application has three components.
1) Front End React Client that is secured with Okta credentials.
2) Resource server built on nodejs express framework and secured by jwt token verification.
3) MongoDB backend for storage.

### Run the backend:
`docker-compose up`

###Run the client:
`cd $PROJECT_HOME/client`\
`npm install`\
`npm start`
###Test
Login to http://localhost:8080

API hosted on http://localhost:8081


