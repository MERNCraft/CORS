<!-- A Basic Express Server -->
<section
  id="a-basic-express-server"
  aria-labelledby="a-basic-express-server"
  data-item="A Basic Express Server"
>
  <h2><a href="#a-basic-express-server"> Setting up a bare-bones Express server</a></h2>

Here are the steps that you need to create a very basic Express server, and check that it is working as expected.

1. Start a project folder for the backend
   ```bash-w
   mkdir backend && cd backend && npm init -y
   ```
2. Install the following dependencies  
   ```bash-w
   npm install express cors
   ```
   
3. Install nodemon as a dev dependency, to restart the server
   whenever any changes are made  
   ```bash-w
   npm install --save-dev nodemon
   ```
   
4. Add `"start": "nodemon app.js",` to "scripts" section of `package.json`, which should now look something like this:

```json
<i>{
  "name": "backend",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    </i><b>"start": "nodemon app.js",</b><i>
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC",
  "dependencies": {
    "cors": "^2.8.5",
    "express": "^4.18.2"
  }
}</i>
```
<small style="color:orange">Listing 1</small>

5. Create a file named `app.js` with the following script:
```javascript
const PORT = 3000

// Initialize the Express app
const express = require('express')
const app = express()


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
<small style="color:orange">Listing 2</small>

<details class="note" open>
<summary>optionalCallbackForListen!?</summary>
The `optionalCallbackForListen()` in the script above contains some advance code that I won't explain here. You can think of it as a black box that prints out in the console all the IP addresses that you can use to connect to your Express server.

</details>

6. In the Terminal, run:
 ```bash-w
 npm start
 ```
  
7. You should see something like this:
```bash-w
Express server listening at:
  http://localhost:3000
  http://127.0.0.1:3000  
  http://192.168.0.11:3000
```
<small style="color:orange">Listing 3</small>


<details class="note" open>
<summary>Where the server is listening</summary>
You should see at least the first two entries in this list. You will see more entries if you have a connection to a network, via Wi-Fi or an Ethernet (RJ45) cable. The IP address of any of these additional entries is likely to be different from what is shown above. 

</details>

8. Ctrl-click or Cmd-click on a link to open your browser. You should see something like this:

```bash-w
Connected to http://192.168.0.11:3000 
Wed Feb 21 2024 10:54:05 GMT+0200 (Eastern European Time)
```

The hostname and port number will depend on your network, on your choices, and on which link you clicked on.


<details class="note" open>
<summary>Local Area Network</summary>
The links to [http://localhost:3000](http://localhost:3000) and [http://127.0.0.1:3000](http://127.0.0.1:3000) will only work from the same computer where the server is running. If you see any other links, then you can connect to these from any other device on your network. In my case, for example, I can use the browser on my smartphone to connect to http://192.168.0.11:3000, and I will see the result shown above.

</details>

</section>