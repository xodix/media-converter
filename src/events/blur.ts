import { boxBlur, gaussianBlur } from "../blur";
import { configuration } from "../config";
import { appendError } from "../error";
import { redrawImages } from "./dimensions";

const blurCheckbox = document.getElementById("blur") as HTMLInputElement;
export function handleBlur(_: Event) {
  if (!blurCheckbox.checked) {
    console.log("UNCHECKED");
    redrawImages();
    return;
  }
  console.log("CHECKED");

  for (let i = 0; i < configuration.imgs.length; i++) {
    const image = configuration.imgs[i];
    const ctx = image.canvas.getContext("2d");
    if (ctx === null) {
      appendError("Could not get the context. [blur]");
      return;
    }

    const imageData = ctx.getImageData(
      0,
      0,
      configuration.width,
      configuration.height
    );

    gaussianBlur(imageData.data, configuration.width, configuration.height, 4);

    ctx.putImageData(imageData, 0, 0);
  }
}
