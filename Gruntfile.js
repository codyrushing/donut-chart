module.exports = function(grunt) {
    "use strict";

    // 1. All configuration goes here
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        jshint: {
            all: ["Gruntfile.js", "js/*.js", "!**/*.min.js"]
        },
        uglify: {
            target: {
                files: {
                    "js/<%= pkg.name %>.min.js": ["js/<%= pkg.name %>.js"]
                }
            } 
        },
        watch: {
            scripts: {
                files: ["Gruntfile.js", "js/**/*.js"],
                tasks: ["jshint"]
            }
        }
    });

    // 3. Where we tell Grunt we plan to use this plug-in.
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.
    grunt.registerTask("default", ["jshint", "uglify", "watch"]);

};