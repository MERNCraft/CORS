<!-- Allowing CORS -->
<section
  id="allowing-cors"
  aria-labelledby="allowing-cors"
  data-item="Allowing CORS Requests"
>
  <h2><a href="#allowing-cors">Allowing Cross-Origin Resource Sharing</a></h2>


Back in step [2. A Basic Express Server](#a-basic-express-server), you installed a Node module called `cors`, but you haven't used it yet.

1.  Add this code to your `app.js` file, just after the line that says: `const app = express()`

```javascript
<i>const PORT = 3000

// Initialize the Express app
const express = require('express')
const app = express()</i>
<b>const cors = require('cors')

const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin:", origin);
    callback(null, true)
  }
}

app.use(cors(corsOptions))</b>
```
<small style="color:orange">Listing 10</small>

I'll go deeper into what this code does in the next section [8. What CORS Does](#what-cors-does). For now, it's enough to know that the code you have just added will allow any origin to connect with your Express server.

For reference, the complete code in the `app.js` file should look like this now:

```javascript
const PORT = 3000

// Initialize the Express app
const express = require('express')
const app = express()
const cors = require('cors')

const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin:", origin);
    callback(null, true)
  }
}

app.use(cors(corsOptions))


app.get('/', (req, res) => {
  // Respond to a request with a timed message giving
  // the URL to where the server received the request
  const { protocol, hostname } = req
  const message = `<pre>
Connected to ${protocol}://${hostname}:${PORT}
${Date()}
</pre>`

  res.send(message)
})


app.get('/headers', (req, res) => {
  const message = `<pre>
${JSON.stringify(req.headers, null, "  ")}
</pre>`

  res.send(message)
})


app.listen(PORT, optionalCallbackForListen) 


//Print out some useful information in the Terminal
function optionalCallbackForListen() {
  // Check what IP addresses are used by your 
  // development computer.
  const nets = require("os").networkInterfaces()
  const ips = Object.values(nets)
  .flat()
  .filter(({ family }) => (
    family === "IPv4")
  )
  .map(({ address }) => address)

  // ips will include `127.0.0.1` which is the
  // "loopback" address for your computer. This
  // address is not accessible from other
  // computers on your network. The host name
  // "localhost" can be used as an alias for
  // `127.0.0.1`, so you can add that, too.
  ips.unshift("localhost")

  // Show in the Terminal the URL(s) where you
  // can connect to your server  
  const hosts = ips.map( ip => (
    `http://${ip}:${PORT}`)
  ).join("\n  ")
  console.log(`Express server listening at:
  ${hosts}`);
}
```
<small style="color:orange">Listing 11</small>

2. In the Developer Console for the page served by `localhost`, rerun your last command, which made a request to `127.0.0.1`. This time, your request should succeed, and you should see the data that you expect from `req.headers`, which should look something like this ():

```bash-w
<i>Promise { &lt;state&gt;: "pending" }
&lt;pre&gt;
{
  "host": "127.0.0.1:3000",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:123.0) Gecko/20100101 Firefox/123.0",
  "accept": "*/*",
  "accept-language": "en-GB,en;q=0.7,en-US;q=0.3",
  "accept-encoding": "gzip, deflate, br",
  </i><b>"referer": "http://localhost:3000/",
  "origin": "http://localhost:3000",</b><i>
  "dnt": "1",
  "sec-gpc": "1",
  "connection": "keep-alive",</i>
  <b>"sec-fetch-dest": "empty",</b><i>
  "sec-fetch-mode": "cors",
  "sec-fetch-site": </i><b>"cross-site",</b><i>
  "if-none-match": "W/\"1e8-AvXgPd5sDM9iBxxmm97LaXmXJ+4\""
}
&lt;pre&gt;</i>
```


### What's new this time?

When you made a request to `localhost` from a page served by `localhost`:
* There was no `"origin"` entry in `req.headers`. There is now, and its value is `"http://localhost:3000"`.
* The value for `"sec-fetch-site"` was `"same-origin"`. Now it is `"cross-site"`.

If you look in the Terminal where you started your server, you should see a new item that has been logged:

```bash-w
origin: http://localhost:3000
```

This was caused by the code that you have just added (see Listing 10).

</section>