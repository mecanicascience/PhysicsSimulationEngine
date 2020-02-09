class Vector {
    constructor(x, y, color = 'rgb(255, 255, 255)', text) {
        this.x    = x || 0;
        this.y    = y || 0;
        this.z    = 0;

        this.color = color;

        this.setText(text);
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

    setText(text) {
        if(text == undefined)
            return this;

        if(text instanceof Text)
            this.text = text;
        else
            this.text = new Text(text, new Vector(this.x, this.y));

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

    static add(v1, v2) {
    	return new Vector(v1.x + v2.x, v1.y + v2.y, v1.z + v2.z);
    }

    sub(x, y, z) {
        if(x instanceof Vector)
            return this.add(x.mult(-1));

        return this.add(-x, -y, -z);
    }

    static sub(v1, v2) {
    	return new Vector(v1.x - v2.x, v1.y - v2.y, v1.z - v2.z);
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

    static dist(v1, v2) {
    	return Vector.sub(v1, v2).mag();
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

    limit(min, max) {
    	let m = this.mag();
    	if(m < min)
    		this.div(m).mult(min);
    	if(m > max)
    		this.div(m).mult(max);
    	return this;
    }


    draw(originPosition, headSize, strokeW) {
        if(originPosition != undefined)
            Vector.draw(this, this.color, originPosition, this, headSize, strokeW);
        else
            Vector.draw(this, this.color, this);
    }

    static draw(vector, color = 'rgb(255, 255, 255)', originPosition, endPosition, headSize = 5, strokeW = 1) {
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

        if(vector.text != undefined) {
            // TEXT
            let angle = vector.getAngle();
            if(angle < 0)
                angle += 2*PI;

            let xOffset = 0.8 * vector.text.cWidth;
            if(    (PI/4   < angle && angle <= PI/2  )
                || (3*PI/4 < angle && angle <= 5*PI/4)
                || (3*PI/2 < angle && angle <= 7*PI/4)
            ) xOffset *= -1;

            let yOffset = -1.1 * vector.text.desc + 1.1 * vector.text.asc;
            if(    (PI/4   < angle && angle <=   PI/2)
                || (PI/2   < angle && angle <= 3*PI/4)
                || (PI     < angle && angle <= 5*PI/4)
                || (7*PI/4 < angle && angle <=   2*PI)
            ) yOffset *= -1;

            vector.text
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
                translate(originPos2.x + xOffset - vector.text.cWidth / 2, originPos2.y + yOffset - vector.text.asc);
                line(0, 0, vector.text.cWidth, 0);

                push();
                    translate(headSize + vector.text.cWidth / 2 - 1, 0);
                    triangle(0, headSize / 4, 0, -headSize / 4, headSize / 2, 0);
                pop();
        	pop();
        }

        return this;
    }
}
