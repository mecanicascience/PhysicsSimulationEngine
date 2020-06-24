function runSimulator(simulator) {
	simulator
		.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = { x: 3*10e11, y: 3*10e11 };
			engineConf.plotter.squareByX = true;
			engineConf.runner.simulationSpeed = 5 * 10e5;
			engineConf.runner.movable = true;
		})
		.addObjects(NBody, 1, 3.3e23, 0, 4.7e10, 5.9e4, 0, [241, 203, 131], "Mercure")
		.addObjects(NBody, 1, 4.9e24, 0, 1.1e11, 3.5e4, 0, [243, 223, 107], "Venus")
		.addObjects(NBody, 1, 6.0e24, 0, 1.5e11, 3.0e4, 0, [173, 231, 247], "Terre")
		.addObjects(NBody, 1, 6.4e23, 0, 2.1e11, 2.6e4, 0, [223, 120, 036], "Mars")
		.addObjects(NBody, 1, 1.9e27, 0, 7.4e11, 1.3e4, 0, [243, 131, 239], "Jupiter")
		.addObjects(NBody, 1, 5.6e26, 0, 1.3e12, 1.0e4, 0, [118, 064, 045], "Saturne")
		.addObjects(NBody, 1, 8.7e25, 0, 2.7e12, 7.1e3, 0, [157, 221, 250], "Uranus")
		.addObjects(NBody, 1, 1.0e26, 0, 4.4e12, 5.5e3, 0, [045, 086, 148], "Neptune")
		.addObjects(NBody, 1, 1.989*10**30, 0, 0, 0,    0, [246, 244, 129], "Soleil")
     ;
}
