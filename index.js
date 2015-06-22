var _ = require('lodash-node');
var slugid = require('slugid');

var A_THOUSAND_YEARS_FROM_NOW = new Date(33000000000000); // (approximately...)

function _newIdentifier() {
  return slugid.v4();
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
