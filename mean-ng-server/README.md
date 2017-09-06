# MEAN-NG Server

## Overview

A baseline NodeJS/Express server with fully featured authentication. Main features:

* Runs in secure HTTPS mode 
* Uses MongoDB to store user info and session data
* Password recovery cycle using a generated temporary token
* Uses Passport strategies
* Implemented basic email/password authentication (Passport Local strategy)
* Implemented LinkedIn authentication (Passport LinkedIn OAuth2 strategy)
* API documented using APIDoc style comments

## Using the Server

Clone the project and install
```bash
$ npm install
```

**Note 1**: prior to running the server read below on setting up the environment.

**Note 2**: make sure mongoDB (mongod) is running.

Run the server (alternatively you can use a debugger, e.g. using Visual Studio's debugger)
```bash
$ node server
```

The port is set in the `.env` file, typically port 3443 is used so the server address is: ```https://localhost:3443```

You should get the following messages in the console:
```bash
$ node server
Secure Server listening on port 3443
Database connected: mongodb://localhost/MEAN_NG
```

## Before you start

To get this server to run properly you must do the following:

### ENVIRONMENT 

Create a `.env` file in the root folder. The following environment parameters must be set there (optional parameters are commented out):
```
FRONTEND_URL=http://localhost:4200

### Server port 
HTTP_PORT=3000
HTTPS_PORT=3443

### example: mongodb://<user>:<pass>@my-db-domain.com:27017/db_name
DB_URL=mongodb://localhost/[db_name]

# USER SESSION ==============================================================================
# ===========================================================================================

### Session secret
SESSION_SECRET=[production secret phrase]

### Is session HTTPS?
SESSION_SECURE=true

### By default, connect-mongo uses MongoDB's TTL collection feature (2.2+) to have mongod automatically 
### remove expired sessions. Requires admin rights to MongoDB - likely not suitable for production
### options: 'native' or 'disabled'
SESSION_TTL=native

### LinkedIn OAuth
LINKEDIN_API_KEY=XXXXXXXXXXXX
LINKEDIN_SECRET_KEY=XXXXXXXXXXXXXXXX
LINKEDIN_CALLBACK_URL=https://localhost:3443/api/v1/user/linkedin/callback

### Facebook OAuth
FACEBOOK_APP_ID=XXXXXXXXXXXX
FACEBOOK_APP_SECRET=XXXXXXXXXXXXXXXX
FACEBOOK_CALLBACK_URL=http://localhost:3443/api/v1/user/facebook/callback

# EMAILER ===================================================================================
# ===========================================================================================
EMAIL_HOST=smtp.mailer.com
EMAIL_PORT=587
EMAIL_USERNAME=dj@mailer.com
EMAIL_PASSWORD=12345678
EMAIL_SECURE=true

SUPPORT_EMAIL=support@mycompany.com
```

### HTTPS

In order to use HTTPS in local host generate the pem files (`cert.pem` and `key.pem`) and place them in the `authentication/certs` folder.
To generate a self signed certificate use:
```bash
$ openssl req -x509 -newkey rsa:2048 -nodes -keyout key.pem -out cert.pem -days 365
```

### MAILER

In some cases the mailer will fail running in localhost.


### API DOCUMENTATION

To generate the doc from the code use [apiDoc](http://apidocjs.com). Simply install `apidoc` globally and run the doc creation script:
```bash
$ npm install apidoc -g
$ npm run apidoc
```

You may add an `apidoc.json` file with additional documentation info:
```json
{
    "name": "My Project",
    "version": "0.0.1",
    "description": "My Project's API guide",
    "template": {
        "forceLanguage": "en"
    }
}
```