function runSimulator(simulator) {
	simulator
		.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = {
				x: 10,
				y: 10,
			};
			engineConf.plotter.displayGrid = false;
		})
		.setCustomConfig((customConf) => {
			customConf.drawSizeMultiplier = 10;
		})
		.addObjects(SObject, 1, ["_RUN_F", random, -10, 10], ["_RUN_F", random, -10, 10], "M1", "r1")
		.addObjects(SObject, 1, ["_RUN_F", random, -10, 10], ["_RUN_F", random, -10, 10], "M2", "r2")
		.addObjects(Point  , 1, 0, 0, "#FFFFFF", "O")
	;
}
