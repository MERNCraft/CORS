<!-- What CORS Does Not Do -->
<section
  id="what-cors-does-not-do"
  aria-labelledby="what-cors-does-not-do"
  data-item="What CORS Doesn't Do"
>
  <h2><a href="#what-cors-does-not-do">What CORS Does Not Do</a></h2>

You might be tempted to think that your server ***only*** sends the requested resource back to the browser if `"Access-Control-Allow-Origin"` response header has been correctly set. You might think that if CORS does not set the `"Access-Control-Allow-Origin"` header, or sets it to a value that is incompatible with `res.headers.origin`, then it will ***not*** send the requested resource.

But that's not what `cors` does. The `cors` module does one job, and it does it well. It sets (or does not set) the `"Access-Control-Allow-Origin"` response header. That's all.

The code in your `app.js` script explicitly says...
```javascript-#
res.send(message)
```
<small style="color:orange">Listing 21</small>  

... and so that's what your server does. Even when `cors` has indicated that `res.headers.origin` is not allowed.

The browser receives the resource, whether it is allowed to use it or not, and it is the _browser_ that checks if the value of `"Access-Control-Allow-Origin"` response header gives it permission to use the resource.

### Confirming the browser receives impermissible resources

1. Edit your `corsOptions` object, so that it generates a value of `false` for the `origin` property:

```javascript-#8
<i>const corsOptions = {
  origin: (origin, callback) => {
    console.log("origin:", origin);
    callback(null, </i><b>false</b><i>)
  }
}</i>
```
<small style="color:orange">Listing 22</small>

2. Stop the debugger, by clicking on the Stop button in the debugger Control panel.

![Stop the debugger](images/originFalse.png)

3. Start your server normally, from the Terminal

![Start the server from the Terminal](images/restartServer.png)

4. From your browser Console, run the same command that you ran before to fetch data from `127.0.0.1` (see Listing 8).

The console should give you the same Error that you saw in Listing 9 (or something like it, depending on which browser you are using.) The Cross-Origin Request is blocked because the `‘Access-Control-Allow-Origin’` response header is missing.

5. Now open the Network tab and look at the Response Headers for this last request. The value for Content-Length is _not zero_. Most probably it is exactly the same as for the last successful request (see Figure 12).
   
![Content-Length is not zero](images/contentLength.png)

The `message` from your server _was_ delivered, even if the browser nobly refused to show it.

<details class="tip" open>
<summary>Wireshark</summary>
If you are not convinced, you could use a tool like [WireShark](https://www.wireshark.org/), which is free and open-source, to read the packets returned by the server, and sure enough: the incoming message contains the `message` that your `app.js` script asked the server to send.

![WireShark shows the incoming message](images/wireShark.png)

</details>

In other words, with its default settings, your Express server can waste both its CPU time and the bandwidth you pay for to send data across the Internet that only bad actors with rogue browser-like apps will be able to use.

</section>