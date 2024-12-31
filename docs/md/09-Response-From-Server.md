<!-- Response From Server -->
<section
  id="response-from-server"
  aria-labelledby="response-from-server"
  data-item="Response From Server"
>
  <h2><a href="#response-from-server">Reviewing the response from the server</a></h2>
  

The adventure into the `cors` module is over. It's time to let Express deliver the response to the request.

1. Press the Step Over button in the debugger Control panel to create the `message` that is te be sent
2. Press the Continue button to execute `res.send(message)`

![Send the response](images/res.send.png)

3. Now look at the Console in your browser: all the `req.headers` are on display.
4. Select the Network tab and inspect the Headers for the last request in the list.

(Screenshot from Firefox)

![Response headers at the Network tab](images/response.png)

The `"Access-Control-Allow-Origin"` response header has been set, and its value is `"http://localhost:3000"`. (Note that somewhere on the way, all the words in the header key have been given an initial capital letter again.) This is the origin of the site from which you made the request for data from `"http://127.0.0.1:3000"`, so all is good.

Or is it?

</section>