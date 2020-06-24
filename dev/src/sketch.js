function preRunSimulator(simulator) {
	simulator
		.setPreEngineConfig((engineConf) => {
			engineConf.plotter.is_3D = false;
		})
	;
}

function runSimulator(simulator) {
	simulator
		.setEngineConfig((engineConf) => {
			engineConf.runner.movable = true;
			engineConf.plotter.scale = {
				x : 5,
				y : 5,
				z : 5
			};
			engineConf.plotter.squareByX   = true;
			engineConf.plotter.displayGrid = true;
		})
		.addObjects(Plot, 1)
	;
}
