import { configuration } from "./../config";

const widthInput = document.getElementById("width") as HTMLInputElement;
const heightInput = document.getElementById("height") as HTMLInputElement;

export function redrawImages() {
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
      imageElement.onload = null;
    };
    imageElement.alt = fileName;
  }
}

let dimensionTimer: number = 0;
export function handleDimensionChange(_: Event) {
  clearTimeout(dimensionTimer);
  dimensionTimer = setTimeout(() => {
    configuration.changeDimensions(+widthInput.value, +heightInput.value);

    for (let i = 0; i < configuration.imgs.length; i++) {
      const { canvas } = configuration.imgs[i];
      canvas.width = configuration.width;
      canvas.height = configuration.height;
    }

    redrawImages();
  }, 1000);
}
