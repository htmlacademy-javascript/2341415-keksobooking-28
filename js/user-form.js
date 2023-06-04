import { createSuccessMessage } from './form-success-popup.js';
import { createErrorMessage } from './form-error-popup.js';
import { startCoordinate } from './map.js';
import { MIN_PRICE_PER_NIGHT } from './config.js';
import { hide, show, disable, enable } from './util.js';
import { handleOfferCards } from './main.js';

const form = document.querySelector('.ad-form');
const capacityGuestsField = form.querySelector('[name="capacity"]');
const roomNumberField = form.querySelector('[name="rooms"]');
const publicationButton = document.querySelector('.ad-form__submit');
const addressField = document.querySelector('#address');
const priceElement = form.querySelector('[name="price"]');
const type = form.querySelector('[name="type"]');
const checkIn = form.querySelector('[name="timein"]');
const checkOut = form.querySelector('[name="timeout"]');
const resetButton = document.querySelector('.ad-form__reset');
const previewUserPhoto = document.querySelector('.ad-form__photo img');
const previewAvatar = document.querySelector('.ad-form-header__preview img');

class MyPrestine extends Pristine {
  removeValidators(item) {
    const itemData = this.fields.find((it) => it.input === item);

    if (itemData) {
      itemData.validators = [];
    }
  }
}

const createValidator = () => {
  const isCapacityAndRoomNumberСorrespond = (capacity, roomNumber) => {
    if (capacity === 0) {
      return roomNumber === 100;
    }

    if (roomNumber === 100) {
      return capacity === 0;
    }

    return capacity <= roomNumber;
  };

  const validateCapacity = (capacityGuestsStr) => {
    const roomNumber = +roomNumberField.value;
    const capacity = +capacityGuestsStr;

    return isCapacityAndRoomNumberСorrespond(capacity, roomNumber);
  };

  const validateRoomNumber = (roomNumberStr) => {
    const roomNumber = +roomNumberStr;
    const capacity = +capacityGuestsField.value;

    return isCapacityAndRoomNumberСorrespond(capacity, roomNumber);
  };

  const pristine = new MyPrestine(form, {
    classTo: 'ad-form__element',
    errorClass: 'form__item--invalid',
    errorTextParent: 'ad-form__element',
    errorTextTag: 'span',
    errorTextClass: 'ad-form__label__error-text'
  });

  pristine.addValidator(
    capacityGuestsField,
    validateCapacity,
    'Выберите другое количество'
  );

  pristine.addValidator(
    roomNumberField,
    validateRoomNumber,
    'Выберите другое количество'
  );

  const validateOnEvent = (evt) => {
    evt.preventDefault();
    pristine.validate();
  };

  roomNumberField.addEventListener('change', validateOnEvent);
  capacityGuestsField.addEventListener('change', validateOnEvent);

  return pristine;
};

const getSuccessMessage = () => {
  const message = document.querySelector('.success');

  if (message) {
    message.classList.remove('hidden');
  }

  return message ?? createSuccessMessage();
};

const onEscapeKeyDown = (fn) => {
  document.addEventListener('keydown', (evt) => {
    if (evt.key === 'Escape') {
      fn(evt);
    }
  });
};

const onAnyClick = (fn) => document.addEventListener('click', fn);

const clearImage = (el) => {
  el.src = 'img/muffin-grey.svg';
};

const getErrorMessage = () => {
  const message = document.querySelector('.error');
  return message ?? createErrorMessage();
};

const onForSendingError = () => {
  const errorMessage = getErrorMessage();
  show(errorMessage);
  onEscapeKeyDown(() => hide(errorMessage));
  onEscapeKeyDown(() => enable(publicationButton));
  onAnyClick(() => hide(errorMessage));
  onAnyClick(() => enable(publicationButton));
  disable(publicationButton);
};

const sendForm = (formData, onSuccess, onError) =>
  fetch(
    'https://28.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body: formData,
      // headers: {
      //   'Content-Type': 'multipart/form-data',
      // },
    },
  ).then(
    (res) => {
      // throw new Error('meow');
      if (res.ok) {
        onSuccess();
      }
    }
  ).catch(onError);

const initForm = (mapContoller, onResetFns, onSubmitFns) => {
  const pristine = createValidator();

  type.addEventListener('change', (evt) => {
    evt.preventDefault();
    const minPrice = MIN_PRICE_PER_NIGHT[evt.target.value];
    changePricePerNight(minPrice);

    return evt.target.value;
  });

  function changePricePerNight(minPrice) {
    priceElement.placeholder = minPrice;
    pristine.removeValidators(priceElement);

    pristine.addValidator(
      priceElement,
      (value) => +value >= minPrice,
      `Минимальная цена: ${minPrice}`
    );
  }

  checkIn.addEventListener('change', (evt) => {
    evt.preventDefault();
    const checkInTime = evt.target.value;
    checkOut.value = checkInTime;
  });

  checkOut.addEventListener('change', (evt) => {
    evt.preventDefault();
    const checkOutTime = evt.target.value;
    checkIn.value = checkOutTime;
  });

  resetButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    mapContoller.reset();
    form.reset();
    addressField.value = `lat: ${startCoordinate.lat.toFixed(5)}, lng: ${startCoordinate.lng.toFixed(5)}`;
    clearImage(previewAvatar);
    clearImage(previewUserPhoto);
    handleOfferCards();
  });

  onResetFns.forEach((fn) => resetButton.addEventListener('click', fn));

  const onSuccessfullFormSending = () => {
    form.reset();
    mapContoller.reset();
    addressField.value = `lat: ${startCoordinate.lat.toFixed(5)}, lng: ${startCoordinate.lng.toFixed(5)}`;

    const successMessage = getSuccessMessage();
    onEscapeKeyDown(() => hide(successMessage));
    onEscapeKeyDown(() => enable(publicationButton));
    onAnyClick(() => hide(successMessage));
    onAnyClick(() => enable(publicationButton));
  };

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();

    if (isValid) {
      const formData = new FormData(evt.target);
      sendForm(formData, onSuccessfullFormSending, onForSendingError);
      disable(publicationButton);
      clearImage(previewAvatar);
      clearImage(previewUserPhoto);
    }

  });

  onSubmitFns.forEach((fn) => form.addEventListener('submit', fn));
};

export { initForm };
