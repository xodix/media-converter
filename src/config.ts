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

const imgInput = document.getElementById("file") as HTMLInputElement;
export class Configuration {
  width: number;
  height: number;
  outputFormat: ImageType;
  blackAndWhite: boolean;
  blurred: boolean;
  busy: boolean;
  imgs: ImageRepresentation[];

  constructor() {
    this.width = 300;
    this.height = 300;
    this.outputFormat = "image/webp";
    this.blackAndWhite = false;
    this.blurred = false;
    this.busy = false;
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

    imgInput.toggleAttribute("required", true);
  }

  changeFormat(format: ImageType) {
    if (!ImageTypes.has(format)) {
      appendError("Wrong format was selected [formatChange]");
      return;
    }

    this.outputFormat = format;
  }

  addImage(image: ImageRepresentation) {
    imgInput.removeAttribute("required");
    this.imgs.push(image);
  }

  save() {
    localStorage.setItem("configuration", JSON.stringify(this));
  }

  load() {
    const configurationJSON = localStorage.getItem("configuration");
    if (configurationJSON === null) {
      return;
    }
    const config: Configuration = JSON.parse(configurationJSON);

    const widthInput = document.getElementById("width") as HTMLInputElement;
    const heightInput = document.getElementById("height") as HTMLInputElement;
    this.width = config.width;
    this.height = config.height;
    widthInput.value = config.width.toString();
    heightInput.value = config.height.toString();

    const formatSelect = document.getElementById("format") as HTMLSelectElement;
    this.outputFormat = config.outputFormat;
    formatSelect.value = config.outputFormat;

    const blackAndWhiteRadio = document.getElementById(
      "bw"
    ) as HTMLInputElement;
    const colorRadio = document.getElementById("clr") as HTMLInputElement;
    this.blackAndWhite = config.blackAndWhite;
    if (config.blackAndWhite) {
      blackAndWhiteRadio.checked = true;
    } else {
      colorRadio.checked = true;
    }

    const blurredCheckbox = document.getElementById("blur") as HTMLInputElement;
    blurredCheckbox.checked = true;

    this.busy = false;
    this.imgs = [];
  }
}

export const configuration = new Configuration();
