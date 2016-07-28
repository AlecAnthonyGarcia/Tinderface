<img src="https://cloud.githubusercontent.com/assets/2003684/17205864/b61e53c6-5461-11e6-937d-02a63c2d20e2.png" width="275"/>
<img src="https://cloud.githubusercontent.com/assets/2003684/17205862/b6037ede-5461-11e6-9376-9bb52cac3664.png" width="275"/>
<img src="https://cloud.githubusercontent.com/assets/2003684/17205863/b614e0fc-5461-11e6-9b88-b591a5005d0a.png" width="275"/>

### What is Tinderface?
Tinderface is a web app that lets you see the Tinder profiles of your Facebook friends who are opted-in to Tinder Social.

### How does Tinderface work?
Tinderface utilizes Tinder's private API to retrieve information that the Tinder client already receives and uses it to present a UI for the user to interact with.

### Can I see all of my Facebook friend's Tinder profiles?
No, you can only see the Tinder profiles of your Facebook friends who have explicitly opted-in to Tinder Social.

### Will Tinderface hack me?
Tinderface does not save any information about you. We simply use your Facebook Access Token to fetch your Tinder authentication token so that we can automate API requests. We do not save your Facebook or Tinder tokens. You can view the source on GitHub and run the app yourself if you're paranoid.

## Installation

Install dependencies:

```sh
npm install
```

For quick development on the client (includes hot reloading):

```sh
npm test
```

To run the backend express server (required for communicating with the Tinder API):

```sh
npm start
```

The application will be running at http://localhost:3000
