<!-- What CORS Does -->
<section
  id="what-cors-does"
  aria-labelledby="what-cors-does"
  data-item="What CORS Does"
>
  <h2><a href="#what-cors-does">Discovering what the `cors` Node module does</a></h2>
  

There are easier ways of using the `cors` module than the code I have used here, but this technique allows you to look under the hood at what the module is actually doing.

### Using the Debugger

<details class="env" open>
<summary>Debugging with VS Code</summary>
If you are using [Visual Studio Code](https://code.visualstudio.com/download) as your code editor, you can follow the exact steps I give below. If you are familiar with using the debugger in a different environment, you may have to adjust the steps to suit.

If you are not using VS Code and the whole concept of debugging a script alarms you, no worries. You can just follow along by reading the chunks of `cors` code that I give below.

</details>

Before you can use the debugger to inspect the code used by your server app, you will need to stop the server.

1.   Click on the Terminal where your ran `npm start` earlier to give it keyboard focus, and then type `Ctrl-C` to stop the server. You should see `^C` on one line and the white insertion caret on the next, indicating that the Terminal is currently not doing anything.

![Stop the server](images/stopServer.png)

1. In VS Code, open the `app.js` file and click just to the left of the line number for the line `callback(null, true)`. A red dot should appear to indicate that you have set a debugger breakpoint.
2. Open the Debug Console pane in place of the Terminal pane
3.  Select Run > Start Debugging (or press the `F5`‡ key on your keyboard)

<details class="note" open>
<summary>F5 ‡ </summary>
Depending on how your keyboard is set up, you may need to press the `fn` key at the same time as you press `F5`. If so, you will need to press `fn` at the same time as you press any of the `F` keys in the instructions below.

</details>

The composite image below illustrates these steps:

![Debug CORS callback](images/startDebugger.png)

4. In the Developer Console in your browser, press the Up arrow and then the Enter key, to send the last command again.

The VS Code window should now be brought to the front. As in Figure 4 below, you should see that:

* There is a little yellow arrow around the red debugger breakpoint that you set in step 25. This indicates that this line has not yet been executed.
* The line `callback (null, true)` is highlighted.
* The Debug Console shows a new line: <code style="color: #19F">origin: http://localhost:3000</code>, because the line `console.log("origin:", origin)` has just been executed.
* The Control Panel for the debugger has been updated. It now shows active arrow buttons for Continue, Step Over, Step Into and Step Out.

![Step Into the code for the `cors` module](images/stepInto.png)

5. Click on the Step Into button (or press `F11`).
  
This will take you into the code of the `cors` module, where you can follow step-by-step what `cors` does.

<details class="tip" open>
<summary>Following without a debugger</summary>
If you are simply reading this article without following the debugging steps, you can open `backend/node_modules/cors/lib/index.js` and look for the code that is shown below. 

</details>

![Inside the `corsMiddleware` function](images/middleware.png)


On the left, of the VS Code window, you will see a panel that shows the value of the variables that are available in the current scope. Specifically, in the "Local" section at the top, you can see that a custom `err2` variable has the value `null` and the variable `origin` has the value `true`. This is the value that you gave to the second argument of the call to `callback` in your `app.js` file.

You can click on the disclosure arrow for the first "Closure" entry to see the value of the `corOptions` object. You created this object in the `app.js` file, and gave it a property called `origin` whose value is a function. Here you can seen that function displayed.

Since then, the `cors` module has been busy adding other properties (like `err2`). The call you made from the browser Console explicitly used the method `GET`, which is one of the methods that the `corsOptions` object lists in its `methods` property. You'll see in a moment why this matters.

### Calling `cors`

The expression `err2 || !origin` is falsy, so the following lines will be executed:

```js-#233
corsOptions.origin = origin;
cors(corsOptions, req, res, next);
```
<small style="color:orange">Listing 12</small>

6. Get ready to press the Step Into button in the Control panel again, and focus your attention on the value of `corsOptions.origin` in the Variables pane.
7. Press the Step Into button.

Did you see that the value of `corsOptions.origin` changes? It changes from being the function that you created to the result of the callback used by that function: `corsOptions.origin` becomes `true`.

8. Press the Step Into button again. The debugger will step into the `cors()` function.

![Inside the `cors()` function](images/corsFunction.png)  

The `corsOptions` object is passed as an `options` variable, so its name has changed but its content is still the same. The `req` and `res` objects that were available to your code in the `app.js` script are also available here.

The `cors()` function:

* Creates an empty array called `headers`
* Reads in the value of `method` from the `req` object and converts it to uppercase. This will be the value `GET` that you set in your call from the browser console, so it was already uppercase.
* Sees that `method` is not `"OPTIONS"`, so it jumps over the first part of the `if ... else` statement, and next it runs the command:

```javascript-#184
headers.push(configureOrigin(options, req));
```
<small style="color:orange">Listing 13</small>

9. Press the Step Into button four more times, so that the debugger steps into the `configureOrigin()` function.

### The `configureOrigin()` function

The `configureOrigin()` function is where `cors` decides whether to accept the request or not. It looks at both the value of `req.headers.origin` and the value for `options.origin`.

In the current case, `req.headers.origin` is `"http://localhost:3000"`, because that's the hostname for the page from which you made the request, and `options.origin` is `true`, because that is the value you gave in the second argument to `callback(null, true)`.

Here's the function for `cors@2.8.5` in full: 

```javascript-#36
function configureOrigin(options, req) {
    var requestOrigin = req.headers.origin,
      headers = [],
      isAllowed;

    if (!options.origin || options.origin === '*') {
      // allow any origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: '*'
      }]);
    } else if (isString(options.origin)) {
      // fixed origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: options.origin
      }]);
      headers.push([{
        key: 'Vary',
        value: 'Origin'
      }]);
    } else {
      isAllowed = isOriginAllowed(requestOrigin, options.origin);
      // reflect origin
      headers.push([{
        key: 'Access-Control-Allow-Origin',
        value: isAllowed ? requestOrigin : false
      }]);
      headers.push([{
        key: 'Vary',
        value: 'Origin'
      }]);
    }

    return headers;
  }
  ```
<small style="color:orange">Listing 14</small>

The case for treating `options.origin` when it is `true` is right at the end, so this gives you the chance to review what other values `options.origin` could have.

The [documentation for Express](https://expressjs.com/en/resources/middleware/cors.html#configuration-options) indicates that `origin` can have a variety of different types:

* Boolean
* String
* RegExp
* Array of String or RegExp items
OR
* a function like the one you provided in `app.js` that eventually sets `origin` to one of the four types listed above.

The `configureOrigin()` function considers these types one by one.

### `options.origin` is `false` or `"*"`

```javascript-#41
if (!options.origin || options.origin === '*') {
  // allow any origin
  headers.push([{
    key: 'Access-Control-Allow-Origin',
    value: '*'
  }]);
}
```
<small style="color:orange">Listing 15</small>


<details class="tldr">
<summary>Glitch?</summary>
In practice, it seems impossible to get to this point in the code when `options.origin` is falsy (`false`, `undefined`, `0`, `null` or `""`). If you call `cors()` with no arguments, the `cors` script will use the default value of `"*"` for `origin`.

Look for the line `var corsOptions = assign({}, defaults, options)`, which ensures that if `options` gives no value for `origin` then the value will be provided by ...
```javascript-#8
var defaults = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 204
};
  ```
If you use `{ origin: false }`, then the expression highlighted in Figure 5 will evaluate to true, and the whole process that you have just stepped through will be skipped.

</details>

The key point to notice here is that if the `origin` is to be allowed, an object with the `key` `'Access-Control-Allow-Origin'` will be added to the `headers` array, together with a `value` that represents the permitted origin.

### `options.origin` is a String

```javascript-#47
else if (isString(options.origin)) {
  // fixed origin
  headers.push([{
    key: 'Access-Control-Allow-Origin',
    value: options.origin
  }]);
  headers.push([{
    key: 'Vary',
    value: 'Origin'
  }]);
}
```
<small style="color:orange">Listing 16</small>

If you had provide a string as the value for `options.origin` in your `app.js` script, then the value for `'Access-Control-Allow-Origin'` would now be set to that specific string. A [`Vary` header](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Vary) is also set to tell the browser that the value of `Origin` had an effect on the response that the server returns.

### `options.origin` is a RegExp, an array or some other value

In the current case, `options.origin` is `true`, so none of the expressions in the `if ... else` statement that deal with strings evaluate to true. As a result, the final part of the `if ... else` statement applies.

```javascript-#57
else {
  isAllowed = isOriginAllowed(requestOrigin, options.origin);
  // reflect origin
  headers.push([{
    key: 'Access-Control-Allow-Origin',
    value: isAllowed ? requestOrigin : false
  }]);
  headers.push([{
    key: 'Vary',
    value: 'Origin'
  }]);
}
```
<small style="color:orange">Listing 17</small>

10. Press the Step Into button a few more times, so that the debugger steps into the `isOriginAllowed()` function. This receives two arguments:
* `origin`, which was read from `req.headers.origin`
* `allowedOrigin`, which was generated by the object that your `app.js` script applied to `cors()`, and which here is `true`.

```javascript-#19
function isOriginAllowed(origin, allowedOrigin) {
  if (Array.isArray(allowedOrigin)) {
    for (var i = 0; i < allowedOrigin.length; ++i) {
      if (isOriginAllowed(origin, allowedOrigin[i])) {
        return true;
      }
    }
    return false;
  } else if (isString(allowedOrigin)) {
    return origin === allowedOrigin;
  } else if (allowedOrigin instanceof RegExp) {
    return allowedOrigin.test(origin);
  } else {
    return !!allowedOrigin;
  }
}
```
<small style="color:orange">Listing 18</small>

This function return `true` if any one of the following is true:

* `allowedOrigin` is an array and if (by recursion) any of the items in the array matches the `req.headers.origin`.
* `allowedOrigin` is a string. This is only possible if the string were one of the items in an array, and so `isOriginAllowed()` has been called recursively.  
**Note that this is a case _insensitive_ match and `req.headers.origin` is all in lowercase. This means that if you had used `["HTTP://127.0.0.1:3000/"]` instead of `true` in `app.js`, the part of the origin in uppercase would make the match fail.**
* `allowedOrigin` is a Regular Expression that matches `req.headers.origin`
* `allowedOrigin` is any other truthy value.

In the current case, `allowedOrigin` is `true` so `isOriginAllowed()` returns `true`.

11. Press the Step Into button until you reach the line `return !!allowedOrigin;`, which returns the value `true`, and find yourself back in the `configureOrigin()` function.

### Adding `'Access-Control-Allow-Origin'` with the value `true`

Back in `configureOrigin()`, the `'Access-Control-Allow-Origin'` header is given either the value read from `req.headers.origin` or `false`, depending on what `isOriginAllowed()` returned.

```javascript-#60
headers.push([{
  key: 'Access-Control-Allow-Origin',
  value: isAllowed ? requestOrigin : false
}]);
```
<small style="color:orange">Listing 19</small>

In this case, `isAllowed` is `true`, so the `value` associated with `'Access-Control-Allow-Origin'` is the origin of the page that made the request, as you can see in Figure 7 below.

![`headers` returned by `isOriginAllowed()`](images/headers.png)

### Setting the response headers

The `configureOrigin()` function populates an array called `headers` and returns this to the `cors()` function that called it.

12. Press the Step Into button a few more times, to step through the `if` statement in the `configureOrigin()`, until you find yourself back in the `cors()` function.
13. You can press the Step Over button twice, to skip the calls to `configureCredentials()` and `configureExposedHeaders()`, which in this case simply add `null` to the `headers` array.

![Step Over function calls](images/applyHeaders.png)

14.  Press the Step Into button again to see what happens inside the `applyHeaders()` function.

### applyHeaders()

The `applyHeaders()` function accepts two arguments:

* Hhe `headers` array that has just been created
* The `res` object which is also available in your `app.js` script.

It iterates through the header array, and calls itself recursively if it finds a sub-array.

15.  You can press the Step Into button multiple times until you reach the line:
```javascript-#153
res.setHeader(header.key, header.value)
```
<small style="color:orange">Listing 20</small>

The [`setHeader` function](https://nodejs.org/api/http.html#requestsetheadername-value) is part of Node's native `http` module code, so you cannot step into it. You can only use the debugger to step into JavaScript code in your own scripts and in Node modules.

However, you can see the _result_ of the `setHeader` call. To do this, you need set a second breakpoint in your `app.js` script which will be triggered when your app is ready to treat the request itself.

To do this in VS Code:

16.  Activate the Explorer pane
17.  Select the `app.js` script
18.  Scroll to the code shown in Figure 9 below
19.  Click just to the left of the line number where the variable `const message` is declared.

![Add breakpoint](images/addBreakpoint.png)

20. Click on the Continue button in the debugger Control panel, as shown in Figure 10 below.

The debugger will finish executing all the remaining instructions that were triggered by the call to `cors()` and then stop just before executing the next instruction in your `app.js` script.

Node's `http` module does not make `res.headers` object directly accessible. The [`res._headers` has been deprecated since Node version 12](https://nodejs.org/api/deprecations.html#deprecations_dep0066_outgoingmessage_prototype_headers_outgoingmessage_prototype_headernames), so you can't trust it.

The best way to see the value of the `'Access-Control-Allow-Origin'` header is to use the Watch panel of the Debugger pane.

21.   Enter the expression `res.getHeaders()` into the Watch panel of the Debugger pane
22.   Press Enter
23.   Click on the disclosure arrow to show the individual key/value pairs.

Note that the property name is all in lowercase.

![View the `'Access-Control-Allow-Origin'` header](images/viewHeader.png)

You can also get the value of a `res.header` property directly if you know its name.

24.  As in Figure 10 above, enter the expression `res.get("access-control-allow-origin")` in the Watch panel, and press Enter.

</section>