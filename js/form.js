const form = document.querySelector('.ad-form');
const fieldsetForm = form.querySelectorAll('fieldset');
const mapFilters = document.querySelector('.map__filters');
const fieldsetMap = mapFilters.querySelectorAll('fieldset');
const selectMap = mapFilters.querySelectorAll('select');

const inactivateForm = () => {

  form.classList.add('ad-form--disabled');
  mapFilters.classList.add('map__filters--disabled');

  fieldsetForm.forEach((it) => it.setAttribute('disabled', 'disabled'));
  fieldsetMap.forEach((it) => it.setAttribute('disabled', 'disabled'));
  selectMap.forEach((it) => it.setAttribute('disabled', 'disabled'));

};

const activateForm = () => {
  form.classList.remove('ad-form--disabled');
  mapFilters.classList.remove('map__filters--disabled');

  fieldsetForm.forEach((it) => it.removeAttribute('disabled'));
  fieldsetMap.forEach((it) => it.removeAttribute('disabled'));
  selectMap.forEach((it) => it.removeAttribute('disabled'));
};

export { inactivateForm, activateForm};
