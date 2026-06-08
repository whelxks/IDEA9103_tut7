let planetSpread;
let planetTexture;
let planets;
let rocketFlame;
let rocket;


let planetTextures = [];

// This will control all time-based exploding planets
let timeBasedPlanetSystem;

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

  // Create time-based planet.
  timeBasedPlanetSystem = new TimeBasedPlanetSystem(12, planetRadius);
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
  
  // Update and display all time-based planets
  timeBasedPlanetSystem.update();
  timeBasedPlanetSystem.display();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

setupAudio();
updateAudio();
startAudioInput();

getAudioWobble(index)
getAudioPulse()
getAudioGlowBoost()