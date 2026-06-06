// =====================================================
// Time-based planet explosion
// My mechanic: the planet changes over time:
// normal → warning → exploding → plasma → recovering
// =====================================================

class TimeBasedPlanet {
  constructor(x, y, z, planetRadius) {
    // Save where the planet is placed in 3D space
    this.x = x;
    this.y = y;
    this.z = z;

    // Use the shared planet radius slider from the main sketch
    this.planetRadius = planetRadius;

    // The planet starts calm
    this.state = "normal";

    // These help me track how long each stage lasts
    this.stateStartTime = millis();
    this.lastTriggerTime = millis();

    // Wait 4 seconds before the planet starts reacting
    this.triggerInterval = 4000;

    // Used for the expanding explosion ring
    this.explosionRadius = 0;

    // Explosion particles will be stored here
    this.particles = [];

    // This hidden graphics layer becomes the plasma texture
    this.plasmaTexture = createGraphics(256, 256);
    this.plasmaTexture.pixelDensity(1);

    // Fix: Reproduce the independent off-screen texture layer of the first version
    this.plasmaTexture.noStroke();
  }

  getSize() {
    // Get the current planet size from the shared slider
    return this.planetRadius.value();
  }

  update() {
    let now = millis();
    let elapsed = now - this.stateStartTime;

    // After staying normal for a while, the planet enters warning mode
    if (this.state === "normal" && now - this.lastTriggerTime > this.triggerInterval) {
      this.startWarning();
    }

    // Warning is a short build-up before the explosion
    if (this.state === "warning") {
      if (elapsed > 1000) {
        this.startExplosion();
      }
    }

    // During the explosion, the ring expands and particles fly out
    else if (this.state === "exploding") {
      this.explosionRadius += 7;

      for (let particle of this.particles) {
        particle.update();
      }

      if (elapsed > 1200) {
        this.startPlasma();
      }
    }

    // Plasma stage keeps updating the animated texture
    else if (this.state === "plasma") {
      this.updatePlasmaTexture();

      if (elapsed > 2500) {
        this.startRecovery();
      }
    }

    // Recovery brings the planet back to normal
    else if (this.state === "recovering") {
      if (elapsed > 1200) {
        this.resetPlanet();
      }
    }
  }

  display() {
    push();

    // Move to this planet's position before drawing
    translate(this.x, this.y, this.z);

    // fix1
    noStroke();

    // Draw a different version of the planet depending on its current state
    if (this.state === "normal") {
      this.drawNormalPlanet();
    }

    else if (this.state === "warning") {
      this.drawWarningPlanet();
    }

    else if (this.state === "exploding") {
      this.drawExplosion();
    }

    else if (this.state === "plasma") {
      this.drawPlasmaPlanet();
    }

    else if (this.state === "recovering") {
      this.drawRecoveringPlanet();
    }

    pop();

    // Fix: After finishing painting your planet, immediately throw an empty ordinary material
    push();
    ambientMaterial(255);
    pop();
  }


  startWarning() {
    this.state = "warning";
    this.stateStartTime = millis();
  }

  startExplosion() {
    let size = this.getSize();

    this.state = "exploding";
    this.stateStartTime = millis();

    // Start the explosion ring slightly outside the planet
    this.explosionRadius = size * 1.5;

    // Rebuild the particle list each time the planet explodes
    this.particles = [];

    for (let i = 0; i < 45; i++) {
      this.particles.push(new ExplosionParticle());
    }
  }

  startPlasma() {
    this.state = "plasma";
    this.stateStartTime = millis();

    // The burst is finished, so I clear the particles
    this.particles = [];
  }

  startRecovery() {
    this.state = "recovering";
    this.stateStartTime = millis();
  }

  resetPlanet() {
    // Reset everything so the cycle can happen again
    this.state = "normal";
    this.stateStartTime = millis();
    this.lastTriggerTime = millis();

    this.explosionRadius = 0;
    this.particles = [];
  }

  drawNormalPlanet() {
    let size = this.getSize();

    push();

    // A slow rotation makes the planet feel less static
    rotateY(frameCount * 0.01);

    ambientMaterial(80, 160, 255);
    sphere(size);

    pop();
  }

  drawWarningPlanet() {
    let size = this.getSize();

    // Small random movement creates the warning shake
    let shake = 5;
    let shakeX = random(-shake, shake);
    let shakeY = random(-shake, shake);

    // Pulse the planet before it explodes
    let pulse = sin(frameCount * 0.45);
    let scaleAmount = map(pulse, -1, 1, 1.0, 1.18);

    push();

    translate(shakeX, shakeY, 0);
    scale(scaleAmount);

    // Red colour suggests danger / instability
    emissiveMaterial(255, 60, 80);
    sphere(size);

    pop();

    this.drawWarningRing(size);
  }

  drawWarningRing(size) {
    push();

    noFill();
    stroke(255, 80, 120);
    strokeWeight(3);

    // Rotate the ellipse so it reads like a ring around the planet
    rotateX(HALF_PI);
    ellipse(0, 0, size * 2.8);

    noStroke();
    pop();
  }

  drawExplosion() {
    let size = this.getSize();

    push();

    // Bright core left after the planet bursts
    emissiveMaterial(255, 90, 40);
    sphere(size * 0.65);

    pop();

    this.drawExplosionRings();

    for (let particle of this.particles) {
      particle.display();
    }
  }

  drawExplosionRings() {
    push();

    noFill();
    stroke(255, 90, 60, 200);
    strokeWeight(5);

    rotateX(HALF_PI);
    ellipse(0, 0, this.explosionRadius);

    noStroke();
    pop();

    push();

    noFill();
    stroke(255, 220, 120, 140);
    strokeWeight(3);

    // A second ring in another direction makes the explosion feel more 3D
    rotateY(HALF_PI);
    ellipse(0, 0, this.explosionRadius * 0.75);

    noStroke();
    pop();
  }

  drawPlasmaPlanet() {
    let size = this.getSize();

    //Fix3
    let elapsed = millis() - this.stateStartTime;
    let progress = constrain(elapsed / 2500, 0, 1);

    // Slight breathing motion after the explosion
    let pulse = sin(frameCount * 0.08);
    let scaleAmount = map(pulse, -1, 1, 0.98, 1.05);

    push();

    rotateY(frameCount * 0.012);
    scale(scaleAmount);

    // Use the generated texture as the planet surface
    texture(this.plasmaTexture);
    sphere(size * 1.05);

    pop();

    this.drawPlasmaGlow(size);
  }

  drawPlasmaGlow(size) {
    push();
    noFill();

    // Make the glow gently fade in and out
    let alpha = map(sin(frameCount * 0.08), -1, 1, 60, 140);

    stroke(255, 80, 180, alpha);
    strokeWeight(4);

    rotateX(HALF_PI);
    ellipse(0, 0, size * 2.7);
    pop();

    push();

    noFill();
    stroke(120, 180, 255, 80);
    strokeWeight(2);

    rotateY(HALF_PI);
    ellipse(0, 0, size * 2.4);

    pop();
  }

  updatePlasmaTexture() {
    // Edit the hidden texture pixel by pixel
    this.plasmaTexture.loadPixels();

    let t = millis() * 0.0008;

    for (let y = 0; y < this.plasmaTexture.height; y++) {
      for (let x = 0; x < this.plasmaTexture.width; x++) {
        let nx = x * 0.025;
        let ny = y * 0.025;

        // Layered noise gives the plasma a more organic surface
        let n1 = noise(nx, ny, t);
        let n2 = noise(nx * 2.2 + 20, ny * 2.2, t * 1.4);
        let n3 = noise(nx * 4.0, ny * 4.0 + 40, t * 0.8);

        let n = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

        // Make the texture stronger near the centre
        let dx = x - this.plasmaTexture.width / 2;
        let dy = y - this.plasmaTexture.height / 2;
        let d = sqrt(dx * dx + dy * dy);

        let radial = map(d, 0, this.plasmaTexture.width / 2, 1.2, 0.2);
        radial = constrain(radial, 0, 1);

        let heat = n * radial;

        // Convert the heat value into a thermal colour
        let c = this.getThermalColor(heat);

        // Each pixel has 4 values: red, green, blue, alpha
        let index = 4 * (x + y * this.plasmaTexture.width);

        this.plasmaTexture.pixels[index + 0] = red(c);
        this.plasmaTexture.pixels[index + 1] = green(c);
        this.plasmaTexture.pixels[index + 2] = blue(c);
        this.plasmaTexture.pixels[index + 3] = 255;
      }
    }

    this.plasmaTexture.updatePixels();

    // Softens the plasma so it looks less pixelated
    this.plasmaTexture.filter(BLUR, 2);
  }

  getThermalColor(v) {
    v = constrain(v, 0, 1);

    // Low heat: blue to purple
    if (v < 0.25) {
      return lerpColor(
        color(60, 120, 255),
        color(180, 120, 255),
        v / 0.25
      );
    }

    // Medium-low heat: purple to pink
    else if (v < 0.5) {
      return lerpColor(
        color(180, 120, 255),
        color(255, 60, 160),
        (v - 0.25) / 0.25
      );
    }

    // Medium-high heat: pink to orange
    else if (v < 0.75) {
      return lerpColor(
        color(255, 60, 160),
        color(255, 120, 40),
        (v - 0.5) / 0.25
      );
    }

    // High heat: orange to pale yellow
    else {
      return lerpColor(
        color(255, 120, 40),
        color(255, 230, 160),
        (v - 0.75) / 0.25
      );
    }
  }

  drawRecoveringPlanet() {
    let size = this.getSize();

    let elapsed = millis() - this.stateStartTime;

    // Progress goes from 0 to 1 during recovery
    let progress = constrain(elapsed / 1200, 0, 1);

    // The planet shrinks gently back to its normal size
    let currentSize = map(progress, 0, 1, size * 1.05, size);

    push();

    rotateY(frameCount * 0.01);
    scale(currentSize / size);

    ambientMaterial(80, 160, 255);
    sphere(size);

    pop();

    push();

    noFill();

    // The recovery ring fades out as the planet stabilises
    stroke(255, 150, 180, 100 * (1 - progress));
    strokeWeight(3);

    rotateX(HALF_PI);
    ellipse(0, 0, size * 3 * (1 - progress));

    noStroke();
    pop();
  }
}


// =====================================================
// Explosion particle
// Each particle is one small glowing piece from the explosion.
// =====================================================

class ExplosionParticle {
  constructor() {
    // Start at the centre of the planet
    this.pos = createVector(0, 0, 0);

    // Fly out in a random 3D direction
    this.vel = p5.Vector.random3D().mult(random(2, 8));

    this.size = random(3, 8);

    // Life also controls the fade-out
    this.life = 255;
  }

  update() {
    // Move outward every frame
    this.pos.add(this.vel);

    // Slowly fade out
    this.life -= 6;
  }

  display() {
    if (this.life > 0) {
      push();

      translate(this.pos.x, this.pos.y, this.pos.z);

      // Use life as alpha, so the particle disappears naturally
      emissiveMaterial(255, 160, 80, this.life);
      sphere(this.size);

      pop();
    }
  }
}