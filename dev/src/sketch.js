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
		.addObjects(Plot, 1)
	;
}
