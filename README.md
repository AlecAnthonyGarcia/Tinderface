<img src="https://cloud.githubusercontent.com/assets/2003684/19017201/5f0237a2-87e6-11e6-9949-9fa94fd7064e.png" width="275"/>
<img src="https://cloud.githubusercontent.com/assets/2003684/19017212/b4bad974-87e6-11e6-84e4-51f117d25fde.png" width="275"/>
<img src="https://cloud.githubusercontent.com/assets/2003684/19017207/8e49589c-87e6-11e6-8991-4f279de0710e.png" width="275"/>

### What is Tinderface?
Tinderface is a web app that lets you see the Tinder profiles of your Facebook friends who are opted-in to Tinder Social.

### How does Tinderface work?
Tinderface utilizes Tinder's private API to retrieve information that the Tinder client already receives and uses it to present a UI for the user to interact with. The Tinder  profile on Tinderface will show the user’s biography, photos, distance away, and best of all: when they were last active, which was actually removed from the Tinder app, but their API still sends the timestamp.

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
