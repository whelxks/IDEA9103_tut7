# 🌌 Cosmic Drift — Final Assessment Project Pitch

---

## Part 1: Project Direction

**Project Path:** Original piece

### Vision & Inspiration

We are creating **Cosmic Drift** — an original interactive 3D space experience built in p5.js. The user pilots a spaceship through a living solar system of stylised planets, where the world reacts dynamically to sound, time, noise, and movement.

Our inspiration comes from the fluid, audio-reactive visuals of [Yuri Vishnevsky's *Silk*](http://weavesilk.com/), the generative cosmos of [Perlin-driven flow fields](https://editor.p5js.org/codingtrain/sketches/vDcIAbfg7), the aesthetic of retro space games like *Asteroids* and *Space Engine*, and the visual mood of this [instagram reference](https://www.instagram.com/p/DWeE6OFjjra/?img_index=1). The orbit-control 3D rendering style is inspired directly by the [p5.js 3D Orbit Control example](https://p5js.org/examples/3d-orbit-control/). Together, these references inform a piece that is part game, part generative art — reactive, alive, and visually cohesive.

---

## Part 2: Mechanics

### Team Members & Mechanic Ownership

| Team Member | Mechanic |
| [Teeno] | 🎵 Audio |
| [Zhaoyi Liu] | ⏱️ Time-based |
| [Nandhini Iyengar] | 🌊 Perlin Noise & Randomness |
| [Jodi Tan] | 🖱️ User Input |

---

### 🎵 Audio — [Teeno Guo]

**Mic-driven Planet "Craziness"**

The audio mechanic uses the device microphone to capture live sound input and analyse its amplitude in real time using p5.js's `p5.AudioIn` and `p5.Amplitude` objects. The louder the user's voice or ambient sound, the more chaotic and energetic the planets become — they shake, pulse, and wobble in proportion to the detected volume level.

At low volume (calm / peaceful sounds), planets orbit smoothly and gently, maintaining their regular paths. As volume increases — for example when a user shouts — each planet's position is offset by a noise-scaled displacement that grows with the amplitude value. This creates a visceral, physical connection between sound and the scene.

The mechanic connects to the project's vision by making the universe emotionally responsive. The cosmos isn't passive — it *listens*. Shouting into the mic transforms the solar system from serene to turbulent, mirroring the idea that energy and sound propagate through space. This also provides a natural moment of surprise and delight for users discovering the interaction.

---

### ⏱️ Time-based — [Zhaoyi Liu]

**Scheduled Planet Explosions**

The time-based mechanic uses millis() and internal timers to trigger periodic planet explosion events at configurable intervals. Instead of creating a complex 3D explosion, the planet is built from small 2D particles from the beginning. When the timer expires, the planet enters a short explosion sequence: it first shakes slightly, then its particles burst outward and scatter across the screen.

The explosion is controlled through simple state changes such as forming, shaking, exploding, scattered, and reforming. Each stage has a clear duration, making the mechanic easier to manage and debug. After the particles scatter, they gradually return to their original positions, allowing the planet to reform and continue the cycle.

This mechanic supports the vision of Cosmic Drift by keeping the universe alive even when the user is idle. The planet does not remain static; it periodically destabilises, explodes, scatters, and reforms on its own schedule. This creates the feeling of a living cosmic system, where planets are constantly changing rather than simply being displayed. The timed and slightly randomised movement also makes the scene feel less predictable and encourages users to keep watching.

---

### 🌊 Perlin Noise & Randomness — [Nandhini Iyengar]

**Background of the Scene**

Perlin noise is used to create the background of the artwork. Since it is outer space, I was inspired by the orbits of planets, and wanted to create something that subtly moved. My code can be understood by looking at it through the following steps - 

1. Creating concentric circles at first, which are actually polygons that are created by spacing the points evenly
2. Distorting the circles using the noise function - each point is shifted using the noise function, and moved based on a fixed trigonometric formula, which makes the shift similar across all of the concentric circles
3. Using Chaikin’s algorithm to smooth out the points of the polygons, turning them into smoother curves
4. Distorting and smoothing the circles point by point, by calling the above functions for each point

I used white colour for the orbits and didn’t go for colourful gradient patterns because it was looking chaotic when combined with the already colourful planets scene. Instead, I increased the thickness of each circle to add a further bit of variation.

**Interaction** - You can zoom in and out using the mouse wheel to see the concentric circles. The longer you wait, the more movement you can see across the circles. The more you zoom out, you can see the thickness of each circle increasing.

Further explanation of the logic - 

Cosine is for how far left or right each point can be, and sine is for how far up or down it can be. Through each angle around the circle, cos and sin calculate where each point should go, and collect all of them into an array. This process repeats for every ring, with each ring being slightly larger than the last.

For each point on each ring, the value from the noise function to calculate an angle. It then nudges the point a small distance in the direction of that angle. The circles move between being almost perfect circles and being distorted. 

Chaikin's algorithm is used to fix the angular appearance of the polygons by slicing off the corners of the polygon and replacing it with two new points that sit closer to the middle of each edge. Each time this is applied the shape becomes rounder and smoother. This is applied 4 times per circle, which makes the result look like a smooth circle rather than a polygon. 

My code was inspired by https://www.generativehut.com/post/recreating-the-noise-orbit. It instantly reminded me of outer space and black holes, and while it is meant to be a powerful, more detailed animation and was lagging a lot, I tried to simplify it and make it fit as a background for our canvas. I used Claude to help understand and explain to me exactly how this works step by step, especially with the trigonometric functions.

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

