import { createSuccessMessage } from './form-success-popup.js';
import { createErrorMessage } from './form-error-popup.js';
import { MIN_PRICE_PER_NIGHT, NOT_FOR_GUESTS_ROOM_NUMBER } from './config.js';
import { hide, show, disable, enable } from './util.js';

const form = document.querySelector('.ad-form');
const capacityGuestsField = form.querySelector('[name="capacity"]');
const roomNumberField = form.querySelector('[name="rooms"]');
const publicationButton = document.querySelector('.ad-form__submit');
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
      return roomNumber === NOT_FOR_GUESTS_ROOM_NUMBER;
    }

    if (roomNumber === NOT_FOR_GUESTS_ROOM_NUMBER) {
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

const addEscapeKeyDownOnlyOneslistener = (fn) => {
  const listen = (evt) => {
    if (evt.key === 'Escape') {
      fn(evt);
      document.removeEventListener('keydown', listen);
    }
  };

  document.addEventListener('keydown', listen);
};

const addAnyClickOnlyOnesListener = (fn) => {
  const listener = (evt) => {
    fn(evt);
    document.removeEventListener('click', listener);
  };

  document.addEventListener('click', listener);
};

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
  addEscapeKeyDownOnlyOneslistener(() => hide(errorMessage));
  addEscapeKeyDownOnlyOneslistener(() => enable(publicationButton));
  addAnyClickOnlyOnesListener(() => hide(errorMessage));
  addAnyClickOnlyOnesListener(() => enable(publicationButton));
  disable(publicationButton);
};

const sendForm = (formData, onSuccess, onError) =>
  fetch(
    'https://28.javascript.pages.academy/keksobooking',
    {
      method: 'POST',
      body: formData
    },
  ).then(
    (res) => {
      if (res.ok) {
        onSuccess();
      }
    }
  ).catch(onError);

const initForm = (mapContoller, onResetFns, onSubmitFns) => {
  const pristine = createValidator();

  const changePricePerNight = (minPrice) => {
    priceElement.placeholder = minPrice;
    pristine.removeValidators(priceElement);

    pristine.addValidator(
      priceElement,
      (value) => +value >= minPrice,
      `Минимальная цена: ${minPrice}`
    );
  };

  type.addEventListener('change', (evt) => {
    evt.preventDefault();
    const minPrice = MIN_PRICE_PER_NIGHT[evt.target.value];
    changePricePerNight(minPrice);

    return evt.target.value;
  });

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
    clearImage(previewAvatar);
    clearImage(previewUserPhoto);
  });

  onResetFns.forEach((fn) => resetButton.addEventListener('click', fn));

  const onSuccessfullFormSending = () => {
    form.reset();
    mapContoller.reset();

    const successMessage = getSuccessMessage();
    addEscapeKeyDownOnlyOneslistener(() => hide(successMessage));
    addEscapeKeyDownOnlyOneslistener(() => enable(publicationButton));
    addAnyClickOnlyOnesListener(() => hide(successMessage));
    addAnyClickOnlyOnesListener(() => enable(publicationButton));
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
