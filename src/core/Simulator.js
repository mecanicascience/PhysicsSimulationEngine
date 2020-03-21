class pSimulator {
    constructor() {
        this.config         = {};
        this.beginTime      = Date.now();
        this.lastUpdateTime = Date.now();
        this.lastDrawTime   = Date.now();

        this.config.engine  = this.getDefaultEngineConfig();
        this.config.custom  = {};

        window.getCustomConfig = this.getCustomConfig;
        window.getEngineConfig = this.getEngineConfig;

        this.dtMoy         = this.config.engine.runner.rollbackControl.minimalUpdateFPS;
        this.dtTotal       = 0;
        this.dtCount       = 0;
    }


    /** Instanciate the pSimulator */
    instanciate() {
        this.createP5Instance();
        this.plotter = new pSPlotter(this, new pSDrawer());

        window.runSimulator(this); // start is the main function
    }



    /** Creates a new p5 instance and creates loops for the simulation */
    createP5Instance() {
        let p       = this.getCanvasProportions(this.config.engine.window.proportions);
        this.canvas = createCanvas(p.w, p.h);
        this.canvas.parent(this.config.engine.runner.divId);

        let ru = this.config.engine.runner;
        if(ru.UPDATE_FPS >= ru.DRAW_FPS) frameRate(ru.UPDATE_FPS);
        else console.error('The Updates FPS must be superior as the Draws FPS.')


        // runs every time it's possible
        window.draw = function() {
            let s            = _pSimulationInstance;
        	let currentTime  = Date.now();
        	let dt           = (currentTime - s.lastUpdateTime) / 1000;
            let critiqDt     = s.dtMoy + s.dtMoy * s.config.engine.runner.rollbackControl.maxStandardDeviation;

            if(dt > critiqDt)
                dt = s.dtMoy;

        	s.lastUpdateTime = currentTime;
        	s.plotter.update(dt * s.config.engine.runner.simulationSpeed);

            if(currentTime - s.lastDrawTime >= 1 / s.config.engine.runner.DRAW_FPS) {
                if(dt <= critiqDt) {
                    s.dtTotal += dt;
                    s.dtCount += 1;
                    if(s.dtCount % s.config.engine.runner.rollbackControl.averageTimeSample == 0) {
                        s.dtMoy   = s.dtTotal / s.dtCount;
                        s.dtTotal = 0;
                        s.dtCount = 0;
                    }
                }

                s.plotter.draw();
                s.lastDrawTime = currentTime;
            }
        };

        // runs every time the window is resized
        window.windowResized = function() {
            let p = _pSimulationInstance.getCanvasProportions(_pSimulationInstance.config.engine.window.proportions);
            resizeCanvas(p.w, p.h);
        };
    }



    /** @return {w, h} proportions of the canvas based on the parameters */
    getCanvasProportions(cP) {
        let w, h;

        if(cP.isRelative) {
            w = windowWidth  * cP.width;
            h = windowHeight * cP.height;
        }
        else {
            w = cP.width  + "px";
            h = cP.height + "px";
        }

        return {w, h};
    }

    /**
    * @param customObject the Object that is going to be simulated (can be instanciated or not)
    * @param number Number of objects to be instanciated
    * @param params The parameters in the function
    * @return this
    */
    addObjects(customObject, number = 1, ...params) {
        if(customObject instanceof Function) {
            for (let i = 0; i < number; i++) {
                let copyParamsTemp = [];
                for (let j = 0; j < params.length; j++) {
                    if(
                           params[j] instanceof Array
                        && params[j][0] != undefined
                        && params[j][1] != undefined
                        && params[j][1] instanceof Function
                    )
                    {
                        if     (params[j][0] == this.config.engine.runner.addingObjectsConfigKeyWords.runFunctions)
                            copyParamsTemp.push(params[j][1](...params[j].slice(2)));
                        else if(params[j][0] == this.config.engine.runner.addingObjectsConfigKeyWords.runClass)
                            copyParamsTemp.push(new params[j][1](...params[j].slice(2)));
                    }
                    else
                        copyParamsTemp.push(params[j]);
                }
                this.plotter.objectsL.push(new customObject(...copyParamsTemp));
            }
        }
        else
            this.plotter.objectsL.push(customObject);

        return this;
    }

    /** @return the default configuration of the engine */
    getDefaultEngineConfig() {
        return {
            runner : {
                divId : 'simulationContent',
                UPDATE_FPS : 120,
                DRAW_FPS   : 60,
                simulationSpeed : 1,
                addingObjectsConfigKeyWords : {  // keywords for when we add objects at the start of the engine
                    runFunctions : '_RUN_F', // run a function with       ['_RUN_F', functionName, param1, param2, ...],
                    runClass     : '_RUN_C'  // instanciates a class with ['_RUN_C', className   , param1, param2, ...]
                },
                rollbackControl : {
                    maxStandardDeviation : 0.8,  // maximum tick deviation percentage for the software to consider as a rollback (in seconds)
                    averageTimeSample    : 20,   // sample size for tick average (in seconds),
                    minimalUpdateFPS     : 0.15  // minimal update frames
                }
            },
            window : {
                proportions : {  // window height and width on relative or absolute sizes
                    isRelative : true,
                    width  : 0.99,
                    height : 0.99
                }
            },
        	plotter : {
        		scale : {  // displays x relative units on each side
        			x : 10,
        			y : 10,
        			squareByX : true
        		},
        		offset : {  // x and y relative offset
        			x : 0,
        			y : 0
        		},
                backgroundColor : {
                    draw : true,
                    color : { r : 0  , g : 0  , b : 0 }
                },
                gridColor       : { r : 255, g : 255, b : 255, a : 0.6 },
        		displayGrid     : true  // true : display graph on the screen
        	}
        };
    }

    /**
    * @param configFunc The function that modifies engine configuration
    * @return this
    */
    setEngineConfig(configFunc) {
        configFunc(this.config.engine);
        window.windowResized(); // if proportions changed
        return this;
    }

    /**
    * @param config The function that modifies custom configuration
    * @return this
    */
    setCustomConfig(configFunc) {
        configFunc(this.config.custom);
        return this;
    }

    /**
    * @return the engine configuration
    */
    getEngineConfig() {
        return window._pSimulationInstance.config.engine;
    }

    /**
    * @return the custom configuration
    */
    getCustomConfig() {
        return window._pSimulationInstance.config.custom;
    }
}
