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
			engineConf.plotter.scale = {
				x : 5,
				y : 5,
				z : 5
			};
			engineConf.plotter.offset = {
				x : 2,
				y : 2,
				z : 2
			};
			engineConf.plotter.squareByX = false;
			engineConf.plotter.displayGrid = true;
		})
		.addObjects(Plot, 1)
	;
}
