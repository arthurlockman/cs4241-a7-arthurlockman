
Assignment 7 - Sessions
===

## Technical Achievement

For this assignment I elected to do two things for technical achievement: store data in the backend using Firebase and use [socket.io](http://socket.io) to serve data in real time to clients.

### Firebase

Firebase is a fairly straightforward integration. Instead of storing data in memory as javascript objects, I simply push out the JSON data directly into firebase for storage instead. This means that the data will persist across dyno reboots. It also means that the server can listen for changes on the database since Firebase provides convenient listeners to clients that can fire whenever a new message is added to the database. I connected this to the messages object so that the server can process each message and send it out to the client using sockets. This code is partially in the [server](http://cs4241-a7-arthurlockman.herokuapp.com/server.js), and partially in the [client](http://cs4241-a7-arthurlockman.herokuapp.com/scripts.js).

### Socket.io

Socket.io was used to push data out to the clients when new data became available on the server. Each client opens a new socket connection to the server, and whenever the Firebase database alerts the server that a new message has been posted, the server pushes this data out to the clients over the socket connection. This means that if a user pushes a new post from any computer, all of the other users on the web page will get that update immediately. To make this work I had to switch from a raw HTTP server to using Express, since on Heroku only one port is allowed to be allocated by clients. socket.io and Express have a method of serving the socket connection and the web server over the single heroku port, so I needed to migrate to Express. This code is partially in the [server](http://cs4241-a7-arthurlockman.herokuapp.com/server.js), and partially in the [client](http://cs4241-a7-arthurlockman.herokuapp.com/scripts.js).

## Assignment Description

Many of you know YikYak, the "anonymous" (aka not really anonymous) post sharing app. 
The goal of this assignment is to use your knowledge of cookies, storage, and sessions to make a similar app, where users can post messages that are automatically assigned an anonymous id.

Requirements:

1. Users should be able to post messages that are stored on the server and rendered when they and other people visit the page.
2. Each new session should have a specific ID that is used to identify the post both in the browser and on the server.
3. Users should be able to close the page in their browser, re-open it later, and still be able to post with their initial ID.
4. There are many possible technical achievements here. Look to any social posting site for inspiration. Be creative.

Tips:

- To test the first task, use a different browser since it will act as a different "person".
- For the second and third tasks, you'll find many possible approaches using storage and/or cookies.


### Details

Do the following to complete this assignment:

1. Clone the [repo](https://github.com/cs4241-16b/A7-Sessions). **DO NOT FORK THE REPO and DO NOT MAKE IT PUBLIC.** This is not an extension of previous projects, though you are free to re-use code. 
2. Deploy your project to Heroku.
    * Ensure that your project has the proper naming scheme (`cs4241-a7-yourGitHubUsername`) so we can find it.
3. The project will be graded against the following rubric (120 total):
    * 100: Fulfilling the requirements above
    * 10: Good theming and layout
    * 10: Technical Achievement: Have fun here! Check out advanced resources for some ideas. Don't forget to include an explanation of your achievement on your page.
4. Include a README.md describing your technical achievement to receive credit. 
    * Your README.md should be served when an attempt to access `<your-url>/README.md` is made.
    * Pay attention to capitalization of your filename -- it matters on git/heroku. Be sure to test that the readme is accessible from heroku.