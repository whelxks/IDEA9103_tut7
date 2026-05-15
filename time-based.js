// =====================================================
// TIME-BASED PLANET EXPLOSION WITH PLASMA AFTERMATH
// p5.js only
// Visual stages:
// normal → warning → explosion → plasma planet → recovery
// =====================================================

let planet;
let plasmaTexture;

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  // Offscreen texture layer for the thermal/plasma planet surface
  plasmaTexture = createGraphics(256, 256);

  planet = createPlanet(0, 0, 0, 120);

  noStroke();
}

function draw() {
  background(15, 5, 35);

  orbitControl();

  ambientLight(90);
  pointLight(255, 180, 180, 0, -300, 400);

  updatePlanet(planet);
  drawPlanet(planet);
}

// =====================================================
// PLANET DATA MODULE
// =====================================================

function createPlanet(x, y, z, size) {
  return {
    x: x,
    y: y,
    z: z,
    size: size,

    // States:
    // normal, warning, exploding, plasma, recovering
    state: "normal",

    stateStartTime: millis(),
    lastTriggerTime: millis(),

    triggerInterval: 4000,

    explosionRadius: 0,
    particles: []
  };
}

// =====================================================
// UPDATE MODULE
// =====================================================

function updatePlanet(p) {
  let now = millis();

  // Trigger explosion every few seconds
  if (p.state === "normal" && now - p.lastTriggerTime > p.triggerInterval) {
    startWarning(p);
  }

  let elapsed = now - p.stateStartTime;

  if (p.state === "warning") {
    if (elapsed > 1000) {
      startExplosion(p);
    }
  }

  else if (p.state === "exploding") {
    p.explosionRadius += 7;

    for (let particle of p.particles) {
      updateParticle(particle);
    }

    if (elapsed > 1200) {
      startPlasma(p);
    }
  }

  else if (p.state === "plasma") {
    updatePlasmaTexture(elapsed);

    if (elapsed > 2500) {
      startRecovery(p);
    }
  }

  else if (p.state === "recovering") {
    if (elapsed > 1200) {
      resetPlanet(p);
    }
  }
}

// =====================================================
// STATE CHANGE MODULE
// =====================================================

function startWarning(p) {
  p.state = "warning";
  p.stateStartTime = millis();
}

function startExplosion(p) {
  p.state = "exploding";
  p.stateStartTime = millis();

  p.explosionRadius = p.size * 1.5;
  p.particles = createExplosionParticles(45);
}

function startPlasma(p) {
  p.state = "plasma";
  p.stateStartTime = millis();

  p.particles = [];
}

function startRecovery(p) {
  p.state = "recovering";
  p.stateStartTime = millis();
}

function resetPlanet(p) {
  p.state = "normal";
  p.stateStartTime = millis();
  p.lastTriggerTime = millis();

  p.explosionRadius = 0;
  p.particles = [];
}

// =====================================================
// DRAW MODULE
// =====================================================

function drawPlanet(p) {
  push();
  translate(p.x, p.y, p.z);

  if (p.state === "normal") {
    drawNormalPlanet(p);
  }

  else if (p.state === "warning") {
    drawWarningPlanet(p);
  }

  else if (p.state === "exploding") {
    drawExplosion(p);
  }

  else if (p.state === "plasma") {
    drawPlasmaPlanet(p);
  }

  else if (p.state === "recovering") {
    drawRecoveringPlanet(p);
  }

  pop();
}

// =====================================================
// NORMAL PLANET
// =====================================================

function drawNormalPlanet(p) {
  push();

  rotateY(frameCount * 0.01);

  ambientMaterial(80, 160, 255);
  sphere(p.size);

  pop();
}

// =====================================================
// WARNING STAGE
// =====================================================

function drawWarningPlanet(p) {
  let shake = 5;

  let shakeX = random(-shake, shake);
  let shakeY = random(-shake, shake);

  let pulse = sin(frameCount * 0.45);
  let scaleAmount = map(pulse, -1, 1, 1.0, 1.18);

  push();

  translate(shakeX, shakeY, 0);
  scale(scaleAmount);

  emissiveMaterial(255, 60, 80);
  sphere(p.size);

  pop();

  drawWarningRing(p);
}

function drawWarningRing(p) {
  push();

  noFill();
  stroke(255, 80, 120);
  strokeWeight(3);
  rotateX(HALF_PI);
  ellipse(0, 0, p.size * 2.8);

  pop();
}

// =====================================================
// EXPLOSION STAGE
// =====================================================

function drawExplosion(p) {
  // Bright planet core
  push();

  emissiveMaterial(255, 90, 40);
  sphere(p.size * 0.65);

  pop();

  drawExplosionRings(p);
  drawParticles(p.particles);
}

function drawExplosionRings(p) {
  push();

  noFill();
  stroke(255, 90, 60, 200);
  strokeWeight(5);
  rotateX(HALF_PI);
  ellipse(0, 0, p.explosionRadius);

  pop();

  push();

  noFill();
  stroke(255, 220, 120, 140);
  strokeWeight(3);
  rotateY(HALF_PI);
  ellipse(0, 0, p.explosionRadius * 0.75);

  pop();
}

// =====================================================
// PLASMA PLANET STAGE
// This is the part similar to your reference image.
// It creates a thermal / organic / blurred planet surface.
// =====================================================

function drawPlasmaPlanet(p) {
  let elapsed = millis() - p.stateStartTime;
  let progress = constrain(elapsed / 2500, 0, 1);

  // Slight breathing size after explosion
  let pulse = sin(frameCount * 0.08);
  let scaleAmount = map(pulse, -1, 1, 0.98, 1.05);

  push();

  rotateY(frameCount * 0.012);
  scale(scaleAmount);

  texture(plasmaTexture);
  sphere(p.size * 1.05);

  pop();

  // Soft glow around the plasma planet
  drawPlasmaGlow(p, progress);
}

function drawPlasmaGlow(p, progress) {
  push();

  noFill();

  let alpha = map(sin(frameCount * 0.08), -1, 1, 60, 140);

  stroke(255, 80, 180, alpha);
  strokeWeight(4);

  rotateX(HALF_PI);
  ellipse(0, 0, p.size * 2.7);

  pop();

  push();

  noFill();
  stroke(120, 180, 255, 80);
  strokeWeight(2);

  rotateY(HALF_PI);
  ellipse(0, 0, p.size * 2.4);

  pop();
}

// =====================================================
// PLASMA TEXTURE MODULE
// Generates the heat-map / blurred / organic surface.
// =====================================================

function updatePlasmaTexture(elapsed) {
  plasmaTexture.pixelDensity(1);
  plasmaTexture.loadPixels();

  let t = millis() * 0.0008;

  for (let y = 0; y < plasmaTexture.height; y++) {
    for (let x = 0; x < plasmaTexture.width; x++) {
      let nx = x * 0.025;
      let ny = y * 0.025;

      // Layered noise for organic thermal movement
      let n1 = noise(nx, ny, t);
      let n2 = noise(nx * 2.2 + 20, ny * 2.2, t * 1.4);
      let n3 = noise(nx * 4.0, ny * 4.0 + 40, t * 0.8);

      let n = n1 * 0.55 + n2 * 0.3 + n3 * 0.15;

      // Distance from center creates a circular planet-like texture
      let dx = x - plasmaTexture.width / 2;
      let dy = y - plasmaTexture.height / 2;
      let d = sqrt(dx * dx + dy * dy);
      let radial = map(d, 0, plasmaTexture.width / 2, 1.2, 0.2);
      radial = constrain(radial, 0, 1);

      let heat = n * radial;

      let c = getThermalColor(heat);

      let index = 4 * (x + y * plasmaTexture.width);

      plasmaTexture.pixels[index + 0] = red(c);
      plasmaTexture.pixels[index + 1] = green(c);
      plasmaTexture.pixels[index + 2] = blue(c);
      plasmaTexture.pixels[index + 3] = 255;
    }
  }

  plasmaTexture.updatePixels();

  // Blur makes it closer to your reference image
  plasmaTexture.filter(BLUR, 2);
}

// =====================================================
// THERMAL COLOUR MODULE
// Similar to heat-map colours:
// blue → pink → orange → red → pale yellow
// =====================================================

function getThermalColor(v) {
  v = constrain(v, 0, 1);

  if (v < 0.25) {
    return lerpColor(
      color(60, 120, 255),
      color(180, 120, 255),
      v / 0.25
    );
  }

  else if (v < 0.5) {
    return lerpColor(
      color(180, 120, 255),
      color(255, 60, 160),
      (v - 0.25) / 0.25
    );
  }

  else if (v < 0.75) {
    return lerpColor(
      color(255, 60, 160),
      color(255, 120, 40),
      (v - 0.5) / 0.25
    );
  }

  else {
    return lerpColor(
      color(255, 120, 40),
      color(255, 230, 160),
      (v - 0.75) / 0.25
    );
  }
}

// =====================================================
// RECOVERY STAGE
// =====================================================

function drawRecoveringPlanet(p) {
  let elapsed = millis() - p.stateStartTime;
  let progress = constrain(elapsed / 1200, 0, 1);

  let currentSize = map(progress, 0, 1, p.size * 1.05, p.size);

  push();

  rotateY(frameCount * 0.01);
  scale(currentSize / p.size);

  // Blend back to normal blue planet
  ambientMaterial(80, 160, 255);
  sphere(p.size);

  pop();

  push();

  noFill();
  stroke(255, 150, 180, 100 * (1 - progress));
  strokeWeight(3);
  rotateX(HALF_PI);
  ellipse(0, 0, p.size * 3 * (1 - progress));

  pop();
}

// =====================================================
// PARTICLE MODULE
// =====================================================

function createExplosionParticles(amount) {
  let particles = [];

  for (let i = 0; i < amount; i++) {
    particles.push({
      pos: createVector(0, 0, 0),
      vel: p5.Vector.random3D().mult(random(2, 8)),
      size: random(3, 8),
      life: 255
    });
  }

  return particles;
}

function updateParticle(particle) {
  particle.pos.add(particle.vel);
  particle.life -= 6;
}

function drawParticles(particles) {
  for (let particle of particles) {
    if (particle.life > 0) {
      push();

      translate(particle.pos.x, particle.pos.y, particle.pos.z);

      emissiveMaterial(255, 160, 80, particle.life);
      sphere(particle.size);

      pop();
    }
  }
}

// =====================================================
// RESPONSIVE CANVAS
// =====================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}