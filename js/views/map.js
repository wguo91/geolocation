app.views.map = Backbone.View.extend({
  googleMap: null,
  initialize: function(options) {
    this.render(options);
    this.initMap(options);
    this.listenTo(app.hosts, "remove", this.resetMarkers);
  },
  render: function(data) {
    window.mapTemplate = $("#googleMap").html();
    window.mapTemplate = Handlebars.compile(window.mapTemplate);
    $("#googleMapContainer").html(window.mapTemplate);
  },
  initMap: function(data) {
    // ajax call for Google Maps API
    var apiKey = "AIzaSyAYsmtpDT3F5RHZ7Xb866QW9wi-H097wcw";
    var url = "https://maps.googleapis.com/maps/api/js?key=" + apiKey;
    var self = this;
    $.ajax({
      url: url,
      dataType: "script",
      async: false,
      success: function() {
        // initialize google maps with the following options
        var latlng = {lat: data.lat, lng: data.lon};
        var mapOptions = {
          zoom: 12,
          center: latlng
        };
        self.googleMap =
          new google.maps.Map(document.getElementById("map"), mapOptions);
        self.addMarker(data);
      }
    });
  },
  addMarker: function(data) {
    var self = this;
    var title = data.query;
    var imagePath = "/js/views/map-marker.png";
    var latlng = {lat: data.lat, lng: data.lon};
    var bounds = new google.maps.LatLngBounds();
    var contentString = "<div class='info-window'><h4>"+data.query+"</h4><p>"+
      data.city+", "+data.regionName+"</p><p>("+data.lat+ ", "+
      data.lon+")</p></div>";
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    var marker = new google.maps.Marker({
      position: latlng,
      map: this.googleMap,
      title: title,
      icon: imagePath,
      isUserLocation: data.isUserLocation
    });
    marker.addListener("click", function() {
      infowindow.open(self.map, marker);
    });
    app.markerList.push(marker);
    // readjust the map whenever a new marker is added or removed
    for(var i = 0; i < app.markerList.length; i++) {
      bounds.extend(app.markerList[i].getPosition());
    }
    this.googleMap.fitBounds(bounds);
    // readjust the zoom level
    google.maps.event.addListenerOnce(this.googleMap, "bounds_changed", function() {
      if(this.getZoom() > 12) this.setZoom(12);
    });
  },
  resetMarkers: function() {
    // remove markers depending on the value of isUserLocation
    var list = [];
    for(var i = 0; i < app.markerList.length; i++) {
      if(!app.markerList[i].isUserLocation) list.push(app.markerList[i]);
      else app.markerList[i].setMap(null);
    }
    app.markerList = list;
  }
});
