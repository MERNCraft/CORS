<!-- Same Origin Cross Origin -->
<section
  id="same-origin-cross-origin"
  aria-labelledby="same-origin-cross-origin"
  data-item="Same- and Cross-Origin"
>
  <h2><a href="#same-origin-cross-origin">Same-Origin and Cross-Origin Requests</a></h2>



So an important question is: **What is the simplest way to connect to your server from a potentially *untrustworthy* origin?**. In technical terms: how do you make a _cross-origin request_?

The quickest way to do this is to visit a site (any site) and make a request from your browser _Console_ rather than from the address bar. This will make the browser send the request _as if it came from the site that is currently displayed_.

Before sending a _cross_-origin request, you might want to see how this process will work for a _same_-origin request.

1.   In your browser, visit [http://localhost:3000/headers](http://localhost:3000/headers). You should see in your browser the same details that are given in Listing 5 above.
2.   Open the Developer Console in your browser and paste in the following code:

```javascript-w
options = {"method": 'GET', "Content-Type": 'application/json'};
fetch('http://localhost:3000/headers', options)
.then(res => res.text())
.then(text => console.log(text))
.catch(error => console.log("Error", error))
```
<small style="color:orange">Listing 6</small>  

<details class="note" open>
<summary>Promises?</summary>
If you understand this code, and the way it uses [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise), great! If not, you can just think of it as a black box that does something useful for you, and you can learn about how it works later.

The one important point to note is the use of the `GET` method, as this will come up again later.

</details>

3.  Press the Enter key.

The code that you pasted requests the exact same page from the same server as the page you are visiting. Your browser will understand this, and send the appropriate headers. As a result, you should see something like this (complete with the `<pre>` and `</pre>` tags):

```md-w
<i><pre>
{
  "host": "localhost:3000",
  "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:122.0) Gecko/20100101 Firefox/122.0",
  "accept": "*/*",
  "accept-language": "en-GB,en;q=0.7,en-US;q=0.3",
  "accept-encoding": "gzip, deflate, br",
  </i><b>"referer": "http://localhost:3000/headers",</b></i>
  "dnt": "1",
  "sec-gpc": "1",
  "connection": "keep-alive",
  </i><b>"sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin"</b></i>
}
</pre></i>
```

<small style="color:orange">Listing 7</small>


### What's new?

* There is an entry for `"referer"`, which shows the page that was open when you sent the request: [http://localhost:3000/headers](http://localhost:3000/headers).

_And, yes: `referer` is a spelling mistake. This mistake was made in the original specifications, so it has become part of the standard. That's the way it is now. You may be familiar with the [`noreferrer` HTML attribute]([Attributes](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/noreferrer)) or the [`Referrer-Policy` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Referrer-Policy). This is spelt correctly._

Also there are three new properties whose names begin with "sec-fetch-":

* "[sec-fetch-dest](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest)": "empty",
* "[sec-fetch-mode](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Mode)": "cors",
* "[sec-fetch-site](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Site)": "same-origin"

You can follow the links for the different properties to find an explanation of what they mean and what they do.

But there is still no `origin` property.

This test shows that your browser will tell the server which page made the request, and whether this page has the `same-origin` as the data that is being requested.

</section>