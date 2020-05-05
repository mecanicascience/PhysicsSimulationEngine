import pSimulator from './Simulator';

class pSEngine {
	constructor() {
		if(window.p5 == undefined)
			console.error(
				'You must import p5.js in order to run the Physics Simulation Engine.',
				'More informations on the p5 website https://p5js.org/.'
			);

		// uses the p5 functions
		window.setup = function() {
			window._pSimulationInstance = new pSimulator();
			window._pSimulationInstance.instanciate();
		};
	}
}

export default pSEngine;
