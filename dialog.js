import { apply } from "./svgs.js";

export const dialog = (inputValue) => {
  let afterCloseFunc;
  const afterClose = (func) => {
    afterCloseFunc = () => func(input.value);
  }
  const dialog = document.createElement('div');
  dialog.classList.add('dialog');
  dialog.innerHTML = `
    <div class="input-wrapper">
      <input id="input">
      <div class="apply" id="apply">${apply}</div>
    </div>
  `;
  document.body.appendChild(dialog);
  const input = document.getElementById('input');
  if (inputValue) {
    input.value = inputValue;
  }
  const applyHTML = document.getElementById('apply');
  const close = () => {
    if (afterCloseFunc) {
      dialog.remove();
      afterCloseFunc();
    }
  };
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      close();
    }
  });
  applyHTML.addEventListener('click', close);
  return {afterClose};
}