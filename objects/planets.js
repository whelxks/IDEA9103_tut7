class Planets {
  constructor(texture, planetSpread, planetRadius) {
    this.texture = texture;
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
    const spread = this.planetSpread.value();
    const radius = this.planetRadius.value();

    if (spread !== this.lastSpread || radius !== this.lastRadius) {
      this.planets = [];
      this.computeCenters(spread);
      this.lastSpread = spread;
      this.lastRadius = radius; // ← here
    }

    for (let p of this.planets) {
      // distance from rocket to planet center
      p.d = dist(
        rocketPosition.x,
        rocketPosition.y,
        rocketPosition.z,
        p.x,
        p.y,
        p.z,
      );
    }

    let min_d = Math.min(...this.planets.map((p) => p.d));
    let max_d = Math.max(...this.planets.map((p) => p.d));

    for (let p of this.planets) {
      let proximity = constrain(map(p.d, max_d, min_d, 0, 1), 0, 1); // 0 = far away, 1 = right on top of planet

      push();
      rotateZ(p.zAngle);
      rotateX(p.xAngle);
      translate(0, spread, 0);

      texture(this.texture);
      sphere(p.r, 8, 6); // reduce subdivisions so it doesnt lag

      // TODO: remove later - test yellow color
      // resetShader();
      // noStroke();
      // fill(220, 255, 0, proximity * 100);

      resetShader();
      ambientLight(255);
      emissiveMaterial(220 * proximity, 255 * proximity, 0);
      sphere(p.r, 8, 6);

      pop();
    }
  }

  // TODO: remove later - for debugging purposes
  drawCenters() {
    push();
    noStroke();
    fill(255, 0, 0);
    for (let p of this.planets) {
      push();
      translate(p.x, p.y, p.z);
      sphere(4);
      pop();
    }
    pop();
  }
}
