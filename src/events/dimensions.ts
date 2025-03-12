import { configuration } from "./../config";
import { turnBufferBlackAndWhite } from "../grayscale";
import { appendError } from "../error";

const widthInput = document.getElementById("width") as HTMLInputElement;
const heightInput = document.getElementById("height") as HTMLInputElement;

export function redrawImages() {
  // SMARTER SPINLOCK that has stopped to be a spinlock altogether
  for (let i = 0; i < configuration.imgs.length; i++) {
    const { canvas, imageURL, fileName } = configuration.imgs[i];

    const imageElement = new Image(configuration.width, configuration.height);
    imageElement.src = imageURL;
    imageElement.onload = (e) => {
      canvas.width = configuration.width;
      canvas.height = configuration.height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(
        e.target as HTMLImageElement,
        0,
        0,
        configuration.width,
        configuration.height
      );
      if (configuration.blackAndWhite) {
        let imageData = ctx?.getImageData(
          0,
          0,
          configuration.width,
          configuration.height
        );
        if (!imageData) {
          appendError("Could not get Image data [dimension change]");
          return;
        }
        turnBufferBlackAndWhite(imageData?.data);
        ctx?.putImageData(imageData, 0, 0);
      }

      imageElement.onload = null;
    };
    imageElement.alt = fileName;
  }
}

let dimensionTimer: number = 0;
export function handleDimensionChange(_: Event) {
  // This might be a very bad idea
  configuration.busy = true;
  clearTimeout(dimensionTimer);
  dimensionTimer = setTimeout(() => {
    configuration.changeDimensions(+widthInput.value, +heightInput.value);

    for (let i = 0; i < configuration.imgs.length; i++) {
      const { canvas } = configuration.imgs[i];
      canvas.width = configuration.width;
      canvas.height = configuration.height;
    }

    redrawImages();
    configuration.busy = false;
  }, 250);
}
