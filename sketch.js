let planetSpread;
let planetTexture;
let planets;
let rocketFlame;
let rocket;

let planetTextures = [];

function preload() {
  ["mercury", "neptune", "venus", "mars", "jupiter"].forEach((name) => {
    planetTextures.push(loadImage(`assets/planet_textures/${name}.jpg`));
  });
  rocketFlame = loadModel("assets/models/rocket_flame.obj", true); // true = normalize size
}

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);
  angleMode(DEGREES);
  noFill();
  describe(
    "Users can click on the screen and drag to adjust their perspective in 3D space. The space contains a sphere of dark purple cubes on a light pink background.",
  );
  orbits = new PerlinNoise();
  planetSpread = new PlanetSpreadSlider();
  planetRadius = new PlanetRadiusSlider();
  planets = new Planets(planetTextures, planetSpread, planetRadius);
  rocket = new Rocket(0, 0, 0, rocketFlame, planetSpread);

}

function draw() {
  background(0, 0, 0);
  orbits.backgroundCircles();
  orbitControl();
  rocket.move();
  rocket.display();

  planets.display(rocket.position);
  
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
