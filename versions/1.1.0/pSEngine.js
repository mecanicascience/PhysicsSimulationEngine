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
		};
	}
}

class pSimulator {
    constructor() {
        this.config         = {};
        this.beginTime      = Date.now();
        this.lastUpdateTime = Date.now();
        this.lastDrawTime   = Date.now();

        this.config.engine  = this.getDefaultEngineConfig();
        this.config.custom  = {};

        this.createP5Instance();
        this.plotter = new pSPlotter(this, new pSDrawer());

        window.runSimulator(this); // start is the main function

        window.getCustomConfig = this.getCustomConfig();
        window.getEngineConfig = this.getEngineConfig();
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
        	let dt           = (currentTime - s.lastUpdateTime) * s.config.engine.runner.simulationSpeed;
        	s.lastUpdateTime = currentTime;

        	s.plotter.update(dt / 1000);

            if(currentTime - s.lastDrawTime >= 1 / s.config.engine.runner.DRAW_FPS) {
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
                backgroundColor : { r : 0  , g : 0  , b : 0 },
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
        return this.config.engine;
    }

    /**
    * @return the custom configuration
    */
    getCustomConfig() {
        return this.config.custom;
    }
}

class pSDrawer {
    constructor(plotter) {
        this.plotter = null; // set when loaded in the Plotter class
    }

    point(x, y) {
        let v = this.plotter.computeForXY(x, y);
        point(v.x, v.y);
        return this;
    }

    ellipse(x, y, rx, ry) {
        let v = this.plotter.computeForXY(x, y);
        ellipse(v.x, v.y, rx, ry);
        return this;
    }




    stroke(r, g, b, a) {
        if(a == undefined) {
            if(b == undefined) {
                if(g == undefined)
                    stroke(r);
                else
                    stroke(r, g);
            }
            else
                stroke(r, g, b);
        }
        else
            stroke(`rgba(${r}, ${g}, ${b}, ${a})`);
        return this;
    }

    fill(r, g, b, a) {
        if(a == undefined) {
            if(b == undefined) {
                if(g == undefined)
                    fill(r);
                else
                    fill(r, g);
            }
            else
                fill(r, g, b);
        }
        else
            fill(`rgba(${r}, ${g}, ${b}, ${a})`);
        return this;
    }


    noStroke() {
        noStroke();
        return this;
    }

    noFill() {
        noFill();
        return this;
    }
}

class pSPlotter {
    constructor(simulator, drawer) {
        this.simulator = simulator;
        this.drawer    = drawer;
        this.objectsL  = [];

        this.drawer.plotter = this;
    }


    update(dt) {
        for (let i = 0; i < this.objectsL.length; i++)
            this.objectsL[i].update(dt, this.objectsL.slice(0).splice(i, 1));
    }

    draw() {
        let plConf = this.simulator.config.engine.plotter;
        let bg     = plConf.backgroundColor;

        background(bg.r, bg.g, bg.b);

        // Draw every object to the screen
        for (let i = 0; i < this.objectsL.length; i++)
            this.objectsL[i].draw(this.drawer);


        // Draw the grid
        if(this.simulator.config.engine.plotter.displayGrid) {
            /** @TODO To be implemented */
            let centerPos = this.computeForXY(0, 0);
            this.drawer
                .noStroke()
                .fill(plConf.gridColor.r, plConf.gridColor.g, plConf.gridColor.b, plConf.gridColor.a)
                .ellipse(centerPos.x, centerPos.y, 10, 10);
        }
    }



    /**
    * Compute the x and y position based on the drawing parameters
    * @param xRel X relative position
    * @param yRel Y relative position
    * @return {x, y} object
    */
    computeForXY(xRel, yRel) {
        let c = this.simulator.config.engine.plotter;
        let v = new Vector(((xRel + c.offset.x) / c.scale.x + 1)  * width / 2);

        if(!c.scale.squareByX)
            v.y = ((-yRel + c.offset.y) / c.scale.y + 1) * height / 2;
        else
            v.y = ((-yRel + c.offset.y) / c.scale.x)     * width  / 2 + height / 2;

        return v;
    }
}

class Vector {
    constructor(x, y, z) {
        this.x = x || 0;
        this.y = y || 0;
        this.z = z || 0;
    }

    set(x, y, z) {
        if(x instanceof Vector) {
            this.x = x.x || 0;
            this.y = x.y || 0;
            this.z = x.z || 0;
            return this;
        }

        this.x = x || 0;
        this.y = x || 0;
        this.z = x || 0;
        return this;
    }

    copy() {
        return new Vector(this.x, this.y, this.z);
    }

    add(x, y, z) {
        if(x instanceof Vector) {
            this.x += x.x || 0;
            this.y += x.y || 0;
            this.z += x.z || 0;
            return this;
        }

        this.x += x || 0;
        this.y += y || 0;
        this.y += z || 0;
        return this;
    }

    sub(x, y, z) {
        if(x instanceof Vector)
            return this.add(x.mult(-1));

        return this.add(-x, -y, -z);
    }

    mult(c) {
        if(!(typeof c === 'number') || !isFinite(c)) {
            console.warn(
                'Vector::mult()',
                'c is undefined or isn\'t a finite number'
            );
            return this;
        }

        this.x *= c;
        this.y *= c;
        this.z *= c;
        return this;
    }

    div(c) {
        if(!(typeof c === 'number') || !isFinite(c)) {
            console.warn(
                'Vector::div()',
                'c is undefined or isn\'t a finite number'
            );
            return this;
        }
        if(c == 0) {
            console.error('Cannot divide by 0');
            return this;
        }

        return this.mult(1 / c);
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    dot(x, y, z) {
        if(x instanceof Vector)
            return this.dot(x.x, x.y, x.z);

        return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    }

    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }

    normalize() {
        const vLen = this.mag();

        if (vLen !== 0)
            this.div(vLen);

        return this;
    }

    setMag(c) {
        return this.normalize().mult(c);
    }

    getAngle() {
        return Math.atan2(this.y, this.x);
    }

    rotate(angle) {
        const newAngle  = this.getAngle() + angle;
        const magnitude = this.mag();

        this.x = Math.cos(newAngle) * magnitude;
        this.y = Math.sin(newAngle) * magnitude;

        return this;
    }

    equals(x, y, z) {
        if(x instanceof Vector)
            return this.equals(x.x, x.y, x.z);

        return (this.x == x) && (this.y == y) && (this.z == z);
    }

    clear() {
        this.set(0, 0, 0);
        return this;
    }

    toString() {
        return `Vector Object : [${this.x}, ${this.y}, ${this.z}]`;
    }


    draw(originPosition, color, headSize, strokeW) {
        if(originPosition != undefined)
            Vector.draw(originPosition, this, color, headSize, strokeW);
        else
            Vector.draw(this);
    }

    static draw(originPosition, endPosition, color = 'rgb(255, 255, 255)', headSize = 5, strokeW = 1) {
        if((endPosition && endPosition.z != 0) || originPosition.z != 0)
            console.warn("Vector drawing is only implemented in 2D yet.");
        if(endPosition == undefined) {
            let c = originPosition.copy();
            endPosition = c.copy();
            originPosition = c.clear();
        }

        let originPos = _pSimulationInstance.plotter.computeForXY(originPosition.x, originPosition.y);
        let endPos    = _pSimulationInstance.plotter.computeForXY(endPosition.x   , endPosition.y);

        push();
            stroke(color);
            strokeWeight(strokeW);
            fill(color);

            line(originPos.x, originPos.y, endPos.x, endPos.y);
            translate(endPos.x, endPos.y);

            push();
                rotate(endPos.sub(originPos).getAngle());
                translate(-headSize - 2, 0);
                triangle(0, headSize / 2, 0, -headSize / 2, headSize, 0);
            pop();
    	pop();
        return this;
    }
}

const _pSglobalEngineInit = () => {
	new pSEngine();
};

// Run new configuration on document loaded
if(document.readyState === 'loading')
	_pSglobalEngineInit();
else
	window.addEventListener('load', _pSglobalEngineInit, false);



