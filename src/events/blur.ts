import { configuration } from "../config";
import { redrawImages } from "../draw";

const blurCheckbox = document.getElementById("blur") as HTMLInputElement;
export function handleBlur(_: Event) {
  if (configuration.busy) {
    blurCheckbox.checked = configuration.blurred;
  } else {
    configuration.busy = true;
    configuration.blurred = blurCheckbox.checked;
    redrawImages();
    configuration.busy = false;
  }
}
