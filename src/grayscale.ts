import { configuration } from "./config";
import { appendError } from "./error";

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

    // r, g, b, alpha, ...
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      // grayscale = (r+g+b)/3
      // r, g, b => grayscale, grayscale, grayscale
      const grayscale = (data[i] + data[i + 1] + data[i + 2]) / 3;

      data[i] = grayscale;
      data[i + 1] = grayscale;
      data[i + 2] = grayscale;
    }
    ctx.putImageData(imageData, 0, 0);
  }
}
