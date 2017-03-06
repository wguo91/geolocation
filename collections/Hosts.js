app.collections.Hosts = Backbone.Collection.extend({
  model: app.models.Host,
  // use local storage to store data
  localStorage: new Backbone.LocalStorage("hosts-backbone"),
  initialize: function() {
    this.fetch();
    this.listenTo(this, "add", function() {
      console.log("triggered add");
    });
    this.listenTo(this, "remove", this.displayChange);
  },
  clearHosts: function() {
    this.localStorage._clear();
    this.remove(this.filter(function(model) {
      return !model.isUserLocation;
    }))
    app.hostsView.render();
  },
  comparator: function(model) {
    return -model.get("date");
  }
});
