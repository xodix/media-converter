import { configuration } from "../config";
import { addThrobber, removeThrobber } from "../throbber";
import { addImage } from "./file";

export async function handleFetch(_: Event) {
  if (configuration.busy) return;
  configuration.busy = true;

  const centerElement = (document.getElementById("fetch") as HTMLDivElement)
    .children[0] as HTMLDivElement;
  addThrobber(centerElement);

  const images = [];
  // Improve performance more
  for (let i = 0; i < 5; i++) {
    const image = fetch(
      `https://picsum.photos/${configuration.width}/${configuration.height}`,
      { method: "GET" }
    );
    images.push(image);
  }
  images.forEach(async (response, i) => {
    const imageURL = URL.createObjectURL(await (await response).blob());
    const image = new Image(configuration.width, configuration.height);
    image.src = imageURL;
    image.alt = "randomPicture" + i;
    image.onload = addImage;
  });

  Promise.all(images).then(() => {
    removeThrobber(centerElement);
    configuration.busy = false;
  });
}
