import videojs, { VideoJsPlayer } from "video.js";
import gradient from "gradient-color";

const Button = videojs.getComponent("Button");
class Amplifier extends Button {
  amplifier: GainNode;
  gain: number;
  level: number;
  colors: gradient;

  constructor(player) {
    super(player);
    this.player = player;

    this.amplifier;
    this.gain = 1;
    this.level = 10;
    this.colors = gradient(["#ff0000", "#00ff00"], 20);

    this.addClass("vjs-control-amplifier");
    this.el().innerHTML = '<i class="fas fa-deaf"></i>';

    this.on("click", () => this.changeAmplification(this.gain * 1.5));

    this.on("contextmenu", (e) => {
      e.preventDefault();
      this.changeAmplification(this.gain / 1.5);
    });
  }

  createAmplifier(value) {
    const context = new AudioContext();
    const source = context.createMediaElementSource(
      this.el().getElementsByTagName("video")[0]
    );

    const gain = context.createGain();
    source.connect(gain);
    gain.connect(context.destination);

    this.amplifier = gain;
    this.changeAmplification(value);
  }

  changeColor(value) {
    value > this.gain ? this.level++ : this.level--;

    if (this.level === 10) {
      return this.el().removeAttribute("style");
    }

    this.el().setAttribute("style", `color: ${this.colors[this.level]};`);
  }

  changeAmplification(value) {
    if (!this.amplifier) return this.createAmplifier(value);

    this.changeColor(value);
    this.gain = value;
    this.amplifier.gain.value = value;
  }
}

videojs.registerComponent("Amplifier", Amplifier);
