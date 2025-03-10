import { appendError } from "./error";

// More could be added
export type ImageType =
  | "image/png"
  | "image/jpeg"
  | "image/svg"
  | "image/webp"
  | "image/svg+xml"
  | "image/ico"
  | "image/gif"
  | "image/avif"
  | "image/apng";
export const ImageTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/svg",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
  "image/apng",
  "image/ico",
]);

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
    this.outputFormat = "image/webp";
    this.imgs = [];
  }

  changeDimensions(width: number, height: number) {
    if (isNaN(width) || isNaN(height))
      appendError("Provided image dimensions are wrong");

    this.width = width;
    this.height = height;
  }

  resetImages() {
    for (let i = 0; i < this.imgs.length; i++) {
      const imageInfo = this.imgs[i];
      URL.revokeObjectURL(imageInfo.imageURL);
    }
    this.imgs.length = 0;
  }

  changeFormat(format: ImageType) {
    this.outputFormat = format;
  }

  addImage(image: ImageRepresentation) {
    this.imgs.push(image);
  }
}

export const configuration = new Configuration();
