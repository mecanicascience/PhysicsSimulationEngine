
class pSObject {
   constructor(x0, y0, v0) {
      this.pos = new Vector(x0, y0);
      this.vel = new Vector(v0, 0);
      this.bounceCount = 0;
      this.color = { r: Math.round(Math.random() * 255),
                     g: Math.round(Math.random() * 255),
                     b: Math.round(Math.random() * 255)}
   }

   update(dt) {
      this.pos.add((this.vel.copy()).mult(dt));

      //If the balls are out of the bounds, then they bounce
      if (this.pos.x > _pSimulationInstance.getEngineConfig().plotter.scale.x || this.pos.x < -_pSimulationInstance.getEngineConfig().plotter.scale.x) {
        this.vel.x = -this.vel.x;

        //While bounceCount < 3, the balls bounce in a random direction
        if(this.bounceCount < 3) {
          this.vel.y = Math.round(Math.random() * 100);
        }

        this.bounceCount++;
      }

      if(this.pos.y > _pSimulationInstance.getEngineConfig().plotter.scale.y || this.pos.y < -_pSimulationInstance.getEngineConfig().plotter.scale.y) {
        if(this.bounceCount < 3) {
          this.vel.x = Math.round(Math.random() * 100);
        }

        this.vel.y = -this.vel.y;

        this.bounceCount++;
      }
   }

   draw(drawer) {
      drawer.noStroke().fill(this.color.r, this.color.g, this.color.b).ellipse(this.pos.x, this.pos.y, 5, 5);
   }
}
