// InputController.js
import { onKeyDown, onKeyUp } from "./InputHandlers";
import { inputStore } from "../Utils/Store";

export default class InputController {
  constructor() {
    this.keyPressed = {};
    this.inputStore = inputStore;

    // Bind handlers so they can be added and removed
    this.boundOnKeyDown = (event) => onKeyDown(event, this.keyPressed);
    this.boundOnKeyUp = (event) => onKeyUp(event, this.keyPressed);

    this.startListening();
  }

  startListening() {
    window.addEventListener("keydown", this.boundOnKeyDown);
    window.addEventListener("keyup", this.boundOnKeyUp);
  }

  stopListening() {
    console.log("popolo")
    window.removeEventListener("keydown", this.boundOnKeyDown);
    window.removeEventListener("keyup", this.boundOnKeyUp);
  }
}
