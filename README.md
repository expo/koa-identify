# koa-identify

Koa middleware that uses two cookies to uniquely identify a browser and a browser session

## Using `koa-identify`

When you use this middleware, two cookies will be created on each browser client.

* `this.browserId`: a 32 character base64 string prefixed with `b-`. This is stored in a browser cookie that identifies that browser until the browser's cookies are cleared

* `this.sessionId`: a 32 character base64 string prefixed with `s-`. This is stored in a session cookie that identifies the browser until the session is over

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

This will generate a webpage that looks something like:
```text
koa-identify test
browserId=b:U4QQ/UuSPxzep9eXNPwmRkWUU0sWe2MO
sessionId=s:U4QRA6H8o/3dBbBVxEwFIKXjVd0cf6Rf
```

If you quit your browser and reopen the page again, the `sessionId` will
change, but the `browserId` will remain constant until you clear your
cookies.

## Options

You can optionally pass an object of options in your `app.use` call.

The default options are suitable for almost all uses and so you shouldn't
normally need to use these.

Options passed in objects under the `session` and `browser` keys will
be just used for the session or browser cookies respectively. All other
options given will be used for both.

Ex:
```js
app.use(identify(app, {
    session: {
        name: 'custom-session-cookie-name',
    },
    secure: true, 
    browser: {
        httpOnly: false, // not advised but possible!
    },
}));
```

#### Available Options
* `secure`: Only send these cookies over https. Provides extra security if your site is entirely served over https (or if, at least, everything you want to
authenticate is), but will break your site if you're just using http. Defaults to `false`.
* `httpOnly`: Make these only accessible via http, i.e. not from client side
JavaScript. This provides some protection against XSS attacks. Unless you
really know what you're doing, you should just leave this as `true`. Defaults
to `true`.
* `expires`: A `Date` describing when the cookie should expire. You should just leave these as the default unless you have a very good reason to change them.
* `generateIdentifer`: A function that generates a new identifier. The default, describe below, should be fine for most cases.

##### Only valid under `session` and `browser`
* `name`: The name of the cookie used. Defaults to `ks` for session and `kb` for browser.
* `prefix`: The prefix used for the cookie value. Defaults to `s-` for session and `b-` for browser.

## Etc.

#### Identifiers
Identifiers are created with the `crypto.randomBytes` method plus an encoding of the current time from the server setting the cookies.

#### Explicitly setting the browser or session

If you really want to do this for some reason, just set the cookie using `this.cookies.set` before this middleware runs.

In the future, a setter may be provided, but in general, its best to let this library take care of that for you.

