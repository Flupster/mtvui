import videojs from "video.js";

const Button = videojs.getComponent("Button");
const HelpButton = videojs.extend(Button, {
  constructor: function () {
    Button.apply(this, arguments);
    this.addClass("vjs-control-help");
    this.el().innerHTML = '<i class="far fa-question-circle"></i>';
    this.on("click", () => options.click());
  },
});

videojs.registerComponent("Help", helpComponent);
