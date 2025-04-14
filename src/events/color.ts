import { configuration } from "./../config";
import { redrawImages } from "../draw";

const colorRadio = document.getElementById("clr") as HTMLInputElement;
const bwRadio = document.getElementById("bw") as HTMLInputElement;
export function changeColor(_: Event) {
  if (configuration.busy) {
    if (configuration.blackAndWhite) bwRadio.checked = true;
    else colorRadio.checked = true;

    return;
  }

  configuration.busy = true;
  if (colorRadio.checked && configuration.blackAndWhite) {
    configuration.blackAndWhite = false;
    redrawImages();
  } else if (bwRadio.checked && !configuration.blackAndWhite) {
    configuration.blackAndWhite = true;
    redrawImages();
  }
  configuration.busy = false;
}
