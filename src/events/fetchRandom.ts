import { configuration } from "../config";
import { addImage } from "./file";

export async function handleFetch(_: Event) {
  if (configuration.busy) return;
  configuration.busy = true;
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

  configuration.busy = false;
}
