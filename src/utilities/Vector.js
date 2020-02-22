class Vector {
    constructor(x, y, color = 'rgb(255, 255, 255)', name) {
        this.x    = x || 0;
        this.y    = y || 0;
        this.z    = 0;

        this.color = color;

        this.setName(name);
    }



    /* ========= BASIC VECTOR METHODS ========= */
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

    setName(name) {
        if(name == undefined)
            return this;

        if(name instanceof Text)
            this.name = name;
        else
            this.name = new Text(name, new Vector(this.x, this.y));

        return this;
    }


    equals(x, y, z) {
        if(x instanceof Vector)
            return this.equals(x.x, x.y, x.z);

        return (this.x == x) && (this.y == y) && (this.z == z);
    }


    copy() { return new Vector(this.x, this.y, this.z); }

    clear() { return this.set(0, 0, 0); }

    toString() { return `Vector Object : [${this.x}, ${this.y}, ${this.z}]`; }
    /* ======================================== */





    /* ========= BASIC VECTOR OPERATIONS ========= */
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


    // Static methods
    static add (v1, v2) { return (v1.copy()).add(v2); }
    static sub (v1, v2) { return (v1.copy()).sub(v2); }
    static mult(v1, c ) { return (v1.copy()).mult(c); }
    static div (v1, c ) { return (v1.copy()).div (c); }
    /* =========================================== */





    /* ========= ADVANCED MATH VECTOR OPERATIONS ========= */
    // Dot and cross products
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



    // Magnitude
    normalize() {
        const vLen = this.mag();

        if (vLen !== 0)
            this.div(vLen);

        return this;
    }

    limit(min, max) {
    	let m = this.mag();
    	if(m < min)
    		this.div(m).mult(min);
    	if(m > max)
    		this.div(m).mult(max);
    	return this;
    }

    mag()     { return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z); }
    setMag(c) { return this.normalize().mult(c); }



    // Angles
    rotate(angle) {
        const newAngle  = this.getAngle() + angle;
        const magnitude = this.mag();

        this.x = Math.cos(newAngle) * magnitude;
        this.y = Math.sin(newAngle) * magnitude;

        return this;
    }

    getAngle() { return Math.atan2(this.y, this.x); }



    // Static methods
    static dist(v1, v2) { return Vector.sub(v1, v2).mag(); }

    static dot      (v1, x, y, z) { return (v1.copy()).dot(x, y, z);  }
    static cross    (v1, v2)      { return (v1.copy()).cross(v2);     }
    static normalize(v1)          { return (v1.copy()).normalize();   }
    static rotate   (v1, angle)   { return (v1.copy()).rotate(angle); }
    /* =================================================== */





    /* ========= DRAWING VECTORS ========= */
    draw(originPosition, headSize, strokeW) {
        if(originPosition != undefined)
            Vector.draw(this, this.color, this, originPosition, headSize, strokeW);
        else
            Vector.draw(this, this.color, this);
    }


    static draw(vector, color = 'rgb(255, 255, 255)', originPosition, originPosition1, headSize = 5, strokeW = 1, endPosition) {
        push();
            if(originPosition1 != undefined) {
                let p = _pSimulationInstance.plotter.computeForXY(originPosition1.x, originPosition1.y);
                translate(p.x - width / 2, p.y - height / 2);
            }

            if((endPosition && endPosition.z != 0) || originPosition.z != 0)
                console.warn("Vector drawing is only implemented in 2D yet.");

            let c = originPosition.copy();
            endPosition = c.copy();
            originPosition = c.clear();

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

            if(vector.name != undefined) {
                // NAME
                let angle = vector.getAngle();
                if(angle < 0)
                    angle += 2*PI;

                let xOffset = 0.8 * vector.name.cWidth;
                if(    (PI/4   < angle && angle <= PI/2  )
                    || (3*PI/4 < angle && angle <= 5*PI/4)
                    || (3*PI/2 < angle && angle <= 7*PI/4)
                ) xOffset *= -1;

                let yOffset = -1.1 * vector.name.desc + 1.1 * vector.name.asc;
                if(    (PI/4   < angle && angle <=   PI/2)
                    || (PI/2   < angle && angle <= 3*PI/4)
                    || (PI     < angle && angle <= 5*PI/4)
                    || (7*PI/4 < angle && angle <=   2*PI)
                ) yOffset *= -1;

                vector.name
                    .setColor(color)
                    .setPosition(vector.x / 2, vector.y / 2)
                    .setOffset(xOffset, yOffset)
                    .draw(_pSimulationInstance.plotter.drawer);


                // ARROW ON TOP
                let originPos2 = _pSimulationInstance.plotter.computeForXY(vector.x / 2, vector.y / 2);
                push();
                    stroke(color);
                    strokeWeight(strokeW);
                    fill(color);

                    translate(0, 0);
                    translate(originPos2.x + xOffset - vector.name.cWidth / 2, originPos2.y + yOffset - vector.name.asc);
                    line(0, 0, vector.name.cWidth, 0);

                    push();
                        translate(headSize + vector.name.cWidth / 2 - 1, 0);
                        triangle(0, headSize / 4, 0, -headSize / 4, headSize / 2, 0);
                    pop();
            	pop();
            }
        pop();

        return this;
    }
    /* =================================== */
}
