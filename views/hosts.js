app.views.hosts = Backbone.View.extend({
  events: {
    "click .hostList": "displayInfo"
  },
  initialize: function() {
    app.hosts.fetch();
    // re-render the hosts collection view every time a host is added or removed
    this.listenTo(app.hosts, "add", this.render);
    this.listenTo(app.hosts, "remove", this.render);
    this.render();
  },
  render: function() {
    // render a host view for each host in the hosts collection
    window.hostsTemplate = $("#hostInfo").html();
    window.hostsTemplate = Handlebars.compile(window.hostsTemplate);
    $("#hostsContainer").html(window.hostsTemplate({
      hosts: app.hosts.models
    }));
  },
  insertHost: function(response) {
    var newHost = new app.models.Host({
      date: Date.now(),
      query: response.query,
      country: response.country,
      regionName: response.regionName,
      city: response.city,
      timezone: response.timezone,
      lat: response.lat,
      lon: response.lon,
      isUserLocation: false
    });
    // add newHost to collection
    app.hosts.add(newHost);
    newHost.save();
  },
  displayInfo: function(evt) {
    // find the closest li
    var li = $(evt.target).closest("li");
    var ul = li.closest("ul");
    var idx, json;
    for(var i = 0; i < ul.children().length; i++) {
      // save the index of the li
      if(ul.children().eq(i).attr("id") === li.attr("id")) {
        idx = i;
      }
    }
    // display information about the clicked host
    json = app.hosts.models[idx].toJSON();
    app.indexView.updateLocationDetails(json);
  }
});
