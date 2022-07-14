import "./amplifier";
import "./elapsed";
import "./title";
import "./viewers";
import "./volume";
import "./zoom";
import "./interact";
import "./fullscreen";
import "./syncer";
import "./mirror";

export default function (player) {
  // Plugins
  player.interact(); // solve the interact with dom to play audio problem
  player.zoom(); // hotkeys to scale the video
  player.fullscreen(); // keybindings for double click to full screen
  player.volumesync(); // syncs volume after reloading the page
  player.syncer(); // syncs video playback with the live stream

  // Components
  player.addChild("TitleBar"); // Adds the title bar
  player.controlBar.addChild("Amplifier", {}, 2); // amplify the volume
  player.controlBar.addChild("ViewerButton", {}, 15); // viewer count
  player.controlBar.addChild("MirrorButton", {}, 16); // viewer count
  player.controlBar.addChild("Elapsed", {}, 20); // stream time elapsed
}
