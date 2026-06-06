class PerlinNoise {
  constructor() {
    this.circles = [];
    for (let radius = 0.5; radius < 20; radius += 0.4) {
      const circle = this.makeCircle(15, radius);
      this.circles.push(circle);
    }

    this.noiseOffsets = this.circles.map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      z: Math.random() * 100,
    }));
  }

  //fallback for when it's called with no argument
  w(val) {
    //converts the units (0-1) into pixels for the canvas size
    if (val == null) return width;
    return val * width;
  }

  h(val) {
    if (val == null) return height;
    return val * height;
  }

  makeCircle(numberOfSides, radius) {
    const points = [];
    const distancePerStep = (Math.PI * 2) / numberOfSides; // going around the entire circle (2*Pi), and dividing into equidistant points

    for (let theta = 0; theta < Math.PI * 2; theta += distancePerStep) {
      const x = 0.5 + radius * Math.cos(theta); //(0.5,0.5) is the center of the circle
      const y = 0.5 + radius * Math.sin(theta);
      points.push([x, y, 0]); //traversing the circle using trigonometry - COS - sideways, SIN - up & down, and pushing those points into an array. trying to map these points into a polygon
    }

    return points;
  }

  // rotate a [x, y, z] point
  applyTilt(point, ringIndex) {
    const driftSpeed = 300; // increase to slow down
    const t = frameCount / driftSpeed;
    const o = this.noiseOffsets[ringIndex];

    // each axis independent wobble
    const tx = (noise(o.x, t) - 0.5) * Math.PI * 1.2;
    const ty = (noise(o.y, t) - 0.5) * Math.PI * 1.2;
    const tz = noise(o.z, t) * Math.PI * 2;

    let [x, y, z] = point;

    let y1 = y * Math.cos(tx) - z * Math.sin(tx);
    let z1 = y * Math.sin(tx) + z * Math.cos(tx);

    let x2 = x * Math.cos(ty) + z1 * Math.sin(ty);
    let z2 = -x * Math.sin(ty) + z1 * Math.cos(ty);

    let x3 = x2 * Math.cos(tz) - y1 * Math.sin(tz);
    let y3 = x2 * Math.sin(tz) + y1 * Math.cos(tz);

    return [x3, y3, z2];
  }

  //a distortion of the points
  distortPolygon(polygon, ringIndex) {
    return polygon.map((point) => {
      const [px, py, pz] = this.applyTilt(point, ringIndex);
      const distance = Math.sqrt(px * px + py * py + pz * pz);

      const z = frameCount / 100; //animates the shape
      const z2 = frameCount / 200;

      const noiseFn = (x, y) => {
        //shifting the coordinates because otherwise the noise function will become 0 when x or y are whole numbers
        const noiseX = (x + 0.31) * distance * 4 + z2;
        const noiseY = (y - 1.73) * distance * 4 + z2;
        return noise(noiseX, noiseY, z);
      };

      const thetaXY = noiseFn(px, py) * Math.PI * 3;
      const thetaZ =
        noise(
          (px + 0.31) * distance * 4 + z2 + 7.3,
          (py - 1.73) * distance * 4 + z2 + 3.1,
          z,
        ) *
        Math.PI *
        2;

      const amountToNudge = 0.09 - Math.cos(frameCount / 100) * 0.08; //the amount oscillates over time - near 0 means perfect circles, further away is distorted. the amount is never negative
      return [
        px + amountToNudge * Math.cos(thetaXY) * Math.cos(thetaZ),
        py + amountToNudge * Math.sin(thetaXY) * Math.cos(thetaZ),
        pz + amountToNudge * Math.sin(thetaZ),
      ];
    });
  }

  //taken from https://observablehq.com/@pamacha/chaikins-algorithm
  //a recursive subdivision function - it slices off the corner of a polygon and repeats until the curve is smooth

  chaikin(arr, num) {
    if (num === 0) return arr;
    const l = arr.length;
    const smooth = arr
      .map((c, i) => {
        return [
          [
            0.75 * c[0] + 0.25 * arr[(i + 1) % l][0],
            0.75 * c[1] + 0.25 * arr[(i + 1) % l][1],
            0.75 * c[2] + 0.25 * arr[(i + 1) % l][2],
          ],
          [
            0.25 * c[0] + 0.75 * arr[(i + 1) % l][0],
            0.25 * c[1] + 0.75 * arr[(i + 1) % l][1],
            0.25 * c[2] + 0.75 * arr[(i + 1) % l][2],
          ],
        ];
      })
      .flat();
    return num === 1 ? smooth : this.chaikin(smooth, num - 1);
  }

  backgroundCircles() {
    //black background with a light grey stroke for the circles
    background(0, 0, 0);
    noFill();
    stroke(255, 255, 255);
    strokeWeight(this.w(0.001));

    let j = 0;

    for (let radius = 1; radius < 10; radius += 1) {
      const distortedCircle = this.distortPolygon(this.circles[j], j);
      const smoothCircle = this.chaikin(distortedCircle, 4);

      strokeWeight(j * 0.5); //each circle gets a thicker stroke

      j++;
      beginShape();

      smoothCircle.forEach((point) => {
        vertex(this.w(point[0]), this.h(point[1]), point[2] * width); //makeCircle takes points in units between (0,1), which then get scaled into actual pixels on the canvas
      });
      endShape(CLOSE); // connects the last point back to the first point
      //creates a polygon for each pass of the for loop, therefore it creates multiple concentric polygons
    }
  }
}
