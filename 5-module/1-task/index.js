function hideSelf() {
  const button = document.querySelector(".hide-self-button");
  if (!button) return;

  button.addEventListener("click", () => (button.hidden = true), { once: true });
}
