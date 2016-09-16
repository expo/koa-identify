const slugid = require('slugid');

const A_THOUSAND_YEARS_FROM_NOW = new Date(33000000000000); // (approximately...)

function _newIdentifier() {
  return slugid.v4();
}

module.exports = function identify(opts = {}) {
  let sharedDefaults = {
    overwrite: true,
    httpOnly: true,
    generateIdentifer: _newIdentifier,
  };

  let sessionCookieOpts = Object.assign({
    name: 'ks',
    prefix: 's-',
  }, sharedDefaults, opts, opts.session);

  let browserCookieOpts = Object.assign({
    name: 'kb',
    expires: A_THOUSAND_YEARS_FROM_NOW,
    prefix: 'b-',
  }, sharedDefaults, opts, opts.browser);

  return function(ctx, next) {
    let ks = ctx.cookies.get(sessionCookieOpts.name);
    if (!ks) {
      ctx.broad = true;
      ks = sessionCookieOpts.prefix + _newIdentifier();
      ctx.sessionIdCreated = true;
      ctx.cookies.set(sessionCookieOpts.name, ks, sessionCookieOpts);
    }
    ctx.sessionId = ks;

    let kb = ctx.cookies.get(browserCookieOpts.name);
    if (!kb) {
      kb = browserCookieOpts.prefix + _newIdentifier();
      ctx.browserIdCreated = true;
      ctx.cookies.set(browserCookieOpts.name, kb, browserCookieOpts);
    }
    ctx.browserId = kb;

    return next();
  };
}

module.exports.A_THOUSAND_YEARS_FROM_NOW = A_THOUSAND_YEARS_FROM_NOW;
