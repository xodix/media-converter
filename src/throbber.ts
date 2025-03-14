const throbber = document.createElement("div");
throbber.className = "throbber";

export function addThrobber(element: HTMLElement) {
  element.appendChild(throbber);
}

export function removeThrobber(element: HTMLElement) {
  element.removeChild(throbber);
}
