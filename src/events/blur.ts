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
    const data = imageData.data;
    const standard_divisor = Math.sqrt(2 * Math.PI) * 3;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.exp((-i * i) / 18) / standard_divisor;
      data[i + 1] = Math.exp((-(i + 1) * (i + 1)) / 18) / standard_divisor;
      data[i + 2] = Math.exp((-(i + 2) * (i + 2)) / 18) / standard_divisor;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
