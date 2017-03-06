var app = (function() {
  var api = {
    views: {},
    models: {},
    collections: {},
    hosts: null,
    markerList: [],
    createIndexView: function() {
      if(!this.indexView) {
        this.indexView = new api.views.index({
          el: $("#mainContent")
        });
      }
      return this.indexView;
    },
    createMapView: function(response) {
      if(!this.mapView) {
        this.mapView = new api.views.map(response);
      } else {
        this.mapView.addMarker(response);
      }
      return this.mapView;
    },
    init: function() {
      this.indexView = this.createIndexView();
      this.hosts = new api.collections.Hosts();
      if(!this.hostsView) {
        this.hostsView = new api.views.hosts({
          model: api.models.Host,
          el: $("#hostsContainer")
        });
      }
      return this;
    }
  };
  return api;
})();
window.onload = function() {
  app.init();
}
