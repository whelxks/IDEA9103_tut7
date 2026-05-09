let planetTexture;

function preload() {
  planetTexture = loadImage("assets/mars_texture.jpg"); // TODO: have different textures for planets https://www.solarsystemscope.com/textures/
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  strokeWeight(0);
  noFill();
  stroke(32, 8, 64);
  describe(
    "Users can click on the screen and drag to adjust their perspective in 3D space. The space contains a sphere of dark purple cubes on a light pink background.",
  );
}

function draw() {
  background(0, 0, 0);

  orbitControl();

  for (let zAngle = 0; zAngle < 180; zAngle += 30) {
    for (let xAngle = 0; xAngle < 360; xAngle += 30) {
      push();

      rotateZ(zAngle);
      rotateX(xAngle);

      translate(0, 400, 0);
      texture(planetTexture);

      let r = map(sin(zAngle), 0, 1, 20, 40);
      sphere(r); // dynamic radius
      pop();
    }
  }
}
