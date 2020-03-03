class NBody {
    /** Object creation */
    constructor(mass, x0, y0, vx0, vy0, color, name) {
        this.mass = mass;                  // object mass
        this.pos = new Vector(x0, y0);     // initial object position
        this.vel = new Vector(vx0, vy0);   // initial object velocity
        this.acc = new Vector(0, 0);       // no initial acceleration
        // Random [R, G, B] colo
        this.color = color;

        this.name = name;
        this.path = [];
    }


    /** Called x times / sec
    * @param dt Time passed since last update
    * @param everyObjects List of every object in the simulation */
    update(dt, everyObjects) {
        this.calculNextAcc(dt, everyObjects);
        this.pos.add(Vector.mult(this.vel, dt)).add(Vector.mult(this.acc, dt*dt / 2));

        this.accCopy = this.acc.copy();
        this.calculNextAcc(dt, everyObjects);

        this.vel.add(Vector.add(this.accCopy, this.acc).mult(dt / 2));
    }

    /** Computes next acceleration at t = t+dt */
    calculNextAcc(dt, everyObjects) {
        let G = 6.67430E-11; // Gravitational constant
        this.acc.set(0, 0);  // Delete last acceleration

        for(let i = 0; i < everyObjects.length; i++) {
            if(everyObjects[i] == this)
                continue;

            // Acceleration for each body
            let vectDirection = Vector.sub (this.pos , everyObjects[i].pos);
            let distance      = Vector.dist(this.pos, everyObjects[i].pos);

            this.acc.add(vectDirection).mult(-G * everyObjects[i].mass).div(distance ** 3);
        }
    }


    /** Called 60 times / sec */
    draw(drawer) {
        let r = 12;

        drawer
            .noFill()
            .stroke(this.color[0], this.color[1], this.color[2]);

        if(this.name != "Sun") {
            r = 6;

            // Draw orbits
            if((new Date()).getTime() % 1 == 0)
                this.path[this.path.length] = [this.pos.x, this.pos.y];

            for (let i = 1; i < this.path.length; i++)
                drawer.line(this.path[i - 1][0], this.path[i - 1][1], this.path[i][0], this.path[i][1]);

            if(this.path.length > 230)
                this.path.shift();
        }

        drawer
            .noStroke()
            .fill(this.color[0], this.color[1], this.color[2])
            .ellipse(this.pos.x, this.pos.y, r, r);
    }
}
