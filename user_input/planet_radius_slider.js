class PlanetRadiusSlider {
  constructor() {
    this.label = createP("Planet radius");
    this.label.position(20, 63);
    this.label.style("font-family", "monospace");
    this.label.style("color", "white");
    this.label.style("margin", "0");

    this.slider = createSlider(20, 100, 40, 10); // min, max, default, step
    this.slider.position(140, 60);
    this.slider.style("accent-color", "cyan");
    this.slider.mousePressed(() => noLoop()); // pause orbit while using slider
    this.slider.mouseReleased(() => loop());
  }

  value() {
    return this.slider.value();
  }
}
