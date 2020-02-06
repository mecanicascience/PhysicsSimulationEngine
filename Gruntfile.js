module.exports = function(grunt) {
	const dest = grunt.option('dest');

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		concat: {
			dist: {
				src: [
					'src/*/*',
					'src/*'
				],
				dest: dest + 'pSEngine.js'
			}
		},

		uglify: {
			build: {
				src : dest + 'pSEngine.js',
				dest: dest + 'pSEngine.min.js'
			}
		},

		concurrent: {
			target: {
				tasks: ['nodemon', 'watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		watch: {
			scripts: {
				files: [
					'src/*/*',
					'src/*'
				],
				tasks: ['concat','uglify'],
				options: {
					spawn: false,
				}
			}
		},
		nodemon: {
			dev: {
				script: './dev/app.js'
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify-es');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['concat', 'uglify', 'concurrent:target']);
	grunt.registerTask('build'  , ['concat', 'uglify']);
};
