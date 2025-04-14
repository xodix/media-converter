import JSZip from "jszip";
import { appendError, resetError } from "../error";
import saveAs from "file-saver";
import { configuration } from "../config";
import { addThrobber, removeThrobber } from "../throbber";

// TODO: Throbber fires after file download
export function handleSubmit(e: Event) {
  e.preventDefault();
  if (configuration.busy) return;
  configuration.busy = true;

  const centerElement = (document.getElementById("download") as HTMLDivElement)
    .children[0] as HTMLDivElement;
  addThrobber(centerElement);

  resetError();
  let zippy = new JSZip();
  const images = configuration.imgs;

  const extension = "." + configuration.outputFormat.substring(6);
  for (let i = 0; i < images.length; i++) {
    const { canvas, fileName } = images[i];
    if (canvas === null) {
      appendError("Could not get the canvas. [submit]");
      return;
    }
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
      removeThrobber(centerElement);
      configuration.busy = false;
    });
}
