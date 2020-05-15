function runSimulator(simulator) {
	simulator
		.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = {
				x: 5,
				y: 5,
			};
			engineConf.plotter.displayGrid = false;
		})
		.setCustomConfig((customConf) => {
			customConf.drawSizeMultiplier = 10;
		})
		.addObjects(Plot, 1)
	;
}
