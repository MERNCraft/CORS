---
title: Finding your way around CORS
subtitle:  with a basic Express server and VS Code's debugger
month: December 2024
organization: MERNCraft
repo: CORS
---
<!-- Intro -->
<section
  id="intro"
  aria-labelledby="intro"
  data-item="Introduction"
>
  <h2><a href="#intro">Introduction</a></h2>
  
# An Express server for finding your way around CORS #

This tutorial was inspired by a group of students who were building a frontend and a backend for their first full-stack project. They wanted to deploy the backend to [a site that offers free hosting](https://render.com/pricing) for hobbyists, students, and indie hackers. And they wanted to prevent anyone else from obtaining resources from their backend.

They knew that CORS, or [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) is a mechanism that allows your server to whitelist or blacklist which sites can access the resources on your site. But CORS wasn't working the way they had assumed it would work.

They discovered an issue when they deliberately made a request from an unauthorized origin. Their CORS code was apparently refusing the request, which is good, but their database was being queried all the same. Which was not what they wanted. 

 
<details class="note" open>
<summary>Why use CORS?</summary>
You can use CORS to:

* Prevent third-party sites from hot-linking to your images, videos, fonts and other resources
* Decide which sites can have read data from your server's API

</details>

### Goals
In this tutorial, you will be setting up a basic Express server and getting it to respond nicely to requests from a source that can be trusted, and to refuse to allow your browser to use information obtained by sources which have not been whitelisted.

You'll see how you can dive into the code of the `cors` Node module itself, and emerge with a deep understanding of what the `cors` module does... and what it does not do.

And finally, you'll see how to block sites from getting any information from your server, unless they have been whitelisted.


<details class="note" open>
<summary>Who this tutorial is for</summary>
Before you start this tutorial:

* You should be comfortable with JavaScript in general and the [Express Node module](https://expressjs.com/) in particular.
* You should know [how to access the Developer Tools](https://balsamiq.com/support/faqs/browserconsole/) in your favourite browser.
* You should also understand a few basic `bash` commands including those used with `npm`.
* It helps if you know how to use [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise) and the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch), but you can skip over this code without losing the thread.

I'll occasionally use some more advanced code, simply to make your life easier. This should "just work" even if you don't fully understand it.

</details>

### Source code

The [GitHub repository](https://github.com/MERNCraft/CORS-backend) for this tutorial has two branches: `main` and `invitation-only`. If you clone the repository, you will need to run `npm install` before you can use `npm start` to run the server.

The second branch contains an updated version of `main` that is used in the second part of the tutorial.

<details class="env" open>
<summary>Working with VS Code</summary>
There is a section on using a debugger to step through the source code of the `cors` Node Module. I'll be using [Visual Studio Code](https://code.visualstudio.com/download) as my code editor, so the steps and the screenshots that provide will refer to the [VS Code debugger](https://code.visualstudio.com/docs/editor/debugging).

If you use a different development environment, I encourage you to follow using the debugger that you are used to. However, you don't _need_ to use a debugger at all to follow the explanations about how `cors` works; you can simply work through my explanations of the code.

</details>

</section>