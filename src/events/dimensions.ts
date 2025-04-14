import { redrawImages } from "../draw";
import { appendError } from "../error";
import { configuration } from "./../config";

const widthInput = document.getElementById("width") as HTMLInputElement;
const heightInput = document.getElementById("height") as HTMLInputElement;

let dimensionTimer: number = 0;
export function handleDimensionChange(_: Event) {
  clearTimeout(dimensionTimer);

  dimensionTimer = setTimeout(() => {
    configuration.changeDimensions(+widthInput.value, +heightInput.value);

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
  }, 250);
}
