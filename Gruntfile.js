/*global module:false*/
module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
                ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
            dist: {
                src: ['lib/*.js'],
                dest: 'dist/<%= pkg.name %>.js'
            }
        },
        jsdoc: {
            dist: {
                src: ['dist/<%= pkg.name %>.js', 'README.md'],
                options: {
                    destination: 'doc',
                    configure: 'jsdoc.conf.json'
                }
            }
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                src: '<%= concat.dist.dest %>',
                dest: 'dist/<%= pkg.name %>.min.js'
            }
        },
        jshint: {
            gruntfile: {
                src: 'Gruntfile.js'
            },
            src: {
                options: {
                    jshintrc: 'lib/.jshintrc'
                },
                src: ['lib/**/*.js']
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        watch: {
            js: {
                files: ['Gruntfile.js', 'lib/signdbmap.js', 'README.md', 'lib/.jshintrc', 'jsdoc.conf.json'],
                tasks: ['with-docs']
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsdoc');

    // Default task.
    grunt.registerTask('default', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('with-docs', ['default', 'jsdoc']);

};
