var _ = require('lodash-node');
var crypto = require('crypto');

var A_THOUSAND_YEARS_FROM_NOW = new Date(33000000000000); // (approximately...)

var POW10 = Math.pow(2, 10); // 2 ^ 10
var POW26 = Math.pow(2, 26); // 2 ^ 26

function _newIdentifier(len) {
  len = len || 24;

  var b = crypto.randomBytes(len);

  // This bit inspired by https://github.com/T-PWK/flake-idgen
  var now = Date.now();
  b.writeUInt8(Math.floor(now / 4) & 0xFF, 4);
  b.writeUInt16BE(Math.floor(now / POW10) & 0xFFFF, 2);
  b.writeUInt16BE(Math.floor(now / POW26) & 0xFFFF, 0);

  return b.toString('base64');

}

module.exports = function (opts) {
  opts = opts || {};

  var sharedDefaults = {
    overwrite: true,
    httpOnly: true,
    generateIdentifer: _newIdentifier,
  };

  var sessionCookieOpts = _.assign({
    name: 'ks',
    prefix: 's-',
  }, sharedDefaults, opts, opts.session);

  var browserCookieOpts = _.assign({
    name: 'kb',
    expires: A_THOUSAND_YEARS_FROM_NOW,
    prefix: 'b-',
  }, sharedDefaults, opts, opts.browser);

  return function* (next) {
    var ks = this.cookies.get(sessionCookieOpts.name);
    this.charlie = true;
    if (!ks) {
      this.broad = true;
      ks = sessionCookieOpts.prefix + _newIdentifier();
      this.sessionIdCreated = true;
      this.cookies.set(sessionCookieOpts.name, ks, sessionCookieOpts);
    }
    this.sessionId = ks;

    var kb = this.cookies.get(browserCookieOpts.name);
    if (!kb) {
      kb = browserCookieOpts.prefix + _newIdentifier();
      this.browserIdCreated = true;
      this.cookies.set(browserCookieOpts.name, kb, browserCookieOpts);
    }
    this.browserId = kb;

    yield *next;
  };

}

module.exports._newIdentifier = _newIdentifier;
