<!-- Using Dev Tools -->
<section
  id="using-dev-tools"
  aria-labelledby="using-dev-tools"
  data-item="Using Browser Dev Tools"
>
  <h2><a href="#using-dev-tools">Using your browser's Developer Tools to inspect the headers</a></h2>

To be honest, you didn't actually need to create a separate `/headers` route to deliver the request headers to your browser. You can find this information through the Developer Tools in your browser itself.

1. Open the Developer Tools of your browser and activate the Network tab. 
2. Ensure that the All button (at the left of the line of data type buttons near the top) is selected
3. You should see a table containing a list of requests that your browser has made to the server
4. Click on the Domain or Name column, to open a pane where you can choose to select the Headers tab.
5. If necessary, click on the disclosure triangles for Response Headers and Request Headers, so that all headers are visible.

Here is a screen shot from Google Chrome. The display in your browser may be different.

![The Network tab of Chrome's Developer Tools](images/network.png)

### The curious incident of the `origin` key in `req.headers`

As you may already know, the `cors` module uses the value of `req.headers.origin` to decide what action to take. But as you can see, there is _no_ entry with the key [`origin`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Origin), either in the `req.headers` object that is displayed in your browser window or in the Network tab of the Developer Tools.

This is because your request is made directly from the address bar of your browser. The browser considers that any direct request like this is innocent, and thus trustworthy, so it doesn't send an `origin` header.

If there _were_ a value for `req.headers.origin` it would have a value with one of these formats:

```bash-w
<scheme>://<hostname>
<scheme>://<hostname>:<port>
```
Here are some examples of what `req.headers.origin` could look like:
```bash-w
https://192,168.0.42
https://www.example.com
http://example.com:3000
```

The lack of an entry for `origin` indicates that the browser considers that the request is for a resource from the _same site_, and so the request can be trusted.

</section>