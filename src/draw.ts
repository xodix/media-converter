import { gaussianBlur } from "./blur";
import { configuration } from "./config";
import { appendError } from "./error";
import { turnBufferBlackAndWhite } from "./grayscale";

const imagesElement = document.getElementById("images") as HTMLDivElement;

function repaint(e: Event, canvas: HTMLCanvasElement) {
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
  if (configuration.blackAndWhite || configuration.blurred) {
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

    if (configuration.blackAndWhite) {
      turnBufferBlackAndWhite(imageData?.data);
    }
    if (configuration.blurred) {
      gaussianBlur(
        imageData.data,
        configuration.width,
        configuration.height,
        3
      );
    }
    ctx?.putImageData(imageData, 0, 0);
  }

  (e.target as HTMLImageElement).onload = null;
}

export function redrawInitial() {
  for (let i = 0; i < configuration.imgs.length; i++) {
    const canvas = document.createElement("canvas");
    canvas.width = configuration.width;
    canvas.height = configuration.height;

    configuration.imgs[i].canvas = canvas;
    imagesElement.appendChild(canvas);
  }

  redrawImages();
}

export function redrawImages() {
  for (let i = 0; i < configuration.imgs.length; i++) {
    const { canvas, fileName, imageURL } = configuration.imgs[i];
    if (canvas === null) {
      appendError("Could not get the canvas [redrawImages].");
      return;
    }

    const imageElement = new Image(configuration.width, configuration.height);
    imageElement.src = imageURL;
    imageElement.onload = (e) => repaint(e, canvas);
    imageElement.alt = fileName;
  }
}
