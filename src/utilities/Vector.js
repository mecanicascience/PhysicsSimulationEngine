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
