<!-- Key Takeaways -->
<section
  id="key-takeaways"
  aria-labelledby="key-takeaways"
  data-item="Key Takeaways"
>
  <h2><a href="#Key Takeaways">So what should you take away from this tutorial?</a></h2>

At the top level, you have seen:

* You can use `cors` Node module to add a header to the server's response to a request, which will tell the browser whether it has the right to use that response.
* By default, an Express server will send the response (and run all the code required to generate the response) _even if_ the site that sent the request is not authorized to use the response.
* In your route callback, you can check whether `cors` has set the `"access-control-allow-origin"` header in the response to a value that matches the `origin` in `req.headers`. If not, your route callback can simply return a blank message.
  
At a deeper level, you have discovered:

* Testing how a bad actor might try to access your site can help you improve the performance of your code
* You can simulate calls to an API from within a site by pasting code into the Developer Console and executing it.
* Your browser provides you with an immense amount of information about the data it requests and receives
* You can step through the code of your server with the debugger.
* Exploring the code used by a Node module is informative and empowering.
* When you encounter a problem in a big project, you can use a "Divide and Conquer" approach. You can take a step back and create a bare-bones project that deals specifically with the problem, so that all the other details of your big project don't get in the way of your understanding.
* As an example of such simplification, you can test cross-origin issues using a single server app on a single computer.

## Further Reading

[Will it CORS](https://httptoolkit.tech/will-it-cors/) asks you what you want to achieve with CORS and then gives you the code and describes the steps you need to achieve you goal.

</section>
