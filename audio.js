// =====================================================
// Cosmic Drift - Stable Audio Module
// Owner: Teeno
// Purpose:
// Microphone input controls planet wobble, pulse and glow.
// This version is designed to work with the existing planets.js.
// =====================================================

// -------------------------
// Audio variables
// -------------------------

let audioMic = null;
let audioStarted = false;

let audioVolume = 0;
let smoothedAudioVolume = 0;
let audioCraziness = 0;
let audioPeak = 0;

// -------------------------
// Audio settings
// -------------------------

const TEENO_AUDIO_SETTINGS = {
  // Lower = more sensitive to quiet sound
  minVolume: 0.01,

  // Lower = small sound creates strong reaction
  maxVolume: 0.9,

  // Lower = faster response
  smoothing: 0.8,

  // Planet movement strength
  maxShake: 400,

  // Planet size pulse strength
  maxPulse: 2.9,

  // Glow strength
  maxGlowBoost: 500,

  // Wobble animation speed
  wobbleSpeed: 0.08,

  // Loud sound peak threshold
  peakThreshold: 0.45,

  // Peak fade speed
  peakDecay: 0.92,
};

// =====================================================
// Call this inside sketch.js setup()
// =====================================================

function setupAudio() {
  audioMic = new p5.AudioIn();

  setupAudioButton();

  console.log("Teeno audio system ready.");
}

// =====================================================
// Connect to the HTML microphone button
// Your index.html already has:
// <button id="micButton">🎙 Start Microphone</button>
// =====================================================

function setupAudioButton() {
  const micButton = document.getElementById("micButton");
  micButton.style.position = "absolute";
  micButton.style.top = "103px";
  micButton.style.left = "20px";
  if (!micButton) {
    console.warn("Mic button not found.");
    return;
  }

  micButton.addEventListener("click", function () {
    startAudioInput();

    micButton.innerText = "🎙 Microphone On";
    micButton.style.background = "rgba(60, 180, 120, 0.85)";
    micButton.style.color = "white";
  });
}

// =====================================================
// Start microphone
// =====================================================

function startAudioInput() {
  if (!audioStarted && audioMic) {
    userStartAudio();

    audioMic.start(function () {
      audioStarted = true;
      console.log("Microphone started.");
    });
  }
}

// =====================================================
// Call this inside sketch.js draw()
// =====================================================

function updateAudio() {
  if (!audioStarted || !audioMic) {
    audioVolume = 0;
    smoothedAudioVolume = 0;
    audioCraziness = 0;
    audioPeak *= TEENO_AUDIO_SETTINGS.peakDecay;
    return;
  }

  // IMPORTANT:
  // Use audioMic.getLevel() directly.
  // Do NOT use p5.Amplitude here, because it caused AudioWorklet errors.
  audioVolume = audioMic.getLevel();

  smoothedAudioVolume =
    smoothedAudioVolume * TEENO_AUDIO_SETTINGS.smoothing +
    audioVolume * (1 - TEENO_AUDIO_SETTINGS.smoothing);

  audioCraziness = map(
    smoothedAudioVolume,
    TEENO_AUDIO_SETTINGS.minVolume,
    TEENO_AUDIO_SETTINGS.maxVolume,
    0,
    1,
  );

  audioCraziness = constrain(audioCraziness, 0, 1);

  // Boost quiet sounds so small sounds still create visible movement
  audioCraziness = pow(audioCraziness, 0.45);

  if (audioCraziness > TEENO_AUDIO_SETTINGS.peakThreshold) {
    audioPeak = 1;
  } else {
    audioPeak *= TEENO_AUDIO_SETTINGS.peakDecay;
  }
}

// =====================================================
// These function names are kept for your current planets.js
// Your planets.js is calling getAudioWobble(i),
// so this function MUST exist.
// =====================================================

function getAudioWobble(index = 0) {
  let t = frameCount * TEENO_AUDIO_SETTINGS.wobbleSpeed;

  let shakeAmount = pow(audioCraziness, 0.65) * TEENO_AUDIO_SETTINGS.maxShake;

  let x = map(noise(t + index * 10), 0, 1, -shakeAmount, shakeAmount);

  let y = map(noise(t + index * 30 + 100), 0, 1, -shakeAmount, shakeAmount);

  let z = map(noise(t + index * 50 + 200), 0, 1, -shakeAmount, shakeAmount);

  return createVector(x, y, z);
}

function getAudioPulse() {
  return 1 + audioCraziness * TEENO_AUDIO_SETTINGS.maxPulse + audioPeak * 0.15;
}

function getAudioGlowBoost() {
  return audioCraziness * TEENO_AUDIO_SETTINGS.maxGlowBoost + audioPeak * 100;
}

// =====================================================
// Optional: one extra standalone audio planet
// Only use this if you want to draw your own extra planet.
// If you only want the original planets.js planets to react,
// you do not need to call drawAudioPlanet().
// =====================================================

function drawAudioPlanet() {
  let wobble = getAudioWobble(999);
  let pulse = getAudioPulse();
  let glow = getAudioGlowBoost();

  push();

  translate(350 + wobble.x, -120 + wobble.y, wobble.z);

  scale(pulse);

  rotateY(frameCount * 0.5);
  rotateX(frameCount * 0.15);

  noStroke();

  emissiveMaterial(
    constrain(60 + glow, 0, 255),
    constrain(120 + glow * 0.8, 0, 255),
    constrain(220 + glow, 0, 255),
  );

  sphere(80, 24, 16);

  pop();
}

// =====================================================
// Optional debug display
// Call this only after the main scene works.
// =====================================================

function drawAudioDebugSimple() {
  push();

  resetMatrix();

  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  text(
    "Mic: " + (audioStarted ? "ON" : "OFF"),
    -width / 2 + 20,
    -height / 2 + 70,
  );
  text("Volume: " + nf(audioVolume, 1, 3), -width / 2 + 20, -height / 2 + 90);
  text(
    "Craziness: " + nf(audioCraziness, 1, 3),
    -width / 2 + 20,
    -height / 2 + 110,
  );

  pop();
}
