export default function promiseClick(button) {
  return new Promise((result) => {
    button.addEventListener('click', result, { once: true });
  });
}
