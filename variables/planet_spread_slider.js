class PlanetSpreadSlider {
  constructor() {
    this.label = createP("Planet spread");
    this.label.position(20, 23);
    this.label.style("font-family", "monospace");
    this.label.style("color", "white");
    this.label.style("margin", "0");

    this.slider = createSlider(500, 1500, 1000, 50); // min, max, default, step
    this.slider.position(140, 20);
    this.slider.style("accent-color", "cyan");
    this.slider.mousePressed(() => noLoop()); // pause orbit while using slider
    this.slider.mouseReleased(() => loop());
  }

  value() {
    return this.slider.value();
  }
}
