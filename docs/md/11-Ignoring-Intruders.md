<!-- Ignoring Intruders -->
<section
  id="ignoring-intruders"
  aria-labelledby="ignoring-intruders"
  data-item="Ignoring Intruders"
>
  <h2><a href="#ignoring-intruders">Ignoring Intruders</a></h2>


<details class="tip" open>
<summary>Summary</summary>
If you cloned the [GitHub repository](https://github.com/MERNCraft/CORS-backend), you can use `git checkout invitation-only` to apply the changes that are described below.

</details>

The solution is to check if the headers for the `res` object have been set to an acceptable value. The browser will give your client-side code access to the response from the server if `res.get("access-control-allow-origin")` is set to either `"*"` or to the value of `req.headers.origin`.

To check this:

1.   Add the following route to your `app.js` script:

```javascript-#32
<i>app.get('/headers', (req, res) => {
  const message = `<pre>
${JSON.stringify(req.headers, null, "  ")}
</pre>`

  res.send(message)
})


</i><b>app.get('/invitation-only', (req, res) => {
  const origin = req.get("origin")
  console.log("origin:", origin);
  // `req.headers.origin`, sent from the browser, will
  // be either undefined or a string

  const allowed = res.get("access-control-allow-origin")
  // After treatment by `cors, the response header for
  // "access-control-allow-origin" will be one of:
  // - undefined
  // - "*"
  // - the same string as origin
  console.log("allowed:", allowed);

  // If a direct request is made from the browser's
  // address bar, ``req.headers.origin`` will be undefined,
  // so cors will not set the "access-control-allow-origin"
  // header. This means that `allowed` will also be
  // undefined, and therefore === `origin`, even though it
  // is not a string.
  const ok = (allowed === origin || allowed === "*")
  console.log("ok", ok)
  
  // Only use server CPU time and bandwidth if the request
  // came from a whitelisted origin. If not, send an empty
  // message.
  const message = ok
    ? "TODO: DATABASE STUFF TO GENERATE A REAL MESSAGE"
    : ""

  res.send(message)
})</b><i>


app.listen(PORT, optionalCallbackForListen) </i>
```
<small style="color:orange">Listing 23</small>  

The last change you made to `corsOptions` (Listing 22) meant that the `"access-control-allow-origin"` response header was never set. You can change this so that only two server addresses are authorized:

2. Replace the current value for `corsOptions`...

```javascript-#9
const corsOptions = {
<i>  origin: (origin, callback) => {
    console.log("origin:", origin);
    callback(null, false)
  }
}</i>
```

    ... with this:

```javascript-#9
<b>const corsOptions = {
  origin: [
    /^HTTP:\/\/LOCALHOST:/i,
    "http://127.0.0.1:3000"
  ]
}</b>
```
<small style="color:orange">Listing 24</small>  


<details class="note" open>
<summary>lowercase</summary>
The first entry in the `origin` array is a Regular Expression. It will be used to check whether `res.headers.origin` starts with `HTTP://LOCALHOST:`, followed by a port number. The final `i` indicates that the match is case-<b><i>i</i></b>nsensitive, so it will also match `http://localhost:`.

The browser will always send `res.headers.origin` in lowercase. I wrote the Regular Expression in uppercase just to remind you that `cors` matches _string_ values (like `"http://127.0.0.1:3000"`) with case-<b><i>sensitive</i></b> matching, but Regular Expression matches can be case-<b><i>insensitive</i></b>.

</details>

Because you used `npm start` to tell `nodemon` to run your server, the server will be automatically relaunched after you save your changes.

3.  In the browser Console, paste the code below (note the new URL for the `fetch` command) and press Enter:
```javascript-ways
options = {"method": 'GET', "Content-Type": 'application/json'};
fetch('http://127.0.0.1:3000/invitation-only', options)
.then(res => res.text())
.then(text => console.log(text))
.catch(error => console.log("Error", error))
```
<small style="color:orange">Listing 25</small>  

This is a cross-origin request to the route that you have just created. The origin `'http://127.0.0.1:3000'` matches one of the values in the `origin` array in `corsOptions` so you should see the phrase "TODO: DATABASE STUFF TO GENERATE A REAL MESSAGE" logged in the Console.

And if you inspect the most recent request in the Headers tab of the Network pane, you'll see that the `Content-Length` for the response message is 47 characters:

![Response for an authorized site](images/resolve.png)

### No content for an unauthorized site

When you restarted your server, you should have seen something like this logged into your Terminal pane:

```bash-#
Express server listening at:
  http://localhost:3000
  http://127.0.0.1:3000
  http://192.168.0.11:3000
```
<small style="color:orange">Listing 26</small>

Your `corsOptions` object explicitly authorizes sites at the loopback addresses `http://localhost:<anyport>` and `http://127.0.0.1:3000` to connect. If there are other links (like "http://192.168.0.11:3000" above), these represent origins that are not whitelisted by `corsOptions`.

4. In the address bar of your browser, connect to `http://192.168.0.11:3000/invitation-only` (using your own non-loopback address instead of "192.168.0.11").
  
You should see `TODO: DATABASE STUFF TO GENERATE A REAL MESSAGE` in the browser window. This is because the request was made directly from the address bar, not from within the context of a page served by this site.

5. With the keyboard focus on the Console, press the Up arrow on your keyboard, so that the last command (Listing 25) is shown again.
6. Press the Enter key.

This time, as you might expect, the cross-origin request is rejected. If you inspect the most recent request in the Headers tab of the Network pane, you should see that the `Content-Length` of the response message was 0.

![Response for an authorized site](images/reject.png)

In a real project, you won't be using a message like `"TODO: DATABASE STUFF TO GENERATE A REAL MESSAGE"`. In a real project, when an authorized request is received, your server might actually do some CPU intensive work calling a database and waiting for the response.

Using this technique to check whether the site that makes the request is authorized to receive a response, you can save CPU cycles and bandwidth, and prevent bad actors who sniff for packets with software like WireShark from gaining access to resources that they have no right to.

</section>