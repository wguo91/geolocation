$(function() {
  var markerList = [];
  // views ----------------------------------------------------------
  var IndexView = Backbone.View.extend({
    el: $("#mainContent"),
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
    events: {
      "click #btnMyLocation": "getMyLocation",
      "click #btnResetLocation": "resetLocationDetails",
      "click #btnHostLocation": "getHostLocation"
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
    		success : function(response){
    			self.updateLocationDetails(response);
          self.updateMap(response);
    		}
    	});
    },
    getHostLocation: function() {
    	var hostName = $("#inputHost").val();
      var self = this;
    	$.ajax({
    		type: 'GET',
    		url: 'http://ip-api.com/json/' + hostName,
    		success: function(response) {
    			self.updateLocationDetails(response);
          self.updateMap(response, hostName);
        }
    	});
    },
    resetLocationDetails: function() {
    	updateLocationDetails({
    		query: "0.0.0.0",
    		country: "",
    		regionName: "",
    		city: "",
    		timezone: "",
    		lat: "",
    		lon: ""
    	});
    	$("table").addClass("empty");
    },
    updateMap: function(response, hostName) {
      // ensure MapView is not created if MapView already exists
      if(!this.mapView) {
        this.mapView = new MapView(response, hostName);
      } else {
        this.mapView.addMarker(response);
      }
    }
  })
  var WebsiteView = Backbone.View.extend({

  });
  var MapView = Backbone.View.extend({
    el: $("#googleMapContainer"),
    initialize: function(options, hostName) {
      this.render(options, hostName);
      this.initMap(options);
    },
    render: function(data, hostName) {
      window.mapTemplate = $("#googleMap").html();
      window.mapTemplate = Handlebars.compile(window.mapTemplate);
      $("#googleMapContainer").html(window.mapTemplate({
        domain: hostName || data.query
      }));
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
      markerList.push(marker);
      for(let i = 0; i < markerList.length; i++) {
        bounds.extend(markerList[i].getPosition());
      }
      this.map.fitBounds(bounds);
      // readjust the zoom level 
      google.maps.event.addListenerOnce(this.map, "bounds_changed", function() {
        if(this.getZoom() > 12) this.setZoom(12);
      });
    }
  });

  // models ----------------------------------------------------------
  var Website = Backbone.Model.extend({
    defaults: {
      query: "0.0.0.0",
  		country: "",
  		regionName: "",
  		city: "",
  		timezone: "",
  		lat: "",
  		lon: ""
    }
  });
  // we can use new Website().toJSON() later...
  // collections ----------------------------------------------------------

  var WebsiteList = Backbone.Collection.extend({
    model: Website,
    // use local storage to store data
    localStorage: new Backbone.LocalStorage("websites-backbone"),
    initialize: function() {
      this.bind("add", function(model) {
        console.log("callback function whenever someone adds a website");
      });
    },
    /*
    nextOrder: function() {
      if(!this.length) return 1;
      return this.last().get("order")+1;
    }
    */
    // sorted by original insertion order
    comparator: "order"
  });
  /*
  WebsiteList.add({
    query: "0.0.0.0",
    country: "",
    regionName: "",
    city: "",
    timezone: "",
    lat: "",
    lon: ""
  })
  */
  var Websites = new WebsiteList;

  // router ----------------------------------------------------------
  var Router = Backbone.Router.extend({
    routes: {
      "": "home",
      "history": "getHistory",
      "details": "getHistoryDeetails"
    }
  });
  var index = new IndexView();

  // instantiate router
  var router = new Router();
  router.on("route:home", function() {
    index.render();
  });
  router.on("route:getHistory", function() {
    console.log("whatever");
  });
  // necessary step for bookmarkable URLs
  Backbone.history.start();
});
