# koa-identify

Koa middleware that uses two cookies to uniquely identify a browser and a browser session

When you use this middleware, two cookies will be created on each browser client.

* `this.browserId`: a 32 character base64 string prefixed with `b:`. This is stored in a browser cookie that identifies that browser until the browser's cookies are cleared

* `this.sessionId`: a 32 character base64 string prefixed with `s:`. This is stored in a session cookie that identifies the browser until the session is over

When a browser or session is seen for the first time and the cookie is set, `this.browserIdCreated` and/or `this.sessionIdCreated` will be set to true.

Here is an example of how to use this middleware:
```js

var koa = require('koa');
var identify = require('koa-identify');

var app = koa();

app.use(identify(app));

app.use(function *(){

  this.body = "koa-identify test\n";
  this.body += "browserId=" + this.browserId + "\n";
  this.body += "sessionId=" + this.sessionId + "\n";
  
  if (this.sessionIdCreated) {
    console.log("sessionIdCreated");
  }
  
  if (this.browserIdCreated) {
    console.log("browserIdCreated");
  }
  
});

app.listen(4000);
console.log("Listening on port 4000");

```

