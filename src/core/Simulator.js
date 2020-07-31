import pSPlotter  from './../drawer/Plotter';
import pSDrawer   from './../drawer/Drawer';
import pS3DDrawer from './../drawer/3DDrawer';
import pSRecorder from './../utilities/Recorder';

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

        this.dtMoy   = this.config.engine.runner.rollbackControl.minimalUpdateFPS;
        this.dtTotal = 0;
        this.dtCount = 0;
    }


    /** Instanciate the pSimulator */
    instanciate() {
        try {
            window.preRunSimulator(this); // premain function
        } catch(e) {} // not found

        this.createP5Instance();
        if(!this.config.engine.plotter.is_3D) {
            setAttributes('antialias', true);
            this.plotter = new pSPlotter(this, new pSDrawer());
        }
        else
            this.plotter = new pSPlotter(this, new pS3DDrawer());

        this.recorder = new pSRecorder();

        this.mousePos = this.plotter.computeForXYFromPixel(mouseX, mouseY);

        window.runSimulator(this); // main function
    }



    /** Creates a new p5 instance and creates loops for the simulation */
    createP5Instance() {
        let p = this.getCanvasProportions(this.config.engine.window.proportions);

        if(!this.config.engine.plotter.is_3D)
            this.canvas = createCanvas(p.w, p.h);
        else
            this.canvas = createCanvas(p.w, p.h, WEBGL);

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

            s.mousePos = s.plotter.computeForXYFromPixel(mouseX, mouseY);

            if(!s.recorder.running || (s.recorder.running && !s.recorder.frameBlocker)) {
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
            }
            else { // Is recording screen in a blocking-time way
                if(s.recorder.pauseMode)
                    return;

                dt = 1 / s.recorder.updateFPS;
                s.recorder.currentRelT += dt;

                let shouldSnap = false;
                if (s.recorder.currentRelT - s.recorder.lastDrawTime >= 1 / s.recorder.drawingFPS) {
                    dt = 1 / s.recorder.drawingFPS;
                    shouldSnap = true;
                }


                s.lastUpdateTime = s.recorder.currentRelT;
                s.plotter.update(dt);

                if (shouldSnap) {
                    s.plotter .draw();
                    s.recorder.snapshot(dt);
                    s.recorder.lastDrawTime = s.recorder.currentRelT;
                }
            }
        };

        // runs every time the window is resized
        window.windowResized = function() {
            let p = _pSimulationInstance.getCanvasProportions(_pSimulationInstance.config.engine.window.proportions);
            resizeCanvas(p.w, p.h);
        };

        // run each time mouse is pressed
        window.mouseDragged = function() {
            if(!_pSimulationInstance.config.engine.runner.movable)
                return;

            let mousePos = _pSimulationInstance.plotter.computeForXYFromPixel(mouseX, mouseY);
            if(!_pSimulationInstance.mousePos.equals(mousePos)) {
                _pSimulationInstance.config.engine.plotter.offset.x -= mousePos.x - _pSimulationInstance.mousePos.x;
                _pSimulationInstance.config.engine.plotter.offset.y -= mousePos.y - _pSimulationInstance.mousePos.y;
            }
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
                },
                is_movable : false // can the cursor move on the screen
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
                    z : 10
        		},
        		offset : {  // x and y relative offset
        			x : 0,
        			y : 0,
                    z : 0
        		},
                backgroundColor : {
                    draw : true,
                    color : { r : 0 , g : 0 , b : 0 }
                },
                squareByX       : false,
                is_3D           : false,
                gridColor       : { r : 255, g : 255, b : 255, a : 0.3 },
        		displayGrid     : false  // true : display graph on the screen
        	}
        };
    }

    /**
    * @param configFunc The function that modifies engine configuration
    * @return this
    */
    setPreEngineConfig(configFunc) {
        configFunc(this.config.engine);
        return this;
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


    getPSEngineVar() {
        /**
        * @TODO
        */
    }
}

export default pSimulator;
