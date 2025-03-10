import { configuration, ImageType } from "../config";

const formatSelect = document.getElementById("format") as HTMLSelectElement;
export function handleFormatChange(_: Event) {
  configuration.changeFormat(formatSelect.value as ImageType);
}
