# MEAN-NG (client-server with full user authentication)
This project expands on my [MEAN-NG Phase 0](https://github.com/nukegold/mean-ng-phase0) and [MEAN-NG V1](https://github.com/nukegold/MEAN-NG-V1) scaffolds. This version is an evolution based on real-world needs when using the previous versions. For example, full separation of client and server with CORS support built in.

To maintain a generic scaffold this project provides only a very basic website placeholder and a full authentication scheme: email/password, LinkedIn, and Facebook (others can be added using Passport strategies).

![Screenshot](https://pbs.twimg.com/media/DJB2O7QW0AAEX6T.jpg:large)

## Key features:
* Server and client can run from separate domains using CORS
* Client can also run from a `dist` folder in the server

---

### Server
* Runs in secure HTTPS (including in localhost)
* Cross-Origin Resource Sharing (CORS) - full separation of client and server projects
* Uses MongoDB to store user info and session data
* User authentication using Passport strategies (Local, LinkedIn, Facebook)
* Supports password recovery cycle using a temporary token
* Implemented basic email/password authentication (Passport Local strategy)
* Implemented LinkedIn authentication (Passport LinkedIn OAuth2 strategy)
* Implemented Facebook authentication (Passport Facebook strategy)
* API documented using APIDoc style comments

#### Before you start

Please read the *README* file in the mean-ng-server folder for guidance on how to set up the `.env` file, and preparing self-signed keys for using HTTPS.

---

### Client
* Created with Angular/CLI 1.*
* Angular 4.*
* Uses Bootstrap 3.x
* Authentication module is lazy-loaded 
* User authentication using email/password, LinkedIn, and Facebook
* Full password recovery cycle
* Remember me checkbox
* Sample website as a template for most typical projects

For further details see the *README* file in the mean-ng-client folder.
