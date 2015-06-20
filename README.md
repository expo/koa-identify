# koa-identify

Koa middleware that uses two cookies to uniquely identify a browser and a browser session

## Using `koa-identify`

When you use this middleware, two cookies will be created on each browser client.

* `this.browserId`: a 32 character base64 string prefixed with `b:`. This is stored in a browser cookie that identifies that browser until the browser's cookies are cleared

* `this.sessionId`: a 32 character base64 string prefixed with `s:`. This is stored in a session cookie that identifies the browser until the session is over

When a browser or session is seen for the first time and the cookie is set, `this.browserIdCreated` and/or `this.sessionIdCreated` will be set to true.

## Example

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

## Options

You can optionally pass an object of options in your `app.use` call.

Ex:
`app.use(identify(app, {session: {name: 'custom-session-cookie-name'}, secure: true, {browser: {httpOnly: false}))`

The defaults are almost always good unless your site is using https all the time in which case you may want to set the `{secure: true}` option for extra security.


