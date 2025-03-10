import { configuration, ImageType, ImageTypes } from "../config";
import { appendError } from "../error";

const formatSelect = document.getElementById("format") as HTMLSelectElement;

export function handleFormatChange(_: Event) {
  if (!ImageTypes.has(formatSelect.value)) {
    appendError("Wrong format was selected [formatChange]");
    return;
  }

  configuration.changeFormat(formatSelect.value as ImageType);
}
formatSelect?.addEventListener("change", handleFormatChange);
