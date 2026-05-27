function setup(){
    createCanvas(1536,775);
}

function draw(){
    //black background with a light grey stroke for the circles
    background(0,0,0);
    nofill();
    stroke(0,0,95);
    strokeWeight(w(0.001));
}

const numberOfSteps = 10;

function makeCircle(numberOfSides, radius) {
    const distancePerStep = (2 * Math.Pi)/numberOfSteps; // going around the entire circle (2*Pi), and dividing into equidistant points
    const points =[];
    for (let theta = 0; theta < Math.PI * 2; theta += distancePerStep) {
    const x = 0.5 + radius * Math.cos(theta);
    const y = 0.5 + radius * Math.sin(theta);
    points.push([x, y]); //traversing the circle using maths - COS - sideways, SIN - up & down, and pushing those points into an array. trying to map these points into a polygon
  }
}
