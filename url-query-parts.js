URL.prototype.params = function() {
  var params = {};

  this.search.substring(1).replace(/\+/g, ' ').split('&').forEach(function(v) {
      var parts = v.split('=');
      var key = decodeURIComponent(parts[0]);
      var val = decodeURIComponent(parts[1]);

      params[key] = val;
  });

  return params;
}