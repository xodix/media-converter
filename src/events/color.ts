import { redrawToGrayscale } from "../grayscale";
import { configuration } from "./../config";
import { redrawImages } from "./dimensions";

const colorRadio = document.getElementById("clr") as HTMLInputElement;
export function changeColor(_: Event) {
  if (colorRadio.checked) {
    configuration.blackAndWhite = false;
    redrawImages();
  } else {
    redrawToGrayscale();
  }
}
