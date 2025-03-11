import { configuration, ImageTypes } from "../config";
import { appendError, resetError } from "../error";
import { redrawToGrayscale } from "../grayscale";

const imgInput = document.getElementById("file") as HTMLInputElement;
const imagesElement = document.getElementById("images") as HTMLDivElement;

export function addImage(e: Event, loadedObj: { loaded: number }) {
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
  configuration.imgs.push({
    canvas,
    imageURL: (e.target as HTMLImageElement).src,
    fileName: (e.target as HTMLImageElement).alt,
  });
  canvas.role = "img";
  canvas.setAttribute("alt", (e.target as HTMLImageElement).alt);

  imagesElement.appendChild(canvas);
  loadedObj.loaded++;
}

export function handleFileChange(_: Event) {
  resetError();
  imagesElement.innerHTML = "";
  const files = imgInput.files;
  if (!files) {
    appendError("could not get files [changing files]");
    return;
  }

  // This is an object so it could be passed by reference
  // TODO FIX THIS SPINLOCK
  let loadedObj = { loaded: 0 };
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
    image.onload = (e) => addImage(e, loadedObj);
    image.src = url;
    image.alt = file.name;
  }

  // TODO FIX THIS SPINLOCK
  if (configuration.blackAndWhite) {
    const int = setInterval(() => {
      if (loadedObj.loaded === files.length) {
        redrawToGrayscale();
        clearInterval(int);
      }
    }, 100);
  }
}

export function handleCancel(_: Event) {
  configuration.resetImages();
  imagesElement.innerHTML = "";
}
