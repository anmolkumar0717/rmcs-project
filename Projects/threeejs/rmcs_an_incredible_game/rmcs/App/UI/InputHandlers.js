// InputHandlers.js
import { inputStore, killed } from "../Utils/Store";

export function onKeyDown(event, keyPressed) {
  if (!keyPressed[event.code]) {
    switch (event.code) {
      case "KeyW":
      case "ArrowUp":
        console.log("forward");
        inputStore.setState({ forward: true });
        break;
      case "KeyA":
      case "ArrowLeft":
        inputStore.setState({ left: true });
        break;
      case "KeyS":
      case "ArrowDown":
        inputStore.setState({ backward: true });
        break;
      case "KeyD":
      case "ArrowRight":
        inputStore.setState({ right: true });
        break;
      case "Enter":
        inputStore.setState({ kill: true });
        killed.setState({ pressed: true });
        break;
    }
    keyPressed[event.code] = true;
  }
}

export function onKeyUp(event, keyPressed) {
  switch (event.code) {
    case "KeyW":
    case "ArrowUp":
      inputStore.setState({ forward: false });
      break;
    case "KeyA":
    case "ArrowLeft":
      inputStore.setState({ left: false });
      break;
    case "KeyS":
    case "ArrowDown":
      inputStore.setState({ backward: false });
      break;
    case "KeyD":
    case "ArrowRight":
      inputStore.setState({ right: false });
      break;
    case "Enter":
      setTimeout(() => inputStore.setState({ kill: false }), 1100);
      break;
  }
  keyPressed[event.code] = false;
}
