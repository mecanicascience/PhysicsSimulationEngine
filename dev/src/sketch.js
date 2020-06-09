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
		.addObjects(Plot, 1, new Vector(1, 2), new Vector(25, 34), new Vector(12, 25), [255, 255, 255])
	;
}
