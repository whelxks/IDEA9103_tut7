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

The time-based mechanic uses `millis()` and internal timers to trigger repeated planet explosion cycles. Each planet is built from many small 3D particle spheres, forming a clustered planet-like body in space. The size of each time-based planet is linked to the shared `planetRadius` slider, ensuring that the effect remains connected to the rest of the planet system.

The mechanic is organised through a simple state system consisting of five stages:

* `forming`
* `shaking`
* `exploding`
* `scattered`
* `reforming`

During the **forming** stage, particles remain close to their original positions while displaying subtle floating motion. When the timer reaches its threshold, the planet enters the **shaking** stage, briefly vibrating as a visual warning. It then transitions into the **exploding** stage, where particles burst outward in 3D space. After becoming **scattered**, the particles gradually slow down and begin returning to their original locations during the **reforming** stage, allowing the planet to rebuild itself and restart the cycle.

A `TimeBasedPlanetSystem` class is used to generate and manage multiple time-based planets through a reusable structure. Each planet is positioned differently and assigned slightly varied timing values, start delays, and scales. These variations prevent the explosions from appearing overly repetitive and help create a more natural and organic visual rhythm.

This mechanic supports the vision of *Cosmic Drift* by giving the universe its own autonomous rhythm, even when the user is not interacting with the scene. Rather than remaining static, planets periodically destabilise, explode, scatter, and reform according to their own schedules. This behaviour creates the impression of a living cosmic environment in which celestial bodies are constantly evolving and transforming over time.


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

The user takes control of a rocket navigating through 3D space. **WASD + QE keys** fly the spaceship through the scene, the **scroll wheel** zooms the camera in and out, and **click-and-drag** rotates the view.

The spaceship is built from composited 3D primitives (`cone()` + `cylinder()`) paired with a flame object.

As the spaceship approaches a planet, a **proximity glow** effect activates. The emissive intensity scales with closeness, so the nearer you get, the brighter it burns. This affects every planet simultaneously, meaning your movement shapes the entire visual atmosphere of the scene.

Two sliders let users adjust the composition: **Planet Spread** controls spacing between planets, and **Planet Radius** controls their size. Planets are rendered at low subdivisions to keep performance smooth.

---

## Part 3: Putting It Together

### Integration of Mechanics

* All four mechanics share a single **3D p5.js canvas** using `WEBGL` mode with orbit controls.
* The **background noise field** occupies the full canvas as a base layer.
* **Planets** are distributed in 3D space, and across the planet system, different behaviours respond to:

  * **Audio input** → wobble effect
  * **Timers** → explosion events
  * **User proximity** → glow effect
* The **spaceship**, controlled by the user, acts as the unifying protagonist:

  * Its position influences the glow behaviour of all planets.
  * Audio-driven wobble and timer-based explosions operate independently.
  * This ensures the scene remains active even when the user is not moving.
* Visually, a **dark space colour palette** and **consistent point-lighting** unify all elements into a cohesive interactive environment.

---

# Interaction Instructions
Open `index.html` with the **Live Server** extension. Chrome is recommended for best performance.
When prompted, **allow microphone access**, then click **Start Microphone** and speak or shout to trigger audio-reactive effects.

**Camera**
- **Click + Drag** — rotate view

**Spaceship Controls**
- **W** — forward
- **A** — left
- **S** — backward
- **D** — right
- **Q** — up
- **E** — down

---

## AI Acknowledgement
Claude and ChatGPT were used for debugging assistance throughout development. Specific instances are commented inline in the code.


# Video Recording of all mechanisms
https://youtu.be/qZNKxoNurzE




