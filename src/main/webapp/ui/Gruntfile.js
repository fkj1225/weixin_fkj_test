'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        yuidoc: {
            compile: {
                logo: '../logo.png',
                options: {
                    paths: 'js/',
                    outdir: 'yuidoc/'
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-contrib-yuidoc');
    grunt.registerTask('default', ['yuidoc']);
}