app.views.index = Backbone.View.extend({
  events: {
    "click #btnMyLocation": "getMyLocation",
    "click #btnResetLocation": "resetLocationDetails",
    "click #btnHostLocation": "getHostLocation"
  },
  initialize: function() {
    this.render();
  },
  render: function() {
    window.indexTemplate = $('#index').html();
  	window.locationTemplate = $('#locationInfo').html();
  	window.indexTemplate = Handlebars.compile(window.indexTemplate);
  	window.locationTemplate = Handlebars.compile(window.locationTemplate);
  	$("#mainContent").html(window.indexTemplate());
  	$("#geoLocationContainer").html(window.locationTemplate({
  		id: 0,
  		query: "0.0.0.0",
  		country: "",
  		regionName: "",
  		city: "",
  		timezone: "",
  		lat: "",
  		lon: ""
  	}));
  },
  updateLocationDetails: function(data) {
  	var now = new Date();
  	$("#location_query").html(data.query);
  	$("#location_country").html(data.country);
  	$("#location_regionName").html(data.regionName);
  	$("#location_city").html(data.city);
  	$("#location_timezone").html(data.timezone);
  	$("#location_lat").html(data.lat);
  	$("#location_lon").html(data.lon);

  	$("table").removeClass("empty");
  	$(".help").click(function(e){
  		var fieldName = $(e.currentTarget).closest('tr').find('.field_name').text();
  		alert("This is your " + fieldName + " from ISP " + data.isp + " at " + now);
  	});
  },
  getMyLocation: function() {
    var self = this;
  	$.ajax({
  		type : 'GET',
  		url : 'http://ip-api.com/json/',
  		success : function(response) {
        // used to indicate whether or not to reset this marker
        response.isUserLocation = true;
        // create the map view and update location
        var mapView = app.createMapView(response);
  			self.updateLocationDetails(response);
  		}
  	});
  },
  getHostLocation: function() {
  	var hostName = $("#inputHost").val();
    var self = this;
    var regex = new RegExp(/^(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,4}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$/g);
    // validation for host input
    if(!hostName.match(regex)) {
      $(".error").removeClass("hidden");
    } else {
      $(".error").addClass("hidden");
      $.ajax({
        type: 'GET',
        url: 'http://ip-api.com/json/' + hostName,
        success: function(response) {
          // used to indicate whether or not to reset this marker
          response.isUserLocation = false;
          // create the map view, insert host into history, and update location
          var mapView = app.createMapView(response);
          app.hostsView.insertHost(response);
          self.updateLocationDetails(response);
        }
      });
    }
  },
  resetLocationDetails: function() {
    // reset the view
  	this.updateLocationDetails({
  		query: "0.0.0.0",
  		country: "",
  		regionName: "",
  		city: "",
  		timezone: "",
  		lat: "",
  		lon: ""
  	});
  	$("table").addClass("empty");
    // reset the website collection by removing the user location
    app.hosts.clearHosts();
  }
});
