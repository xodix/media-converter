import { redrawImages } from "../draw";
import { appendError } from "../error";
import { configuration } from "./../config";

const widthInput = document.getElementById("width") as HTMLInputElement;
const heightInput = document.getElementById("height") as HTMLInputElement;

export function handleDimensionChange(_: Event) {
  let width = +widthInput.value;
  let height = +heightInput.value;
  if (width < 5) {
    width = 5;
    widthInput.value = width.toString();
  }
  if (height < 5) {
    height = 5;
    heightInput.value = height.toString();
  }

  configuration.changeDimensions(width, height);

  for (let i = 0; i < configuration.imgs.length; i++) {
    const { canvas } = configuration.imgs[i];
    if (canvas === null) {
      appendError("Could not get the canvas [dimensionChange].");
      return;
    }

    canvas.width = configuration.width;
    canvas.height = configuration.height;
  }

  redrawImages();
}
