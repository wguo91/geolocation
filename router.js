$(function() {
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
      var that = this;
    	$.ajax({
    		type : 'GET',
    		url : 'http://ip-api.com/json/',
    		success : function(response){
    			that.updateLocationDetails(response);
    		}
    	});
    },
    getHostLocation: function() {
    	var hostName = $("#inputHost").val();
      var that = this;
    	$.ajax({
    		type: 'GET',
    		url: 'http://ip-api.com/json/' + hostName,
    		success: function(response) {
    			that.updateLocationDetails(response);
          //that.updateMap(response);
          var map = new MapView({
            lat: response.lat,
            lng: response.lon
          });
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
    }
  })
  var WebsiteView = Backbone.View.extend({

  });
  var MapView = Backbone.View.extend({
    el: $("#googleMapContainer"),
    initialize: function(options) {
      this.render();
      this.initMap(options.lat, options.lng);
    },
    render: function() {
      window.mapTemplate = $("#googleMap").html();
      window.mapTemplate = Handlebars.compile(window.mapTemplate);
      $("#googleMapContainer").html(window.mapTemplate({
        domain: "www.google.com"
      }));
    },
    initMap: function(lat, lng) {
      // ajax call for Google Maps API
      var apiKey = "AIzaSyAYsmtpDT3F5RHZ7Xb866QW9wi-H097wcw";
      var url = "https://maps.googleapis.com/maps/api/js?key=" + apiKey;
      $.ajax({
        url: url,
        dataType: "script",
        async: false,
        success: function() {
          // set up Google Maps
          var latlng = new google.maps.LatLng(lat, lng);
          var mapOptions = {
            zoom: 10,
            center: latlng
          };
          var map = new google.maps.Map(document.getElementById("map"), mapOptions);
          var marker = new google.maps.Marker({
            position: latlng,
            map: map
          });
        }
      });
      // var infoWindow = new google.maps.InfoWindow({map: map});
      // if(navigator.geolocation) {
      //   navigator.geolocation.getCurrentPosition(function(position) {
      //     var pos = {
      //       lat: position.coords.latitude,
      //       lng: position.coords.longitude
      //     };
      //     infoWindow.setPosition(pos);
      //     infoWindow.setContent('Location found.');
      //     map.setCenter(pos);
      //   }, function() {
      //     handleLocationError(true, infoWindow, map.getCenter());
      //   });
      // } else {
      //   handleLocationError(false, infoWindow, map.getCenter());
      // }
      // function handleLocationError(browserHasGeolocation, infoWindow, pos) {
      //   infoWindow.setPosition(pos);
      //   infoWindow.setContent(browserHasGeolocation ?
      //                         'Error: The Geolocation service failed.' :
      //                         'Error: Your browser doesn\'t support geolocation.');
      // }
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
