# 🌌 Cosmic Drift — Final Assessment Project Pitch

---

## Part 1: Project Direction

**Project Path:** Original piece

### Vision & Inspiration

We are creating **Cosmic Drift** — an original interactive 3D space experience built in p5.js. The user pilots a spaceship through a living solar system of stylised planets, where the world reacts dynamically to sound, time, noise, and movement.

Our inspiration comes from the fluid, audio-reactive visuals of [Yuri Vishnevsky's *Silk*](http://weavesilk.com/), the generative cosmos of [Perlin-driven flow fields](https://editor.p5js.org/codingtrain/sketches/vDcIAbfg7), and the aesthetic of retro space games like *Asteroids* and *Space Engine*. The orbit-control 3D rendering style is inspired directly by the [p5.js 3D Orbit Control example](https://p5js.org/examples/3d-orbit-control/). Together, these references inform a piece that is part game, part generative art — reactive, alive, and visually cohesive.

---

## Part 2: Mechanics

### Team Members & Mechanic Ownership

| Team Member | Mechanic |
| [Name 1] | 🎵 Audio |
| [Name 2] | ⏱️ Time-based |
| [Name 3] | 🌊 Perlin Noise & Randomness |
| [Jodi Tan] | 🖱️ User Input |

---

### 🎵 Audio — [Teeno]

**Mic-driven Planet "Craziness"**

The audio mechanic uses the device microphone to capture live sound input and analyse its amplitude in real time using p5.js's `p5.AudioIn` and `p5.Amplitude` objects. The louder the user's voice or ambient sound, the more chaotic and energetic the planets become — they shake, pulse, and wobble in proportion to the detected volume level.

At low volume (calm / peaceful sounds), planets orbit smoothly and gently, maintaining their regular paths. As volume increases — for example when a user shouts — each planet's position is offset by a noise-scaled displacement that grows with the amplitude value. This creates a visceral, physical connection between sound and the scene.

The mechanic connects to the project's vision by making the universe emotionally responsive. The cosmos isn't passive — it *listens*. Shouting into the mic transforms the solar system from serene to turbulent, mirroring the idea that energy and sound propagate through space. This also provides a natural moment of surprise and delight for users discovering the interaction.

---

### ⏱️ Time-based — [Zhaoyi Liu]

**Scheduled Planet Explosions**

The time-based mechanic uses `millis()` and internal timers to trigger periodic planet explosion events at configurable intervals (e.g., every 8–15 seconds per planet). When a planet's timer expires, it enters an "explosion sequence" — a 2D animated burst effect rendered on the planet's surface using frame counters and sprite-like states.

The explosion is rendered in 2D (drawn flat onto the planet face to reduce complexity), using expanding circles, colour flashes, and particle-like rings that fade out over ~2 seconds. After exploding, the planet "reforms" — regenerating with a randomly selected new texture or colour, using the randomness mechanic.

The mechanic connects to the vision by ensuring the scene is never static. Even if the user is idle, the universe continues to evolve — planets live and die on their own schedule. This reinforces the feeling that Cosmic Drift is a *living world*, not just a renderer. The staggered, randomised timers mean no two sessions feel the same, and the explosions serve as dramatic visual punctuation that rewards continued watching or interaction.

> 📌 *Add a sketch of the explosion animation states (e.g., idle → building → burst → fade → reform) here.*

---

### 🌊 Perlin Noise & Randomness — [Nandhini Iyengar]

**Background Effects**

The Perlin noise mechanic generates the living, breathing background of the scene — a flowing star field driven by a 2D Perlin noise flow field (inspired by the [p5.js Perlin noise flow field example](https://p5js.org/examples/simulate-noise/)). A lot of small particles are seeded across the canvas using `random()` with a fixed or user-adjustable `randomSeed()`. Each particle follows a velocity vector sampled from `noise(x, y, time)`, creating fluid trails that evoke nebulae.

Shooting stars are layered on top and triggered at random intervals using `random()`, with their trajectories also influenced by the noise field to feel consistent with the ambient flow.

The `randomSeed()` value is exposed as a parameter (optionally mapped to user input), meaning two sessions can look entirely different. The combination of Perlin noise for smooth, coherent structure and `random()` for unpredictable event placement creates a background that is simultaneously ordered and chaotic — mirroring the dual nature of space itself. This mechanic forms the visual ground that all other mechanics play on top of, giving the piece spatial and aesthetic cohesion.

---

### 🖱️ User Input — [Jodi Tan]

**Spaceship Movement & Proximity Glow**

The user input mechanic puts the user in the pilot's seat. **WASD keys** move a spaceship model through the 3D scene, while **scroll wheel** controls camera zoom in/out (complementing the orbit control). The spaceship is rendered as a simple 3D shape (e.g., `cone()` + `box()` composited) with a directional thruster glow effect.

As the spaceship moves closer to any planet, a **proximity glow** effect activates — the planet's emissive colour and pointLight intensity increase proportionally to the inverse of the distance between the spaceship and the planet. This creates a "lighting the way" metaphor: the spaceship is a source of warmth and revelation in a dark universe.

Mouse position is also used to steer the ship's heading in 3D space (mapped to rotations), giving fluid, intuitive directional control. The interaction model is intentionally simple — forgiving and explorative rather than precise — so users can focus on experiencing the generative visuals rather than fighting controls.

This mechanic connects to the vision by making the user an *agent* in the world, not just an observer. The proximity glow ties the user's presence directly to the visual state of every planet — your spaceship literally changes how the world looks.

---

## Part 3: Putting It Together

All four mechanics share a single 3D p5.js canvas using `WEBGL` mode with orbit controls. The background noise field occupies the full canvas as a base layer. Planets are distributed in 3D space and respond simultaneously to audio (wobble), timers (explosions), and user proximity (glow). The spaceship — controlled by the user — acts as the unifying protagonist: its position influences glow across all planets, while audio and explosions fire independently, ensuring the scene is alive even when the user is still. Visually, the dark space palette and consistent point-lighting tie all elements together.

