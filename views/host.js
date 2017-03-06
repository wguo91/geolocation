app.views.host = Backbone.View.extend({
  initialize: function(host) {
    // var handler = _.bind(this.render, this);
    // this.listenTo(this.model, "add", handler);
    // this.listenTo(this.model, "remove", handler);
    console.log("creating new host... in app.views.host");
    var newHost = new app.models.Host(host);
    var self = this;
    this.render(newHost);
    this.listenTo(app.hosts, "add", function() {
      self.render();
    });
    this.listenTo(app.hosts, "remove", function() {
      self.render();
    });
  },
  render: function() {
  }
});
