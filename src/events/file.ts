import { configuration, ImageTypes } from "../config";
import { redrawInitial } from "../draw";
import { appendError, resetError } from "../error";

const imgInput = document.getElementById("file") as HTMLInputElement;
const imagesElement = document.getElementById("images") as HTMLDivElement;

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
    configuration.addImage({
      canvas: null,
      fileName: file.name,
      imageURL: url,
    });
  }

  redrawInitial();
  configuration.busy = false;
}

export function handleFileCancel(_: Event) {
  configuration.resetImages();
  imagesElement.innerHTML = "";
}
