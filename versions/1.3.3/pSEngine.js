class Point {
    constructor(x, y, color, pointName, pointSize = 6, vectorName, drawOriginVector = true) {
        this.pos = new Vector(x, y, color, vectorName);

        if(pointName != undefined)
            this.pointName = new Text(pointName, this.pos, 18, color);

        this.drawOriginVector = drawOriginVector;
        this.pointSize        = pointSize;
        this.pointSizeDrawing = pointSize;

        this.animation = new Animation('easeInOutCubic');

        this.textPadding = 0.4;
    }

    update() { }

    draw() {
        let drawer = _pSimulationInstance.plotter.drawer;

        // POINT LOCATION
        drawer
            .fill(parseInt(this.pos.color[0] * 0.4), parseInt(this.pos.color[1] * 0.4), parseInt(this.pos.color[2] * 0.4))
            .noStroke()
            .ellipse(this.pos.x, this.pos.y, this.pointSizeDrawing, this.pointSizeDrawing)
            .stroke(this.pos.color)
            .strokeWeight(1.1)
            .noFill()
            .ellipse(this.pos.x, this.pos.y, this.pointSizeDrawing, this.pointSizeDrawing)
        ;

        // ORIGIN VECTOR
        if(this.pos.name != undefined && this.drawOriginVector)
            this.pos.draw();

        // POINT NAME
        if(this.pointName == undefined)
            return;

        this.pointName.pos = (this.pos.copy()).add(0, this.textPadding);
        if(this.pos.name != undefined && this.drawOriginVector && this.pos.y < 0)
            this.pointName.pos = (this.pos.copy()).add(0, -this.textPadding);

        this.pointName.draw(drawer);
    }


    handleMouseOver(mX1, mX2, mY1, mY2) {
        if(this.pos.x > mX1 && mX2 > this.pos.x && this.pos.y > mY1 && mY2 > this.pos.y) {
            if(!this.animation.isAnimating)
                this.animation.start();

            this.pointSizeDrawing = this.pointSize + this.animation.nextKey() * 100;//8;
        }
        else {
            this.animation.stop();
            this.pointSizeDrawing = this.pointSize;
        }
    }
}

class Text {
    constructor(text, pos, textSize = 18, color = "#FFFFFF", showHitbox = false) {
        this.text     = text;
        this.textSize = textSize;
        this.color    = color;

        this.pos     = pos;
        this.xOffset = 0;
        this.yOffset = 0;

        this.showHitbox = showHitbox;

        this.calculateValues();
    }


    draw() {
        let drawer = _pSimulationInstance.plotter.drawer;
        let pos    = drawer.plotter.computeForXY(this.pos.x, this.pos.y);

        push();
            textSize(this.textSize);
            drawer
                .noStroke()
                .fill(this.color);

            translate(-this.cWidth / 2 + this.xOffset, (-this.desc + this.asc) / 2 + this.yOffset);
            text(this.text, pos.x, pos.y);

            if(this.showHitbox) {
                drawer
                    .stroke(this.color)
                    .strokeWeight(1)
                    .noFill();
                line(pos.x              , pos.y - this.asc , pos.x + this.cWidth, pos.y - this.asc);
                line(pos.x              , pos.y + this.desc, pos.x + this.cWidth, pos.y + this.desc);
                line(pos.x              , pos.y + this.desc, pos.x              , pos.y - this.asc);
                line(pos.x + this.cWidth, pos.y + this.desc, pos.x + this.cWidth, pos.y - this.asc);
            }
        pop();
    }



    calculateValues() {
        let scalar = 0.8; // Different for each font

        textSize(this.textSize);

        this.asc    = textAscent () * scalar;
        this.desc   = textDescent() * scalar;
        this.cWidth = textWidth(this.text);
    }

    setText(text) {
        this.text = text;
        this.calculateValues();
        return this;
    }

    setPosition(x, y) {
        this.pos.x = x;
        this.pos.y = y;
        return this;
    }

    setOffset(x, y) {
        this.xOffset = x;
        this.yOffset = y;
        return this;
    }

    setColor(color) {
        this.color = color;
        return this;
    }
}

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

class Animation {
    constructor(animationName, scaleTime = 0.1) {
        if(!animationName)
            animationName = 'linear';

        switch (animationName) {
            case 'linear':
                this.f = (t) => t;
                break;

            case 'easeInOutCubic':
                this.f = (function(t) {
                    if ((t /= 0.5) < 1)
                        return 0.5 * t * t;
                    return -0.5 * ((--t) * (t - 2) - 1);
                });
                break;
        }

        this.scaleTime   = scaleTime;
        this.isAnimating = false;
        this.initialT    = 0;

        this.timeDirection = 1; // 1 or -1
    }

    start() {
        this.isAnimating = true;
        this.initialT    = (new Date()).getTime() / 1000;
    }

    stop() {
        this.isAnimating = false;
        this.initialT    = 0;
    }

    reverse() {
        this.timeDirection *= -1;
    }

    nextKey() {
        let t = (new Date()).getTime();
        let dt = t / 1000 - this.initialT;
        if(this.timeDirection < 0)
            dt = t;

        if((dt > 1 * this.scaleTime && this.timeDirection > 0) || (dt < 1 * this.scaleTime && this.timeDirection < 0))
            return this.lastKey;
        this.lastKey = this.f(dt) / this.scaleTime;

        return this.lastKey;
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

    line(x0, y0, x1, y1) {
        let v0 = this.plotter.computeForXY(x0, y0);
        let v1 = this.plotter.computeForXY(x1, y1);
        line(v0.x, v0.y, v1.x, v1.y);
        return this;
    }

    ellipse(x, y, rx, ry) {
        let v = this.plotter.computeForXY(x, y);
        ellipse(v.x, v.y, rx, ry);
        return this;
    }

    circle(x, y, r) {
    	return this.ellipse(x, y, r, r);
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

    strokeWeight(n) {
        strokeWeight(n);
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
            this.objectsL[i].update(dt, this.objectsL);
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

/**
* A class for every 3D Vectors.
* <br/>Please note that current vector may only be used in <b>2D</b>.
*/
class Vector {
    /**
    * Creates a new Vector (each coordinate gets a 0 if value not provided)
    * @param x X coordinate
    * @param y Y coordinate
    * @param color Color of the Vector 'rgba(R, G, B, A)'
    * @param name Name of the Vector to be potentially displayed (@see draw method)
    * @return this
    */
    constructor(x, y, color = 'rgb(255, 255, 255)', name) {
        this.x    = x || 0;
        this.y    = y || 0;
        this.z    = 0;

        this.color = color;

        this.setName(name);
    }



    /* ========= BASIC VECTOR METHODS ========= */
    /**
    * Set x, y, z coordinates (each coordinate gets a 0 if value not provided)
    * @param x New X coordinate OR a Vector x to be equal to
    * @param y New Y coordinate
    * @param z New Z coordinate
    * @return this
    */
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

    /**
    * Set vector name
    * @param name New name of the Vector
    * @return this
    */
    setName(name) {
        if(name == undefined)
            return this;

        if(name instanceof Text)
            this.name = name;
        else
            this.name = new Text(name, new Vector(this.x, this.y));

        return this;
    }

    /**
    * Check if two vectors or pair of coordinates are equal
    * @param x X coordinate OR a Vector x for egality checking
    * @param y Y coordinate
    * @param z Z coordinate
    * @return true if equal
    */
    equals(x, y, z) {
        if(x instanceof Vector)
            return this.equals(x.x, x.y, x.z);

        return (this.x == x) && (this.y == y) && (this.z == z);
    }

    /** @return a copy of the current Vector */
    copy() { return new Vector(this.x, this.y, this.z); }

    /** @return this Vector with coordinates set to (0, 0, 0) */
    clear() { return this.set(0, 0, 0); }

    /** @return A String representation of the object */
    toString() { return `Vector Object : [${this.x}, ${this.y}, ${this.z}]`; }
    /* ======================================== */





    /* ========= BASIC VECTOR OPERATIONS ========= */
    /**
    * Add two vectors or pair of coordinates together
    * @param x X coordinate OR a Vector x
    * @param y Y coordinate
    * @param z Z coordinate
    * @return this
    */
    add(x, y, z) {
        if(x instanceof Vector)
            return this.add(x.x, x.y, x.z);

        this.x += x || 0;
        this.y += y || 0;
        this.y += z || 0;
        return this;
    }

    /**
    * Sustract two vectors or pair of coordinates together
    * @param x X coordinate OR a Vector x
    * @param y Y coordinate
    * @param z Z coordinate
    * @return this
    */
    sub(x, y, z) {
        if(x instanceof Vector)
            return this.sub(x.x, x.y, x.z);

        return this.add(-x, -y, -z);
    }

    /**
    * Multiply this Vector by a scalar
    * @param c The multiplication scalar
    * @return this
    */
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

    /**
    * Divides this Vector by a scalar
    * @param c The division scalar
    * @return this
    */
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



    // Static methods
    /**
    * Add two vectors together
    * @param v1 The first vector
    * @param v2 The second vector
    * @return A new Vector
    */
    static add(v1, v2) { return (v1.copy()).add(v2); }

    /**
    * Subtract two vectors together
    * @param v1 The first vector
    * @param v2 The second vector
    * @return A new Vector
    */
    static sub(v1, v2) { return (v1.copy()).sub(v2); }

    /**
    * Multiply a vector by a scalar
    * @param v1 The vector
    * @param c A scalar c
    * @return A new multiplied Vector
    */
    static mult(v1, c) { return (v1.copy()).mult(c); }

    /**
    * Divides two vectors together
    * @param v1 The vector
    * @param c A scalar c
    * @return A new divided Vector
    */
    static div (v1, c) { return (v1.copy()).div(c); }
    /* =========================================== */





    /* ========= ADVANCED MATH VECTOR OPERATIONS ========= */
    // Dot and cross products
    /**
    * Dot product between a Vector OR a pair of coordinates
    * @param x X coordinate OR a Vector x
    * @param y Y coordinate
    * @param z Z coordinate
    * @return this
    */
    dot(x, y, z) {
        if(x instanceof Vector)
            return this.dot(x.x, x.y, x.z);

        return this.x * (x || 0) + this.y * (y || 0) + this.z * (z || 0);
    }

    /**
    * Cross product with a Vector
    * @param v The vector
    * @return this
    */
    cross(v) {
        return new Vector(
            this.y * v.z - this.z * v.y,
            this.z * v.x - this.x * v.z,
            this.x * v.y - this.y * v.x
        );
    }



    // Magnitude
    /** @return the normalized Vector */
    normalize() {
        const vLen = this.mag();
        if (vLen !== 0)
            this.div(vLen);

        return this;
    }

    /**
    * Limit the magnitude of the vector between a min and a max value
    * @param min Minimum value of the Vector magnitude
    * @param max Maximum value of the Vector magnitude
    * @return this
    */
    limit(min, max) {
    	let m = this.mag();
    	if(m < min)
    		this.div(m).mult(min);
    	if(m > max)
    		this.div(m).mult(max);
    	return this;
    }

    /** @return the magnitude of this vector */
    mag() { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }

    /**
    * Set the magnitude of this vector
    * @param mag The new magnitude
    * @return this
    */
    setMag(mag) { return this.normalize().mult(mag); }



    // Angles
    /**
    * Rotate this vector by an angle
    * @param angle An angle IN RADIANS
    * @return this
    */
    rotate(angle) {
        const newAngle  = this.getAngle() + angle;
        const magnitude = this.mag();

        this.x = Math.cos(newAngle) * magnitude;
        this.y = Math.sin(newAngle) * magnitude;

        return this;
    }

    /** @return the angle between this vector and the origin */
    getAngle() { return Math.atan2(this.y, this.x); }



    // Static methods
    /**
    * Distance bewteen two vectors
    * @param v1 The first vector
    * @param v2 The second vector
    * @return the distance between the two positions where the arrow are pointing to
    */
    static dist(v1, v2) { return Vector.sub(v1, v2).mag(); }

    /**
    * Dot product between a Vector OR a pair of coordinates
    * @param v1 The first vector
    * @param x X coordinate OR a Vector x
    * @param y Y coordinate
    * @param z Z coordinate
    * @return the dotted new vector
    */
    static dot(v1, x, y, z) { return (v1.copy()).dot(x, y, z); }

    /**
    * Cross product with a Vector
    * @param v1 The first vector
    * @param v2 The second vector
    * @return the crossed new vector
    */
    static cross(v1, v2) { return (v1.copy()).cross(v2); }

    /** @return the normalized Vector */
    static normalize(v1) { return (v1.copy()).normalize(); }

    /**
    * Rotate a vector by an angle
    * @param v1 The vector to be rotated
    * @param angle An angle IN RADIANS
    * @return the rotated vector
    */
    static rotate (v1, angle) { return (v1.copy()).rotate(angle); }
    /* =================================================== */





    /* ========= DRAWING VECTORS ========= */
    /**
    * Draw a vector to the canvas using the `Drawer` class
    * @param initialPos The beginning position of the Vector Arrow
    * @param headSize Size of the head in pixels (default = 5 px)
    * @param strokeWeight Stroke weight of the Vector in pixels (default = 1 px)
    */
    draw(initialPos, headSize, strokeWeight) {
        if(initialPos != undefined)
            Vector.draw(initialPos, this, this.color, headSize, strokeWeight);
        else
            Vector.draw(undefined , this, this.color);
    }

    /**
    * (Please avoid directly using this method)
    * Draw a vector to the canvas using the `Drawer` class
    * @param initialPos The beginning position of the Vector Arrow
    * @param initialPos The ending position of the Vector Arrow
    * @param color Color of the arrow (default `rgb(255, 255, 255)`)
    * @param headSize Size of the head in pixels (default = 5 px)
    * @param strokeWeight Stroke weight of the Vector in pixels (default = 1 px)
    */
    static draw(initialPos, pointingPos, color = 'rgb(255, 255, 255)', headSize = 5, strokeW = 1) {
        if((initialPos != undefined && initialPos.z != 0) || pointingPos.z != 0)
            console.warn("Vector drawing is only implemented in 2D yet.");

        let plotter = _pSimulationInstance.plotter;

        push();
            // DRAW VECTOR
            if(initialPos != undefined) {
                let p = plotter.computeForXY(initialPos.x, initialPos.y);
                translate(p.x - width / 2, p.y - height / 2);
            }

            let zzPosition = plotter.computeForXY(0, 0);
            let endPos     = plotter.computeForXY(pointingPos.x, pointingPos.y);

            push();
                plotter.drawer
                    .stroke(color)
                    .strokeWeight(strokeW)
                    .fill(color);

                line(zzPosition.x, zzPosition.y, endPos.x, endPos.y);
                translate(endPos.x, endPos.y);

                rotate(endPos.sub(zzPosition).getAngle());
                translate(-headSize - 2, 0);
                triangle(0, headSize / 2, 0, -headSize / 2, headSize, 0);
        	pop();


            // DRAW VECTOR NAME
            if(pointingPos.name != undefined) {
                // Offset of the text based on the angle on the unit circle
                let angle = pointingPos.getAngle();
                if(angle < 0)
                    angle += 2*PI;

                let xOffset = 0.8 * pointingPos.name.cWidth;
                if(    (PI/4   < angle && angle <= PI/2  )
                    || (3*PI/4 < angle && angle <= 5*PI/4)
                    || (3*PI/2 < angle && angle <= 7*PI/4)
                ) xOffset *= -1;

                let yOffset = -1.1 * pointingPos.name.desc + 1.1 * pointingPos.name.asc;
                if(    (PI/4   < angle && angle <=   PI/2)
                    || (PI/2   < angle && angle <= 3*PI/4)
                    || (PI     < angle && angle <= 5*PI/4)
                    || (7*PI/4 < angle && angle <=   2*PI)
                ) yOffset *= -1;

                pointingPos.name
                    .setColor(color)
                    .setPosition(pointingPos.x / 2, pointingPos.y / 2)
                    .setOffset(xOffset, yOffset)
                    .draw(plotter.drawer);


                // ARROW ON TOP
                let arrowOrPos = plotter.computeForXY(pointingPos.x / 2, pointingPos.y / 2);
                plotter.drawer
                    .stroke(color)
                    .strokeWeight(strokeW)
                    .fill(color);

                translate(
                    arrowOrPos.x + xOffset - pointingPos.name.cWidth / 2,
                    arrowOrPos.y + yOffset - pointingPos.name.asc
                );
                line(0, 0, pointingPos.name.cWidth, 0);

                // Triangle
                push();
                    translate(headSize + pointingPos.name.cWidth / 1.5, 0);
                    triangle(0, headSize / 4, 0, -headSize / 4, headSize / 2, 0);
                pop();
            }
        pop();

        return this;
    }
    /* =================================== */
}

const _pSglobalEngineInit = () => {
	new pSEngine();
};

// Run new configuration on document loaded
if(document.readyState === 'loading')
	_pSglobalEngineInit();
else
	window.addEventListener('load', _pSglobalEngineInit, false);



