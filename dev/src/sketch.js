function preRunSimulator(simulator) {
	simulator
		.setPreEngineConfig((engineConf) => {
			engineConf.plotter.is_3D = true;
		});
}

function runSimulator(simulator) {
	simulator
		.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = {
				x : 50,
				y : 50,
				z : 50
			};
			engineConf.plotter.squareByX = true;
			// engineConf.plotter.displayGrid = true;
			// engineConf.runner.movable    = true;
		})
		// .addObjects(Plot, 1)
		.addObjects(Test3D, 1)
	;
}
