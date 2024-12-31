<!-- A Cross Origin Request -->
<section
  id="a-cross-origin-request"
  aria-labelledby="a-cross-origin-request"
  data-item="A Cross Origin Request"
>
  <h2><a href="#a-cross-origin-request">Making a Cross-Origin Request</a></h2>

As you saw in step [2. A Basic Express Server](#a-basic-express-server), you can connect to your server through at least two different URLs. What happens if you try to access the server at one URL through a page that was served from the other?

1.  With your browser's Developer Console active, press the Up arrow on your keyboard. This will read the last command from the Console's history and paste it back into the Console.

2.  Change just the hostname from `localhost` to `127.0.0.1`, as shown below:

```javascript-w
options = {"method": 'GET', "Content-Type": 'application/json'};
fetch('http://127.0.0.1:3000/headers', options)
.then(res => res.text())
.then(text => console.log(text))
.catch(error => console.log("Error", error))
```
<small style="color:orange">Listing 8</small>

3.  Press the Enter key.

This time, depending on which browser you are using, you should see something like this in the Console:

```bash-w
▶ Promise { &lt;state&gt;: "pending" }
Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource (Reason: CORS header ‘Access-Control-Allow-Origin’ missing). Status code: 200.

Error TypeError: NetworkError when attempting to fetch resource.
```
<small style="color:orange">Listing 9</small>

Whatever browser you are using, the message should tell you that there is no `‘Access-Control-Allow-Origin’` CORS header set. And instead of logging the expected `req.headers` data, the operation triggers an error.

### What does this mean?

It means that, by default, your server will refuse to serve any data to a web page on a site where the hostname of the site's server is not the same as the hostname from which the data is requested. And this is true, even when it is _exactly the same server app_ that is accessible through two different host names.

</section>