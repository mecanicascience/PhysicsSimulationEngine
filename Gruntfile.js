module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: [
					'src/*/*',
					'src/*'
				],
				dest: 'build/pSEngine.js'
			}
		},

		uglify: {
			build: {
				src : 'build/pSEngine.js',
				dest: 'build/pSEngine.min.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');

	grunt.registerTask('default', ['concat', 'uglify']);
};
