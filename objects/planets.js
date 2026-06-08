class Planets {
  constructor(planetTextures, planetSpread, planetRadius) {
    this.planetTextures = planetTextures;
    this.planetSpread = planetSpread;
    this.planetRadius = planetRadius;
    this.planets = []; // store planet position
    this.lastSpread = null; // cache tracker
    this.lastRadius = null; // cache tracker
  }

  computeCenters(spread) {
    const radius = this.planetRadius.value();

    for (let zAngle = 0; zAngle < 180; zAngle += 30) {
      for (let xAngle = 0; xAngle < 360; xAngle += 30) {
        // TODO: i can also use perlin noise for dynamic radius and dynamic rotations
        let r = map(sin(zAngle), 0, 1, radius - 10, radius + 10); // dynamic radius

        let ay = spread * cos(xAngle);
        let az = spread * sin(xAngle);

        let wx = -ay * sin(zAngle);
        let wy = ay * cos(zAngle);
        let wz = az;

        this.planets.push({
          x: wx,
          y: wy,
          z: wz,
          r,
          zAngle,
          xAngle,
        });
      }
    }
  }

  display(rocketPosition) {
  noStroke();

  const spread = this.planetSpread.value();
  const radius = this.planetRadius.value();

  if (spread !== this.lastSpread || radius !== this.lastRadius) {
    this.planets = [];
    this.computeCenters(spread);
    this.lastSpread = spread;
    this.lastRadius = radius;
  }

  for (let p of this.planets) {
    p.d = dist(
      rocketPosition.x,
      rocketPosition.y,
      rocketPosition.z,
      p.x,
      p.y,
      p.z
    );
  }

  let min_d = Math.min(...this.planets.map((p) => p.d));
  let max_d = Math.max(...this.planets.map((p) => p.d));

  for (let [i, p] of this.planets.entries()) {
    let proximity = constrain(map(p.d, max_d, min_d, 0, 1), 0, 1);

    // -------------------------------------
    // Audio values
    // -------------------------------------
    let audioWobble = getAudioWobble(i);
    let audioPulse = getAudioPulse();
    let audioGlowBoost = getAudioGlowBoost();

    push();

    rotateZ(p.zAngle);
    rotateX(p.xAngle);

    // Original planet position + audio wobble
    translate(
      audioWobble.x,
      spread + audioWobble.y,
      audioWobble.z
    );

    // Audio controls planet scale
    scale(audioPulse);

    // Original planet texture
    texture(this.planetTextures[i % this.planetTextures.length]);
    sphere(p.r, 8, 6);

    // -------------------------------------
    // Proximity glow + audio glow
    // -------------------------------------
    resetShader();
    ambientLight(255);

    let alpha = map(proximity, 0, 1, 30, 200);

    let audioGlow = audioGlowBoost;
    let glowR = constrain(220 * proximity + audioGlow, 0, 255);
    let glowG = constrain(255 * proximity + audioGlow, 0, 255);
    let glowB = constrain(audioGlow * 0.8, 0, 255);

    emissiveMaterial(glowR, glowG, glowB, alpha);
    sphere(p.r, 8, 6);

    pop();
    getAudioWobble(i)
  }
}
}