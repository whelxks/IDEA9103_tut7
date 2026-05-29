let planetSpread;
let planetTexture;
let planets;
let rocketFlame;
let rocket;

function preload() {
  planetTexture = loadImage("assets/planet_textures/mars_texture.jpg"); // TODO: have different textures for planets https://www.solarsystemscope.com/textures/
  rocketFlame = loadModel("assets/models/rocket_flame.obj", true); // true = normalize size
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  //strokeWeight(0);
  noFill();
  //stroke(32, 8, 64);
  describe(
    "Users can click on the screen and drag to adjust their perspective in 3D space. The space contains a sphere of dark purple cubes on a light pink background.",
  );
orbits = new PerlinNoise();
  planetSpread = new PlanetSpreadSlider();
  planetRadius = new PlanetRadiusSlider();
  planets = new Planets(planetTexture, planetSpread, planetRadius);
  rocket = new Rocket(0, 0, 0, rocketFlame, planetSpread);
  //orbits = new PerlinNoise();
}

function draw() {
  background(0, 0, 0);
  orbits.backgroundCircles();
  //stroke(255, 255, 255);   
 // strokeWeight(0.001);    
  orbitControl();
  rocket.move();
  rocket.display();

  planets.display(rocket.position);
  //orbits.backgroundCircles();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}


