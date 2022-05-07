import "./amplifier";
import "./elapsed";
import "./title";
import "./viewers";
import "./volume";
import "./zoom";
import "./interact";
import "./fullscreen";
import "./syncer";

export default function (player) {
  // Plugins
  player.interact(); // solve the interact with dom to play audio problem
  player.zoom(); // hotkeys to scale the video
  player.fullscreen(); // keybindings for double click to full screen
  player.volumesync(); // syncs volume after reloading the page

  // Components
  player.addChild("Syncer"); // syncs the video with live edge
  player.addChild("TitleBar"); // Adds the title bar
  player.controlBar.addChild("Amplifier", {}, 2); // amplify the volume
  player.controlBar.addChild("ViewerButton", {}, 15); // viewer count
  player.controlBar.addChild("Elapsed", {}, 20); // stream time elapsed
}
