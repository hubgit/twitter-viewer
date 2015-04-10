Polymer({
  itemChanged: function() {
    this.setRelativeTime();
    window.setInterval(this.setRelativeTime.bind(this), 10000);
  },
  domReady: function() {
    this.wrapEntities();

    // the "text" property of tweets is HTML-escaped
    // need to reverse the double-escaping after linking the entities
    this.unescapeHTML();
  },
  setRelativeTime: function() {
    this.item.created_relative = moment(this.item.created_at).fromNow();

    if (this.item.retweeted_status) {
      this.item.retweeted_status.created_relative = moment(this.item.retweeted_status.created_at).fromNow();
    }
  },
  unescapeHTML: function() {
    var node = this.shadowRoot.querySelector('#text');

    node.innerHTML = node.innerHTML.replace(/&amp;(amp|gt|lt);/g, '&$1;');
  },
  wrapEntities: function() {
    var node = this.shadowRoot.querySelector('#text').firstChild;
    var entities = this.item.retweeted_status ? this.item.retweeted_status.entities : this.item.entities;

    var items = [];

    if (entities.urls) {
      entities.urls.forEach(function(entity) {
        items.push(entity);
      });
    }

    if (entities.media) {
      entities.media.forEach(function(entity) {
        items.push(entity);
      });
    }

    items.sort(function(a, b) {
      return b.indices[0] - a.indices[0];
    });

    items.forEach(function(entity) {
      this.replaceWithLink(node, entity.indices[0], entity.indices[1], entity.expanded_url, entity.display_url);
    }.bind(this));
  },
  replaceWithLink: function(node, startOffset, endOffset, url, text) {
    var link = document.createElement('a');
    link.href = url;
    link.textContent = text;
    link.setAttribute('target', '_blank');

    var range = document.createRange();
    range.setStart(node, startOffset);
    range.setEnd(node, endOffset);
    range.deleteContents();
    range.insertNode(link);
  }
});
