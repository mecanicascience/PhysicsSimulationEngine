function runSimulator(simulator) {
	simulator
		.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = {
				x : 10,
				y : 10,
			};
			engineConf.plotter.displayGrid = false;
		})
		.addObjects(pSObject, 1, ["_RUN_F", random, 0, 2])
	;
}
