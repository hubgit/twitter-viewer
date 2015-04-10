Polymer({
  q: '',
  loading: false,
  nextResults: null,
  refreshURL: null,
  qChanged: function() {
      if (this.q) {
          this.params = { q: this.q };
          this.items = [];
          this.fetch();
      }
  },
  fetch: function() {
    this.loading = true;
    this.$.fetch.go();
  },
  handleResponse: function(event, details) {
    var response = details.response;

    var refreshing = !this.loading;
    this.loading = false;

    if (!response.statuses) {
      return;
    }

    if (refreshing) {
      response.statuses.reverse();
    }

    response.statuses.forEach(function(status) {
      if (refreshing) {
        this.items.unshift(status);
      } else {
        this.items.push(status);
      }
    }.bind(this));

    if (refreshing || !this.refreshURL) {
      this.refreshURL = response.search_metadata.refreshURL;

      if (this.refreshURL) {
        window.setTimeout(this.refresh.bind(this), 60000);
      }
    }

    if (!refreshing) {
      this.nextResults = response.search_metadata.next_results;
    }
  },
  loadMore: function(event) {
    event.preventDefault();
    this.loading = true;
    this.params = (new URL('http://example.com/' + this.nextResults)).params();
    this.nextResults = false;
    this.fetch();
  },
  refresh: function() {
    this.params = (new URL('http://example.com/' + this.refreshURL)).params();
    this.refreshURL = false;
    this.fetch();
  }
});
