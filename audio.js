// =====================================================
// Cosmic Drift - Audio Mechanic
// Owner: Teeno
// Purpose:
// Use microphone input to generate an audioCraziness value.
// This value can control planet shaking, pulsing, wobbling,
// glow intensity, orbit distortion, and background energy.
// =====================================================


// -------------------------
// Global audio variables
// -------------------------

let mic;
let amplitude;

// Raw microphone volume.
// Usually ranges from 0.0 to around 0.3 depending on the microphone.
let audioVolume = 0;

// Smoothed volume makes the visual response less jumpy.
let smoothedAudioVolume = 0;

// Main shared audio parameter.
// Keep this value between 0 and 1.
// Other group members can use this variable directly.
let audioCraziness = 0;

// Optional value for sudden loud sound detection,
// such as clapping or shouting.
let audioPeak = 0;

// Whether the microphone has started.
let audioStarted = false;


// -------------------------
// Unified audio parameters
// -------------------------

const AUDIO_SETTINGS = {
  minVolume: 0.002,
  maxVolume: 0.045,
  smoothing: 0.65,
  maxShake: 300,
  maxPulse: 0.8,
  maxGlowBoost: 180,
  wobbleSpeed: 0.06,
  peakThreshold: 0.45,
  peakDecay: 0.92
};


// =====================================================
// Setup function
// Call this once inside setup()
// =====================================================

function setupAudio() {
  mic = new p5.AudioIn();
  amplitude = new p5.Amplitude();

  // Do not start the microphone here automatically.
  // Browsers usually require user interaction first.
  console.log("Audio system ready. Click or press a key to start microphone.");
}


// =====================================================
// Start audio function
// Call this inside mousePressed() or keyPressed()
// =====================================================

function startAudioInput() {
  if (!audioStarted) {
    userStartAudio();

    mic.start(() => {
      amplitude.setInput(mic);
      audioStarted = true;
      console.log("Microphone started.");
    });
  }
}


// =====================================================
// Update function
// Call this once every frame inside draw()
// =====================================================

function updateAudio() {
  if (!audioStarted) {
    audioVolume = 0;
    smoothedAudioVolume = 0;
    audioCraziness = 0;
    audioPeak *= AUDIO_SETTINGS.peakDecay;
    return;
  }

  // Get current microphone level.
  audioVolume = amplitude.getLevel();

  // Smooth the volume to avoid harsh flickering.
  smoothedAudioVolume =
    smoothedAudioVolume * AUDIO_SETTINGS.smoothing +
    audioVolume * (1 - AUDIO_SETTINGS.smoothing);

  // Convert microphone volume into a shared 0-1 value.
  audioCraziness = map(
    smoothedAudioVolume,
    AUDIO_SETTINGS.minVolume,
    AUDIO_SETTINGS.maxVolume,
    0,
    1
  );

  audioCraziness = constrain(audioCraziness, 0, 1);

  // Detect sudden loud sound.
  if (audioCraziness > AUDIO_SETTINGS.peakThreshold) {
    audioPeak = 1;
  } else {
    audioPeak *= AUDIO_SETTINGS.peakDecay;
  }
}


// =====================================================
// Audio helper functions
// Other mechanics can use these functions.
// =====================================================


// Returns a smooth 3D wobble offset for a planet.
// index makes each planet move differently.
function getAudioWobble(index) {
  let t = frameCount * AUDIO_SETTINGS.wobbleSpeed;

  let shakeAmount = audioCraziness * AUDIO_SETTINGS.maxShake;

  let x = map(
    noise(t + index * 10),
    0,
    1,
    -shakeAmount,
    shakeAmount
  );

  let y = map(
    noise(t + index * 20),
    0,
    1,
    -shakeAmount,
    shakeAmount
  );

  let z = map(
    noise(t + index * 30),
    0,
    1,
    -shakeAmount,
    shakeAmount
  );

  return createVector(x, y, z);
}


// Returns scale multiplier for planet pulsing.
function getAudioPulse() {
  return 1 + audioCraziness * AUDIO_SETTINGS.maxPulse + audioPeak * 0.15;
}


// Returns extra glow value caused by audio.
function getAudioGlowBoost() {
  return audioCraziness * AUDIO_SETTINGS.maxGlowBoost + audioPeak * 80;
}


// Returns a value that can be used to distort orbit movement.
function getAudioOrbitDistortion() {
  return audioCraziness * 50 + audioPeak * 30;
}


// Optional: returns a simple audio state label.
// Useful for debugging or showing text on screen.
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
// Optional debug display
// You can call this inside draw() if you want to see values.
// Because the main project uses WEBGL, this uses resetMatrix()
// so the text stays on the screen.
// =====================================================

function drawAudioDebug() {
  push();

  resetMatrix();

  fill(255);
  noStroke();
  textSize(14);
  textAlign(LEFT, TOP);

  text("Audio State: " + getAudioState(), -width / 2 + 20, -height / 2 + 20);
  text("Volume: " + nf(audioVolume, 1, 3), -width / 2 + 20, -height / 2 + 40);
  text("Craziness: " + nf(audioCraziness, 1, 3), -width / 2 + 20, -height / 2 + 60);
  text("Peak: " + nf(audioPeak, 1, 3), -width / 2 + 20, -height / 2 + 80);

  pop();
}

function setupAudioButton() {
  const micButton = document.getElementById("micButton");

  if (!micButton) {
    console.warn("Mic button not found.");
    return;
  }

  micButton.addEventListener("click", function () {
    startAudioInput();

    micButton.innerText = "🎙 Microphone On";
    micButton.classList.add("active");
  });
}