Polymer({
  q: '',
  loading: false,
  nextResults: null,
  refreshURL: null,
  qChanged: function() {
      if (this.q) {
          this.params = { q: this.q };
          this.items = [];
          this.loading = true;
          this.$['fetch-older'].go();
      }
  },
  handleOlderResponse: function(event, details) {
    var response = details.response;

    this.loading = false;

    if (response.statuses) {
      var items = this.items;

      response.statuses.forEach(function(status) {
        items.push(status);
      });

      this.nextResults = response.search_metadata.next_results;

      if (!this.refreshURL) {
        this.refreshURL = response.search_metadata.refresh_url;
        window.setTimeout(this.loadNewer.bind(this), 60000);
      }
    }
  },
  handleNewerResponse: function(event, details) {
    var response = details.response;

    if (response.statuses) {
      var items = this.items;

      response.statuses.reverse();

      response.statuses.forEach(function(status) {
        items.unshift(status);
      });

      this.refreshURL = response.search_metadata.refresh_url;
    }

    if (this.refreshURL) {
      window.setTimeout(this.loadNewer.bind(this), 60000);
    }
  },
  loadOlder: function(event) {
    event.preventDefault();
    this.loading = true;
    this.params = (new URL('http://example.com/' + this.nextResults)).params();
    this.nextResults = false;
    this.loading = true;
    this.$['fetch-older'].go();
  },
  loadNewer: function() {
    this.params = (new URL('http://example.com/' + this.refreshURL)).params();
    this.$['fetch-newer'].go();
  }
});
