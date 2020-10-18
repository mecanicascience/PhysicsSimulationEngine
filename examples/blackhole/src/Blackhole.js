class Blackhole {
   constructor(x, y, m) {
      this.pos = new Vector(x, y);
      this.mass = m;

      let G = 6.67 * 10**(-11);
      let c = 3 * 10**8;
      this.rs = (2 * G * m) / (c * c);
   }

   update(dt) {

   }

   draw(drawer) {
      drawer
          .noStroke()
          .fill(255, 255, 255)
          .circle(this.pos.x, this.pos.y, this.rs)
          .noFill()
          .stroke(100)
          .strokeWeight(5)
          .circle(this.pos.x, this.pos.y, 3 * this.rs)
   }
}
