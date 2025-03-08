import { appendError } from "./error";
enum ImageType {
  "image/png",
  "image/jpeg",
  "image/svg",
  "image/webp",
}

interface ImageRepresentation {
  canvas: HTMLCanvasElement;
  fileName: string;
  imageURL: string;
}

export class Configuration {
  width: number;
  height: number;
  outputFormat: ImageType;
  imgs: ImageRepresentation[];

  constructor() {
    this.width = 300;
    this.height = 300;
    this.outputFormat = ImageType["image/webp"];
    // TODO Images should have a
    this.imgs = [];
  }

  changeDimensions(width: number, height: number) {
    if (isNaN(width) || isNaN(height))
      appendError("Provided image dimensions are wrong");

    this.width = width;
    this.height = height;
  }

  changeFormat(format: ImageType) {
    this.outputFormat = format;
  }

  addImage(image: ImageRepresentation) {
    this.imgs.push(image);
  }
}
