<!-- Inspecting Request Headers -->
<section
  id="request-headers"
  aria-labelledby="request-headers"
  data-item="Request Headers"
>
  <h2><a href="#request-headers">Inspecting the `headers` in the requests</a></h2>


When your browser connects to a server, its request contains a lot of information. The server needs this information to work out what to send in response. If the request seems to come from an untrustworthy source, the server should send a response indicating that it refuses to send what was requested.

Here's how you can see what _headers_ have been sent to the server by the browser:

1. Add a new _route_ to the `app.js` script:

```javascript-#8
<i>app.get('/', (req, res) => {
  // Respond to a request with a timed message giving
  // the URL to where the server received the request
  const { protocol, hostname } = req
  const message = `<pre>
Connected to ${protocol}://${hostname}:${PORT}
${Date()}
</pre>`

  res.send(message)
})

</i><b>app.get('/headers', (req, res) => {
  const message = `<pre>
${JSON.stringify(req.headers, null, "  ")}
</pre>`

  res.send(message)
})</b><i>

app.listen(PORT, optionalCallbackForListen)</i> 
```
<small style="color:orange">Listing 4</small>

Because you are using `nodemon` to run `app.js`, the server will restart immediately after you save your changes. Any new requests made to the server will apply the new code.

2. In the address bar of your browser, add `/headers` after the root URL for the server. The address should look something like...
 
   ```bash-w
   http://192.168.0.11:3000/headers
   ```
   
... but the actual hostname will depend on the link that you chose to click on.

3.  When you visit this URL, you should see something like this in your browser...
```json-w
{
  "host": "192.168.0.11:3000",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0",
  "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "accept-language": "en-GB,en;q=0.7,en-US;q=0.3",
  "accept-encoding": "gzip, deflate",
  "dnt": "1",
  "sec-gpc": "1",
  "connection": "keep-alive",
  "upgrade-insecure-requests": "1",
  "if-none-match": "W/\"1f8-tKI1cj2bpbkgxIdZM72V7n0xKOs\""
}
```
<small style="color:orange">Listing 5</small><br>  
... and possibly some other headers.

For more details, see [here](https://developer.mozilla.org/en-US/docs/Glossary/Request_header).


<details class="tldr">
<summary>Where the headers come from</summary>
The `req` object does not have a property of its own called `headers`. So where does `req.headers` come from?

Express is built as a wrapper for Node's built-in [`http`](https://nodejs.org/api/http.html) module. Express creates the `req` object as an instance of the native [http.IncomingMessage](https:\/\/nodejs.org/api/http.html#class-httpincomingmessage) class.
You can see this in the script at `node_modules/express/lib/request.js`:

```javascript-#31
var req = Object.create(http.IncomingMessage.prototype)
```

The value for `req.headers` is provided by the [`headers`](https://nodejs.org/api/http.html#messageheaders) property of the `IncomingMessage` prototype.

</details>

</section>
