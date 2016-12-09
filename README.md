Assignment 7 - Sessions
===

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

Details
---

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