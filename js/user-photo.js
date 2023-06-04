import { FILE_TYPES } from './config.js';

const fileChooser = document.querySelector('.ad-form__upload input[type=file]');
const preview = document.querySelector('.ad-form__photo img');

fileChooser.addEventListener('change', () => {
  const file = fileChooser.files[0];
  const fileName = file.name.toLowerCase();
  const matches = FILE_TYPES.some((it) => fileName.endsWith(it));
  if (matches) {
    preview.src = URL.createObjectURL(file);
  }
});
