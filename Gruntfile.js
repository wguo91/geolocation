module.exports = function(grunt) {
  // project configuration
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      all: ['Gruntfile.js', 'app.js', 'server.js', 'models/*.js',
        'views/*.js', 'collections/*.js', 'config/*.js'],
      options: {
        jshintrc: '.jshintrc',
        ignores: ['**/*.min.js']
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'js/app.min.js': ['js/app.js'],
          'js/views/hosts.min.js': ['js/views/hosts.js'],
          'js/views/index.min.js': ['js/views/index.js'],
          'js/views/map.min.js': ['js/views/map.js'],
          'js/models/Host.min.js': ['js/models/Host.js'],
          'js/collections/Hosts.min.js': ['js/collections/Hosts.js']
        }
      }
    },
    cssmin: {
      options: {
        shorthandCompacting: false,
        roundingPrecision: -1
      },
      target: {
        files: {
          'css/geolocation.min.css': ['css/geolocation.css']
        }
      }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  // default tasks
  grunt.registerTask('default', ['jshint', 'uglify', 'cssmin']);
};
