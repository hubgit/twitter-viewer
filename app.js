function App(){
  var self = this,
    re,
    perPage = 100,
    refreshRate = 30000,
    noMoreTweets = false,
    newElements = [],
    filters = [
      //"\\bRT\\b",
      //"/ff\\.im/"
    ];

  this.init = function(){
    $.ajaxSetup({ cache: false });
    filters = $.map(filters, function(value, key){ return new RegExp(value); });

    var matches = location.search.match(/\?q=(\w+)/);
    if (matches) {
    	var query = matches[1];
    	$("#search-form input[name=q]").val(query);
    	self.twitterSearch("?q=" + encodeURIComponent(query), { initial: true, more: true } );
    	$("#more").click(self.loadMore);
    } else {
      $("#initial").hide();
    }
  };

  this.twitterSearch = function(params, options){
    $.ajax({
      url: "http://www.macropus.org/twitter/" + params,
      success: function(data) {
        $("#initial").remove();

        if (options["update"] || options["initial"])
          window.setTimeout(self.updateSearch, refreshRate, data["refresh_url"]);

        if (!data["statuses"]) return false;

        if (options["more"]){
          $("#more").css("display", "block");

          if (data["search_metadata"]["next_results"]){
            $("#more")
              .data("next_results", data["search_metadata"]["next_results"])
              .html("more&hellip;")
              .unbind("inview")
              .bind("inview", self.loadMore);
          } else {
            noMoreTweets = true;
            $("#more").html("no more");
          }
        }

        newElements = [];
        $.each(data["statuses"], self.showTwitterItem);

        if (options["update"])
            $(newElements).prependTo("#items");
        else
            $(newElements).appendTo("#items");

        $(".created", newElements).timeago();

        $(".new").removeClass("new");
        if (!options["more"])
          $(newElements).addClass("new");
      }
    });
  };

  this.showTwitterItem = function(i, data){
    //if (data.retweeted_status) {
    //  return;
    //}

    for (var i in filters)
      if (data["text"].match(filters[i]))
        return;

    data["text"] = self.prepareTweet(data["text"]);
    console.log(data);

    var item = $("#item-template").tmpl(data);
    newElements.push(item[0]);
  };

  // from https://github.com/elektronaut/jquery.livetwitter
  this.prepareTweet = function(text){
    return text.replace(/[A-Za-z]+:\/\/[A-Za-z0-9-_]+\.[A-Za-z0-9-_:%&\?\/.=]+/g, function(match){
      return self.link(match, match);
    })
    .replace(/@([A-Za-z0-9_]+)/g, function (match, name) {
      return self.link(match, "http://twitter.com/" + name);
    })
    .replace(/#([A-Za-z0-9_\-]+)/g, function (match, name) {
      return self.link(match, "http://search.twitter.com/search?q=%23" + name);
    });
  };

  this.link = function(text, url){
    var a = $("<a target='_blank'/>").attr("href", url).text(text);
    return $("<div/>").append(a.clone()).html();
  };

  this.loadMore = function(e, isInView, visiblePartX, visiblePartY){
    if (!isInView)
      return false;

    if (noMoreTweets)
      return false;

    var more = $("#more");
    more.html("loading more&hellip;");

    self.twitterSearch(more.data("next_results"), { more: true });

    return false;
  };

  this.updateSearch = function(url){
    self.twitterSearch(url, {}, { update: true });
  };
}

var app = new App;
$(app.init);
