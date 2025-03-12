import { configuration, ImageTypes } from "../config";
import { appendError, resetError } from "../error";
import { turnBufferBlackAndWhite } from "../grayscale";

const imgInput = document.getElementById("file") as HTMLInputElement;
const imagesElement = document.getElementById("images") as HTMLDivElement;

export function addImage(e: Event) {
  const canvas = document.createElement("canvas");
  canvas.width = configuration.width;
  canvas.height = configuration.height;

  const ctx = canvas.getContext("2d", {
    willReadFrequently: true,
  });
  if (ctx === null) {
    appendError("could not get the 2D context of the canvas. [adding image]");
    return;
  }
  ctx.drawImage(
    e.target as HTMLImageElement,
    0,
    0,
    configuration.width,
    configuration.height
  );

  if (configuration.blackAndWhite) {
    let imageData = ctx.getImageData(
      0,
      0,
      configuration.width,
      configuration.height
    );
    turnBufferBlackAndWhite(imageData.data);
    ctx.clearRect(0, 0, configuration.width, configuration.height);
    ctx.putImageData(imageData, 0, 0);
  }

  configuration.imgs.push({
    canvas,
    imageURL: (e.target as HTMLImageElement).src,
    fileName: (e.target as HTMLImageElement).alt,
  });
  canvas.role = "img";
  canvas.setAttribute("alt", (e.target as HTMLImageElement).alt);

  imagesElement.appendChild(canvas);
}

export function handleFileChange(_: Event) {
  configuration.busy = true;
  resetError();
  imagesElement.innerHTML = "";
  const files = imgInput.files;
  if (!files) {
    appendError("could not get files [changing files]");
    return;
  }

  // This is an object so it could be passed by reference
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // TODO check file.type from all of them
    if (!ImageTypes.has(file.type)) {
      appendError(
        "Wrong file format was somehow selected [changing files]: " + file.type
      );
    }

    const url = URL.createObjectURL(file);

    const image = new Image(configuration.width, configuration.height);
    image.onload = (e) => addImage(e);
    image.src = url;
    image.alt = file.name;
  }
  configuration.busy = false;
}

export function handleCancel(_: Event) {
  configuration.resetImages();
  imagesElement.innerHTML = "";
}
