let planetSpread;
let planetTexture;
let planets;
let rocketFlame;
let rocket;

let planetTextures = [];

// A variable for time-based planet
let explodingPlanet;

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

  // Instatiate the timebased planet
  explodingPlanet = new TimeBasedPlanet(200,0,-100,planetRadius);
}

function draw() {
  background(15, 5, 35);

  // setup lighting
  ambientLight(90);
  pointLight(255,255,255,0,-200,400);
  pointLight(255,180,180,0,-300,400);

  orbits.backgroundCircles();
  orbitControl();
  rocket.move();
  rocket.display();

  planets.display(rocket.position);
  
  // Update state and draw new planet
  explodingPlanet.update();
  explodingPlanet.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
