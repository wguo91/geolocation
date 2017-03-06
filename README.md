## How to compile and run the application
This application must be run on a local or remote web server. Clone the
repository into a local directory and open up index.html on a browser.
The project can also be run as a NodeJS application by opening the terminal
in the application home directory and entering in the command "node server.js",
without the quotes. The default port is 3000, unless otherwise specified.

The application has four sections: input form, location, previously searched
hosts, and the map.

The **input form** is the main point of entry for user and
application interaction. The user can obtain IP information about his or her
own location, IP information about a certain host, or reset the information
provided by the user thus far.

The **location** is where information such as the IP, Country, Region,
Latitude, Longitude, etc. will be displayed. The question mark buttons on
the right side serve as user hints.

**Previously searched hosts** is where the user can see all of his or her
previously searched hosts, excluding the user's own domain. The list of
searched hosts is scrollable and is ordered by date of search, with the most
recent listed at the top. The user can click on a particular host
in order to obtain information about the previously searched host. The list
will reset whenever the user clicks the Reset Location button in the input
form.

The **map** section is a Google Map that will place markers every time the
user conducts a search. For example, if the user clicks on the My Location
button in the input form, a marker will be placed at the corresponding
latitude and longitude coordinates on the map. Multiple markers can be placed
on the map, and the map will zoom in and out of the map accordingly so that
all markers will be in view. All markers placed as a result of a host search
will be removed if the user clicks the Reset Location button. If the
user searched his or her own location beforehand, only the user location's
marker will remain.

## Libraries used
This application is structured using Backbone.js, which means the application
has a hard dependency on Underscore and a soft dependency on jQuery. I use  
Grunt.js to minify JS/CSS files and run jshint to run basic code quality tests.
Twitter Bootstrap is used to provide a 12 column grid structure and basic
styling in the form of buttons. However, most of the styling seen elsewhere
is done manually. I decided to use Handlebars as the templating engine.
I decided against using SASS for the application because there were very few
stylesheets overall (excluding Boostrap).

## Additional information
This project was an amazing learning experience mainly because I was able to
see how fast I could pick up a new framework. Prior to this, I virtually had
no experience using Backbone.js to structure JS applications. Apologies in
advance if the MVC project structure is a bit convoluted. I did my best to
develop the application in the two days time I was given. The Backbone routes
were not implemented, and aside from jshint, I was unable to create tests
for my code. The most challenging and rewarding part while coding the
application was structuring the models and collections.
