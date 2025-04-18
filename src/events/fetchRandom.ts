import { configuration } from "../config";
import { redrawImages, redrawInitial } from "../draw";
import { addThrobber, removeThrobber } from "../throbber";

const imagesElement = document.getElementById("images") as HTMLDivElement;

export async function handleFetch(_: Event) {
  if (configuration.busy) return;
  configuration.busy = true;

  const centerElement = (document.getElementById("fetch") as HTMLDivElement)
    .children[0] as HTMLDivElement;
  addThrobber(centerElement);

  const images: Promise<Response>[] = [];
  // Improve performance more
  for (let i = 0; i < 5; i++) {
    const image = fetch(
      `https://picsum.photos/${configuration.width}/${configuration.height}`,
      { method: "GET" }
    );
    images.push(image);
  }
  let x = 0;

  images.forEach(async (response, i) => {
    const imageURL = URL.createObjectURL(await (await response).blob());
    const canvas = document.createElement("canvas");
    canvas.width = configuration.width;
    canvas.height = configuration.height;

    configuration.addImage({
      canvas: canvas,
      imageURL,
      fileName: "random-file" + i,
    });
    imagesElement.appendChild(canvas);
    x++;

    if (x === images.length) {
      redrawImages();
      configuration.busy = false;
      removeThrobber(centerElement);
    }
  });
}
