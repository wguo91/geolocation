app.views.hosts = Backbone.View.extend({
  el: $("#hostsContainer"),
  hostsArray: [],
  initialize: function() {
    app.hosts.fetch();
    app.hosts.toJSON();
    var self = this;
    // render a new host view every time a host is added or removed
    this.listenTo(app.hosts, "add", function(host) {
      console.log("triggered add in hosts.js");

      this.render();
    });
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
  renderHost: function(host) {
    // var hostView = new app.views.host(host);
  },
  insertHost: function(response) {
    console.log(response);
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
  }
});
