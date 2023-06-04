import { MIN_PRICE_PER_NIGHT } from './config.js';

const sliderElement = document.querySelector('.ad-form__slider');
const priceElement = document.querySelector('[name="price"]');
const typeEl = document.querySelector('#type');

const slider = noUiSlider.create(sliderElement, {
  range: {
    min: 0,
    max: 100000,
  },
  start: 0,
  step: 1,
  connect: 'lower',
  format: {
    to(value) {
      return value.isInteger ? value.toFixed(0) : value.toFixed(0);
    },
    from(value) {
      return parseFloat(value);
    },
  },
});

typeEl.addEventListener('change', (evt) => {
  slider.updateOptions({ range: { min: MIN_PRICE_PER_NIGHT[evt.target.value], max: 100000 } });
  return evt.target.value;
});

slider.on(
  'update',
  () => {
    priceElement.value = sliderElement.noUiSlider.get();
  }
);

priceElement.addEventListener(
  'change',
  () => slider.set(priceElement.value)
);
