class Rocket {
  constructor(x = 0, y = 0, z = 0, rocketFlame, planetSpread) {
    this.position = createVector(x, y, z);
    this.forward = createVector(0, 0, -1); // normal vector from cone tip
    this.speed = 50;
    this.turnSpeed = 2;
    this.size = 24;
    this.rocketFlame = rocketFlame;
    this.angle = 0;
    this.planetSpread = planetSpread;
  }

  move() {
    if (keyIsDown(68)) this.angle -= this.turnSpeed; // A left
    if (keyIsDown(65)) this.angle += this.turnSpeed; // D right

    this.forward.set(-sin(this.angle), 0, -cos(this.angle));

    if (keyIsDown(87)) {
      this.position.x += this.forward.x * this.speed; // W forward
      this.position.z += this.forward.z * this.speed;
    }
    if (keyIsDown(83)) {
      this.position.x -= this.forward.x * this.speed; // S backward
      this.position.z -= this.forward.z * this.speed;
    }

    if (keyIsDown(81)) this.position.y -= this.speed; // Q top
    if (keyIsDown(69)) this.position.y += this.speed; // E bottom

    // rocket should not fly far away
    const spread = this.planetSpread.value();
    const boundX = spread * 1.2;
    const boundY = spread * 1.2;
    const boundZ = spread * 1.2;

    this.position.x = constrain(this.position.x, -boundX, boundX);
    this.position.y = constrain(this.position.y, -boundY, boundY);
    this.position.z = constrain(this.position.z, -boundZ, boundZ);
  }

  display() {
    const cylinderHeight = 5;
    const coneHeight = 2;
    const radius = 0.6;

    push();

    translate(this.position.x, this.position.y, this.position.z);
    rotateY(this.angle);
    rotateX(90);
    noStroke();
    fill(160, 220, 255);
    cylinder(this.size * radius, this.size * cylinderHeight);

    push();
    translate(0, -this.size * 3.5, 0);
    rotateX(180);
    fill(255, 130, 50);
    cone(this.size * radius, this.size * coneHeight);
    pop();

    push();
    translate(0, this.size * 4, 0); // behind
    rotateZ(-90);
    fill(233, 165, 84);
    model(this.rocketFlame);
    pop();

    pop();
  }
}
