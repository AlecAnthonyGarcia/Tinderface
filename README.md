# [Material-UI](http://callemall.github.io/material-ui/) - Example Webpack Project with Express

This is an example project that uses [Material-UI](http://callemall.github.io/material-ui/) served with Express.
This project adopts the Flux architecture design, so make sure you understand how Flux operates before attempting 
to use this. Sample stores, actions, and a dispatcher are provided, but are NOT linked to the webpage in anyway.git
## Installation

Install dependencies

```sh
cd materialui-boilerplate
npm install
```

To run the express application:

```sh
npm start
```

The server can be located at http://localhost:3000

For use the webpack live server for development, use:

```sh
npm test
```

The live server is located at http://localhost:3000

##File paths

 - src: Our main source folder for both the client and server applications 
    - client: The client application and public www folders
        - app: The main client application that renders the React components
        - www: Static files served to clients
    - server: The server files
        - routers: Routers for our express application
 
