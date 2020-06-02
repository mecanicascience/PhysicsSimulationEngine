
function runSimulator(simulator)
{
	simulator.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = { x: 500, y: 500 };
		}
	).addObjects(pSObject, 10, ["_RUN_F", random, -20, 20], ["_RUN_F", random, -5, 5], 300);
		//Parameters: pSObject, number of balls, x position of the balls, y position
		// of the balls, x speed of the balls
}
