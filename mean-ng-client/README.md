# MEAN-NG Client

## Overview

A baseline Angular 4 client with user authentication support. Main features:

* Created with Angular/CLI 1.*
* Angular 4.*
* Uses Bootstrap 3.x
* Authentication module is lazy-loaded 
* Authentication using email/password, LinkedIn, and Facebook
* Full password recovery cycle

## Using the Client

Clone the project and install
```bash
$ npm install
```

**Note**: make sure the MEAN-NG server is up and running, flow the Server *README*.

Run the client 
```bash
$ npm start
```

This will build the client bundles and activate a server in watch mode. The client port is typically set to 4200, you can run the Client from the browser at: ```http://localhost:4200```

To build a deployment version use:
```bash
$ npm run build
```