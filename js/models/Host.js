app.models.Host = Backbone.Model.extend({
  defaults: {
    date: Date.now(),
    query: "0.0.0.0",
    country: "",
    regionName: "",
    city: "",
    timezone: "",
    lat: "",
    lon: "",
    isUserLocation: false
  }
});
