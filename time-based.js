/*
AI acknowledgement:
ChatGPT was used to help translate reference images and written effect descriptions
into an OOP p5.js time-based mechanic. The code was reviewed, edited, and tested
before use.

Outside-course reference note:
The parts checked with the official p5.js reference are:
- p5.Vector.random3D(): creates a random 3D direction.
  Source: https://p5js.org/reference/p5.Vector/random3D/
- sphere(): draws a 3D sphere in WEBGL.
  Source: https://p5js.org/reference/p5/sphere/
*/

// Manages multiple time-based particle planets.
// Each planet has its own position, size, and explosion timing.
class TimeBasedPlanetSystem {
  constructor(amount, planetRadius) {
    this.planets = [];

    // Connects this system to the shared planet radius slider.
    this.planetRadius = planetRadius;

    this.createPlanets(amount);
  }

  createPlanets(amount) {
    for (let i = 0; i < amount; i++) {
      // Random 3D position for each particle planet.
      let x = random(-650, 650);
      let y = random(-350, 350);
      let z = random(-650, 150);

      let particleCount = 180;

      // Different timing makes the explosions feel less repetitive.
      let cycleInterval = random(3500, 7000);

      // Staggers the first explosion so planets do not all explode together.
      let startDelay = random(0, 5000);

      // Keeps variation while still using the shared radius slider.
      let radiusScale = random(0.35, 0.85);

      let newPlanet = new TimeBasedPlanet(
        x,
        y,
        z,
        this.planetRadius,
        particleCount,
        cycleInterval,
        startDelay,
        radiusScale
      );

      this.planets.push(newPlanet);
    }
  }

  update() {
    for (let planet of this.planets) {
      planet.update();
    }
  }

  display() {
    for (let planet of this.planets) {
      planet.display();
    }
  }
}

class TimeBasedPlanet {
  constructor(
    x,
    y,
    z,
    planetRadius,
    particleCount = 260,
    cycleInterval = 3500,
    startDelay = 0,
    radiusScale = 1
  ) {
    // Position in 3D space.
    this.x = x;
    this.y = y;
    this.z = z;

    this.planetRadius = planetRadius;
    this.radiusScale = radiusScale;

    this.particleCount = particleCount;
    this.particles = [];

    // Current stage of the timed cycle.
    this.state = "forming";

    // Tracks when the current state began.
    this.stateStartTime = millis();

    // Adds a delay before the first explosion cycle.
    this.lastCycleTime = millis() + startDelay;

    this.cycleInterval = cycleInterval;

    // Offset values used during the warning shake.
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.shakeOffsetZ = 0;

    this.createParticles();
  }

  getRadius() {
    // Keeps the effect connected to the shared planet radius slider.
    return this.planetRadius.value() * this.radiusScale;
  }

  createParticles() {
    this.particles = [];

    for (let i = 0; i < this.particleCount; i++) {
      this.particles.push(new PlanetExplosionParticle());
    }
  }

  update() {
    let now = millis();

    // Controls how long the planet stays in the current state.
    let elapsed = now - this.stateStartTime;

    // Timed sequence: forming -> shaking -> exploding -> scattered -> reforming.
    if (this.state === "forming") {
      this.updateFormingState();

      if (now - this.lastCycleTime > this.cycleInterval) {
        this.startShaking();
      }
    } else if (this.state === "shaking") {
      this.updateShakingState();

      if (elapsed > 800) {
        this.startExplosion();
      }
    } else if (this.state === "exploding") {
      this.updateExplodingState();

      if (elapsed > 1200) {
        this.startScattered();
      }
    } else if (this.state === "scattered") {
      this.updateScatteredState();

      if (elapsed > 1000) {
        this.startReforming();
      }
    } else if (this.state === "reforming") {
      this.updateReformingState();

      if (elapsed > 1400) {
        this.resetToForming();
      }
    }
  }

  display() {
    push();

    translate(
      this.x + this.shakeOffsetX,
      this.y + this.shakeOffsetY,
      this.z + this.shakeOffsetZ
    );

    noStroke();

    this.drawPlanetGlow();
    this.drawParticles();

    pop();
  }

  updateFormingState() {
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.shakeOffsetZ = 0;

    let radius = this.getRadius();

    for (let particle of this.particles) {
      particle.updateHomePosition(radius);

      // Subtle drift stops the planet from looking completely static.
      let driftX = sin(frameCount * 0.02 + particle.home.x * 0.05) * 0.4;
      let driftY = cos(frameCount * 0.02 + particle.home.y * 0.05) * 0.4;
      let driftZ = sin(frameCount * 0.015 + particle.home.z * 0.05) * 0.4;

      let target = p5.Vector.add(
        particle.home,
        createVector(driftX, driftY, driftZ)
      );

      // Pulls each particle back toward its home position.
      let toHome = p5.Vector.sub(target, particle.pos);
      toHome.mult(0.08);

      particle.vel.add(toHome);
      particle.vel.mult(0.82);
      particle.pos.add(particle.vel);

      particle.life = 255;
    }
  }

  updateShakingState() {
    // Warning shake before the explosion event.
    this.shakeOffsetX = random(-4, 4);
    this.shakeOffsetY = random(-4, 4);
    this.shakeOffsetZ = random(-4, 4);

    let radius = this.getRadius();

    for (let particle of this.particles) {
      particle.updateHomePosition(radius);

      let toHome = p5.Vector.sub(particle.home, particle.pos);
      toHome.mult(0.06);

      particle.vel.add(toHome);
      particle.vel.mult(0.85);
      particle.pos.add(particle.vel);
    }
  }

  updateExplodingState() {
    this.shakeOffsetX = 0;
    this.shakeOffsetY = 0;
    this.shakeOffsetZ = 0;

    for (let particle of this.particles) {
      particle.pos.add(particle.vel);
      particle.vel.mult(0.99);
      particle.life -= 2;
    }
  }

  updateScatteredState() {
    for (let particle of this.particles) {
      particle.pos.add(particle.vel);
      particle.vel.mult(0.985);
      particle.life -= 1.5;
    }
  }

  updateReformingState() {
    let radius = this.getRadius();

    for (let particle of this.particles) {
      particle.updateHomePosition(radius);

      // Pulls scattered particles back into the planet shape.
      let toHome = p5.Vector.sub(particle.home, particle.pos);
      toHome.mult(0.04);

      particle.vel.add(toHome);
      particle.vel.mult(0.9);
      particle.pos.add(particle.vel);

      particle.life += 3;
      particle.life = constrain(particle.life, 0, 255);
    }
  }

  startShaking() {
    this.state = "shaking";
    this.stateStartTime = millis();
  }

  startExplosion() {
    this.state = "exploding";
    this.stateStartTime = millis();

    for (let particle of this.particles) {
      let dir = particle.pos.copy();

      if (dir.mag() < 0.01) {
        // Outside course: random3D() gives a random 3D direction when the centre direction is unclear.
        dir = p5.Vector.random3D();
      } else {
        dir.normalize();
      }

      // Outside course: random3D() adds uneven 3D spread so the burst does not look too perfect.
      let randomSpread = p5.Vector.random3D().mult(random(0.5, 2.5));
      let outward = dir.mult(random(3, 8)).add(randomSpread);

      particle.vel = outward;
    }
  }

  startScattered() {
    this.state = "scattered";
    this.stateStartTime = millis();
  }

  startReforming() {
    this.state = "reforming";
    this.stateStartTime = millis();
  }

  resetToForming() {
    this.state = "forming";
    this.stateStartTime = millis();
    this.lastCycleTime = millis();
  }

  drawPlanetGlow() {
    let radius = this.getRadius();

    if (this.state === "forming" || this.state === "shaking") {
      push();
      noFill();
      stroke(90, 130, 255, 80);
      strokeWeight(2);

      // Rotates the glow ring so it sits around the 3D particle planet.
      rotateX(HALF_PI);
      ellipse(0, 0, radius * 2.4);
      pop();

      push();
      noFill();
      stroke(255, 220, 180, 55);
      strokeWeight(2);

      // Rotates the second glow ring in a different direction for depth.
      rotateY(HALF_PI);
      ellipse(0, 0, radius * 1.8);
      pop();
    }

    if (this.state === "exploding") {
      push();
      noFill();
      stroke(255, 160, 90, 130);
      strokeWeight(4);

      // Larger ring makes the explosion state easier to read.
      rotateX(HALF_PI);
      ellipse(0, 0, radius * 2.8);
      pop();

      push();
      noFill();
      stroke(255, 80, 60, 90);
      strokeWeight(3);

      // Second explosion ring adds a stronger 3D burst feeling.
      rotateY(HALF_PI);
      ellipse(0, 0, radius * 3.4);
      pop();
    }
  }

  drawParticles() {
    for (let particle of this.particles) {
      particle.display();
    }
  }
}

class PlanetExplosionParticle {
  constructor() {
    // Outside course: random3D() helps place particles inside a 3D planet shape.
    this.homeUnit = p5.Vector.random3D().mult(pow(random(), 1 / 3));

    this.home = createVector(0, 0, 0);
    this.pos = createVector(0, 0, 0);
    this.vel = createVector(0, 0, 0);

    this.size = random(2, 5);
    this.life = 255;

    this.col = this.randomPlanetColor();
  }

  updateHomePosition(radius) {
    this.home = p5.Vector.mult(this.homeUnit, radius);

    if (this.pos.mag() === 0) {
      this.pos = this.home.copy();
    }
  }

  randomPlanetColor() {
    let palette = [
      color(245, 235, 220),
      color(215, 200, 185),
      color(234, 120, 78),
      color(112, 145, 235),
      color(70, 90, 160),
      color(155, 110, 90)
    ];

    return random(palette);
  }

  display() {
    if (this.life <= 0) {
      return;
    }

    push();

    translate(this.pos.x, this.pos.y, this.pos.z);

    fill(red(this.col), green(this.col), blue(this.col), this.life);

    // Outside course: sphere() draws each particle as a small 3D WEBGL shape.
    sphere(this.size, 5, 4);

    pop();
  }
}