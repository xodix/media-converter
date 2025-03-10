import JSZip from "jszip";
import { resetError } from "../error";
import saveAs from "file-saver";
import { configuration } from "../config";

export function handleSubmit(e: Event) {
  e.preventDefault();
  resetError();
  let zippy = new JSZip();
  const images = configuration.imgs;

  const extension = "." + configuration.outputFormat.substring(6);
  for (let i = 0; i < images.length; i++) {
    const { canvas, fileName } = images[i];
    let imageData = canvas.toDataURL(configuration.outputFormat, 0.7);

    zippy.file(fileName.split(".")[0] + extension, imageData.split(",")[1], {
      base64: true,
    });
  }

  zippy
    .generateAsync({
      type: "blob",
      compression: "DEFLATE",
      compressionOptions: {
        level: 5,
      },
    })
    .then((zip_archive) => {
      saveAs(zip_archive, "images.zip");
    });
}
