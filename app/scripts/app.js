(function (document) {
  'use strict';

  URL.prototype.params = function() {
    var params = {};

    this.search.substring(1).replace(/\+/g, ' ').split('&').forEach(function(v) {
        var parts = v.split('=');
        var key = decodeURIComponent(parts[0]);
        var val = decodeURIComponent(parts[1]);

        params[key] = val;
    });

    return params;
  };

  var params = (new URL(document.location)).params();

  if (params.q) {
    document.getElementById('q').value = params.q;
    document.querySelector('tweet-collection').setAttribute('q', params.q);
  }

// wrap document so it plays nice with other libraries
// http://www.polymer-project.org/platform/shadow-dom.html#wrappers
})(wrap(document));
