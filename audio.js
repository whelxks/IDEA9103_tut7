// =====================================================
// Cosmic Drift - Standalone Audio Reactive Planets
// Owner: Teeno
// Description:
// A standalone p5.js + p5.sound sketch.
// Microphone volume controls planet wobble, pulse, and glow.
// =====================================================


// -------------------------
// Audio variables
// -------------------------

let mic;
let amplitude;
let audioStarted = false;

let audioVolume = 0;
let smoothedAudioVolume = 0;
let audioCraziness = 0;
let audioPeak = 0;


// -------------------------
// Audio sensitivity settings
// -------------------------

const AUDIO_SETTINGS = {
  // Smaller value means the sketch reacts to quieter sound.
  minVolume: 0.002,

  // Smaller value means higher sensitivity.
  // If the planets are still not moving enough, change this to 0.025.
  maxVolume: 0.04,

  // Lower smoothing = faster and more sensitive reaction.
  smoothing: 0.6,

  // Maximum shake distance.
  maxShake: 280,

  // Maximum planet scale increase.
  maxPulse: 0.75,

  // Maximum glow increase.
  maxGlowBoost: 220,

  // Wobble speed.
  wobbleSpeed: 0.08,

  // Peak detection threshold.
  peakThreshold: 0.45,

  // Peak fade speed.
  peakDecay: 0.92
};


// -------------------------
// Scene variables
// -------------------------

let planetsSystem;
let micButton;


// These replace the original sliders.
// You can adjust these two values manually.
let planetSpreadValue = 260;
let planetRadiusValue = 36;


// =====================================================
// p5 setup
// =====================================================

function setup() {
  createCanvas(windowWidth, windowHeight, WEBGL);

  angleMode(DEGREES);

  setupAudio();

  planetsSystem = new Planets(planetSpreadValue, planetRadiusValue);

  createMicButton();

  textFont("Arial");
}


// =====================================================
// p5 draw
// =====================================================

function draw() {
  background(5, 8, 18);

  updateAudio();

  orbitControl();

  // Basic lighting
  ambientLight(40);
  directionalLight(255, 255, 255, -0.5, 0.7, -1);

  // Rotate the whole planet system slowly
  rotateY(frameCount * 0.15);
  rotateX(frameCount * 0.04);

  planetsSystem.display();

  drawAudioDebug();
}


// =====================================================
// Audio setup
// =====================================================

function setupAudio() {
  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  console.log("Audio system ready. Click the microphone button to start.");
}


function startAudioInput() {
  if (!audioStarted) {
    userStartAudio();

    mic.start(function () {
      amplitude.setInput(mic);
      audioStarted = true;
      console.log("Microphone started.");
    });
  }
}


function updateAudio() {
  if (!audioStarted) {
    audioVolume = 0;
    smoothedAudioVolume = 0;
    audioCraziness = 0;
    audioPeak *= AUDIO_SETTINGS.peakDecay;
    return;
  }

  audioVolume = amplitude.getLevel();

  // Smooth the volume
  smoothedAudioVolume =
    smoothedAudioVolume * AUDIO_SETTINGS.smoothing +
    audioVolume * (1 - AUDIO_SETTINGS.smoothing);

  // Map microphone volume to 0 - 1
  audioCraziness = map(
    smoothedAudioVolume,
    AUDIO_SETTINGS.minVolume,
    AUDIO_SETTINGS.maxVolume,
    0,
    1
  );

  audioCraziness = constrain(audioCraziness, 0, 1);

  // Boost quiet sounds.
  // This makes small sound produce visible movement.
  audioCraziness = pow(audioCraziness, 0.45);

  // Peak detection for sudden loud sound
  if (audioCraziness > AUDIO_SETTINGS.peakThreshold) {
    audioPeak = 1;
  } else {
    audioPeak *= AUDIO_SETTINGS.peakDecay;
  }
}


// =====================================================
// Audio helper functions
// =====================================================

function getAudioWobble(index) {
  let t = frameCount * AUDIO_SETTINGS.wobbleSpeed;

  // Stronger low-volume wobble
  let shakeAmount = pow(audioCraziness, 0.65) * AUDIO_SETTINGS.maxShake;

  let x = map(noise(t + index * 11), 0, 1, -shakeAmount, shakeAmount);
  let y = map(noise(t + index * 23), 0, 1, -shakeAmount, shakeAmount);
  let z = map(noise(t + index * 37), 0, 1, -shakeAmount, shakeAmount);

  return createVector(x, y, z);
}


function getAudioPulse() {
  return 1 + audioCraziness * AUDIO_SETTINGS.maxPulse + audioPeak * 0.2;
}


function getAudioGlowBoost() {
  return audioCraziness * AUDIO_SETTINGS.maxGlowBoost + audioPeak * 100;
}


function getAudioState() {
  if (!audioStarted) {
    return "MIC OFF";
  }

  if (audioCraziness < 0.2) {
    return "CALM";
  } else if (audioCraziness < 0.6) {
    return "ACTIVE";
  } else {
    return "CHAOTIC";
  }
}


// =====================================================
// Button
// =====================================================

function createMicButton() {
  micButton = createButton("🎙 Start Microphone");

  micButton.position(20, 20);
  micButton.style("z-index", "9999");
  micButton.style("position", "fixed");
  micButton.style("padding", "12px 18px");
  micButton.style("border", "1px solid white");
  micButton.style("border-radius", "8px");
  micButton.style("background", "rgba(0, 0, 0, 0.75)");
  micButton.style("color", "white");
  micButton.style("font-size", "14px");
  micButton.style("font-family", "Arial, sans-serif");
  micButton.style("cursor", "pointer");

  micButton.mousePressed(function () {
    startAudioInput();
    micButton.html("🎙 Microphone On");
    micButton.style("background", "rgba(60, 180, 120, 0.85)");
  });
}


// =====================================================
// Planets class
// This is based on your original planet code,
// but modified to be standalone and audio-reactive.
// =====================================================

class Planets {
  constructor(planetSpread, planetRadius) {
    this.planetSpread = planetSpread;
    this.planetRadius = planetRadius;
    this.planets = [];

    this.computeCenters(this.planetSpread);
  }

  computeCenters(spread) {
    const radius = this.planetRadius;

    for (let zAngle = 0; zAngle < 180; zAngle += 30) {
      for (let xAngle = 0; xAngle < 360; xAngle += 30) {
        let r = map(sin(zAngle), 0, 1, radius - 10, radius + 10);

        let ay = spread * cos(xAngle);
        let az = spread * sin(xAngle);

        let wx = -ay * sin(zAngle);
        let wy = ay * cos(zAngle);
        let wz = az;

        this.planets.push({
          x: wx,
          y: wy,
          z: wz,
          r: r,
          zAngle: zAngle,
          xAngle: xAngle
        });
      }
    }
  }

  display() {
    noStroke();

    let spread = this.planetSpread;

    for (let [i, p] of this.planets.entries()) {
      // Get audio values for each planet
      let audioWobble = getAudioWobble(i);
      let audioPulse = getAudioPulse();
      let audioGlowBoost = getAudioGlowBoost();

      push();

      // Original planet positioning logic
      rotateZ(p.zAngle);
      rotateX(p.xAngle);

      // Original translate structure + audio wobble
      translate(
        audioWobble.x,
        spread + audioWobble.y,
        audioWobble.z
      );

      // Audio controls planet size pulse
      scale(audioPulse);

      // Slight self rotation
      rotateY(frameCount * 0.8 + i * 10);
      rotateX(frameCount * 0.3 + i * 5);

      // Base planet color
      let baseR = 60 + (i * 30) % 160;
      let baseG = 90 + (i * 45) % 150;
      let baseB = 160 + (i * 25) % 95;

      // Audio glow color
      let glowR = constrain(baseR + audioGlowBoost, 0, 255);
      let glowG = constrain(baseG + audioGlowBoost * 0.7, 0, 255);
      let glowB = constrain(baseB + audioGlowBoost, 0, 255);

      // Main glowing material
      emissiveMaterial(glowR, glowG, glowB);

      sphere(p.r, 12, 8);

      // Extra outer glow shell
      if (audioCraziness > 0.05) {
        push();

        let glowScale = 1.15 + audioCraziness * 0.8;
        scale(glowScale);

        let alphaGlow = map(audioCraziness, 0, 1, 20, 120);

        fill(glowR, glowG, glowB, alphaGlow);
        noStroke();
        sphere(p.r, 12, 8);

        pop();
      }

      pop();
    }
  }
}


// =====================================================
// Debug display
// =====================================================

function drawAudioDebug() {
  push();

  resetMatrix();

  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  text("Audio State: " + getAudioState(), -width / 2 + 20, -height / 2 + 70);
  text("Volume: " + nf(audioVolume, 1, 3), -width / 2 + 20, -height / 2 + 90);
  text("Craziness: " + nf(audioCraziness, 1, 3), -width / 2 + 20, -height / 2 + 110);
  text("Peak: " + nf(audioPeak, 1, 3), -width / 2 + 20, -height / 2 + 130);

  pop();
}


// =====================================================
// Window resize
// =====================================================

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}