app.views.map = Backbone.View.extend({
  initialize: function(options) {
    this.render(options);
    this.initMap(options);
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
        self.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        self.addMarker(data);
      }
    });
  },
  addMarker: function(data) {
    var self = this;
    var title = data.query;
    var image = "map-marker.png";
    var latlng = {lat: data.lat, lng: data.lon};
    var bounds = new google.maps.LatLngBounds();
    var contentString = "<div class='info-window'><h4>"+data.city+", "+data.regionName+"</h4><p>("+data.lat+ ", "+data.lon+")</p></div>";
    var infowindow = new google.maps.InfoWindow({
      content: contentString
    });
    var marker = new google.maps.Marker({
      position: latlng,
      map: this.map,
      title: title,
      icon: image
    });
    marker.addListener("click", function() {
      infowindow.open(self.map, marker);
    });
    // readjust the map whenever a new marker is added
    app.markerList.push(marker);
    for(let i = 0; i < app.markerList.length; i++) {
      bounds.extend(app.markerList[i].getPosition());
    }
    this.map.fitBounds(bounds);
    // readjust the zoom level
    google.maps.event.addListenerOnce(this.map, "bounds_changed", function() {
      if(this.getZoom() > 12) this.setZoom(12);
    });
  }
});
