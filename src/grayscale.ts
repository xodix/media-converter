import { configuration } from "./config";
import { appendError } from "./error";

export function turnBufferBlackAndWhite(
  data: Uint8ClampedArray<ArrayBufferLike>
) {
  // (r, g, b, alpha)[]
  for (let i = 0; i < data.length; i += 4) {
    // grayscale = (r+g+b)/3
    // r, g, b => grayscale, grayscale, grayscale
    const grayscale = Math.round(
      data[i] * 0.3 + data[i + 1] * 0.6 + data[i + 2] * 0.3
    );

    data[i] = grayscale;
    data[i + 1] = grayscale;
    data[i + 2] = grayscale;
  }
}
export function redrawToGrayscale() {
  configuration.blackAndWhite = true;
  for (let i = 0; i < configuration.imgs.length; i++) {
    const { canvas } = configuration.imgs[i];

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    });
    if (!ctx) {
      appendError("Could not get the context [grayscale]");
      return;
    }
    const imageData = ctx.getImageData(
      0,
      0,
      configuration.width,
      configuration.height
    );

    if (!imageData) {
      appendError("Could not find the data of the image [grayscale]");
      return;
    }

    const data = imageData.data;
    turnBufferBlackAndWhite(data);
    ctx.putImageData(imageData, 0, 0);
  }
}
