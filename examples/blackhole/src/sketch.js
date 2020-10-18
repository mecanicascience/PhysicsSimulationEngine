
function runSimulator(simulator)
{
	simulator.setEngineConfig((engineConf) => {
			engineConf.plotter.scale = { x: 10**9, y: 10**9 };
			engineConf.runner.movable = true;
		}
	).addObjects(Blackhole, 1, 0, 0, 10**29)
	 .addObjects(Photon, 10, -(10**9), ["_RUN_F", random, 0, 8*10**8]);
}
