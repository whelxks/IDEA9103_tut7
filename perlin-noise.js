class PerlinNoise {

  constructor() {
    this.circles = [];
    for (let radius = 0.5; radius < 20; radius += 0.4) {
     const circle = this.makeCircle(15, radius);
     this.circles.push(circle);
  }  
  }

//fallback for when it's called with no argument
 w(val) { //converts the units (0-1) into pixels for the canvas size
  if (val == null)
    return width;
  return val * width;
}

 h(val) {
  if (val == null)
    return height;
  return val * height;
}

 makeCircle(numberOfSides, radius) {
  const points = [];
  const distancePerStep = (Math.PI * 2) / numberOfSides; // going around the entire circle (2*Pi), and dividing into equidistant points

  for (let theta = 0; theta < Math.PI * 2; theta += distancePerStep) {
    const x = 0.5 + radius * Math.cos(theta); //(0.5,0.5) is the center of the circle
    const y = 0.5 + radius * Math.sin(theta);
    points.push([x, y]); //traversing the circle using trigonometry - COS - sideways, SIN - up & down, and pushing those points into an array. trying to map these points into a polygon
  }

  return points;
}
//a distortion of the points
 distortPolygon(polygon) {
  return polygon.map(point => {
      const x = point[0];
      const y = point[1];
      const distance = dist(0.5, 0.5, x, y);

      const z = frameCount / 100; //animates the shape
      const z2 = frameCount / 200;

      const noiseFn = (x, y) => {

        //shifting the coordinates because otherwise the noise function will become 0 when x or y are whole numbers
        const noiseX = (x + 0.31) * distance * 4 + z2;
        const noiseY = (y - 1.73) * distance * 4 + z2;
        return noise(noiseX, noiseY, z);
      }

      const theta = noiseFn(x, y) * Math.PI * 3; //mapping the output of the noise function to an angle. If it's 2Pi, it means the noise rotates along one circle. 3Pi means 1.5 circles.

      const amountToNudge = 0.09 - (Math.cos(frameCount / 100) * 0.08); //the amount oscillates over time - near 0 means perfect circles, further away is distorted. the amount is never negative
      const newX = x + (amountToNudge * Math.cos(theta)); //nudge each vertex of the polygon to a new point based on the angle
      const newY = y + (amountToNudge * Math.sin(theta));

      return [newX, newY];
  });
}

//taken from https://observablehq.com/@pamacha/chaikins-algorithm 
//a recursive subdivision function - it slices off the corner of a polygon and repeats until the curve is smooth

 chaikin(arr, num) {
  if (num === 0) return arr;
  const l = arr.length;
  const smooth = arr.map((c,i) => {
    return [
      [0.75*c[0] + 0.25*arr[(i + 1)%l][0],0.75*c[1] + 0.25*arr[(i + 1)%l][1]],
      [0.25*c[0] + 0.75*arr[(i + 1)%l][0],0.25*c[1] + 0.75*arr[(i + 1)%l][1]]
    ];
  }).flat();
  return num === 1 ? smooth : this.chaikin(smooth, num - 1);
}

 backgroundCircles() {
  //black background with a light grey stroke for the circles
  background(0, 0, 0);  
  noFill();             
  stroke(255, 255, 255);     
  strokeWeight(this.w(0.001)); 

  let j=0;

  for (let radius = 0.5; radius < 20; radius += 0.4) {
    const distortedCircle = this.distortPolygon(this.circles[j]);
    const smoothCircle = this.chaikin(distortedCircle, 4);

    strokeWeight(j * 0.5); //each circle gets a thicker stroke

    j++;
    beginShape();

    smoothCircle.forEach(point => { 
      vertex(this.w(point[0]), this.h(point[1])); //makeCircle takes points in units between (0,1), which then get scaled into actual pixels on the canvas
    });
    endShape(CLOSE); // connects the last point back to the first point
    //creates a polygon for each pass of the for loop, therefore it creates multiple concentric polygons
  }
}
}