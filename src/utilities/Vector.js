import './../drawer/objects/Text';

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
    constructor(x, y, z, color = 'rgb(255, 255, 255)', name) {
        this.x    = x || 0;
        this.y    = y || 0;
        this.z    = z || 0;

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

        if(name instanceof pSText)
            this.name = name;
        else
            this.name = new pSText(name, new Vector(this.x, this.y, this.z));

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
        this.z += z || 0;
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
    * Rotate this vector by an angle on the XY plane
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
                let p = plotter.computeForXYZ(initialPos.x, initialPos.y, initialPos.z);
                translate(p.x - width / 2, p.y - height / 2);
            }

            let zzPosition = plotter.computeForXYZ(0, 0, 0);
            let endPos     = plotter.computeForXYZ(pointingPos.x, pointingPos.y, pointingPos.z);

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

export default Vector;
