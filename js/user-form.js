import { createSuccessMessage } from './form-success-popup.js';
import { createErrorMessage } from './form-error-popup.js';
import { startCoordinate } from './map.js';

class MyPrestine extends Pristine {
  removeValidators(item) {
    const itemData = this.fields.find((it) => it.input === item);

    if (itemData) {
      itemData.validators = [];
    }
  }
}

const initForm = (mapContoller) => {
  const form = document.querySelector('.ad-form');
  const capacityGuestsField = form.querySelector('[name="capacity"]');
  const roomNumberField = form.querySelector('[name="rooms"]');
  const publicationButton = document.querySelector('.ad-form__submit');
  const mapFilters = document.querySelector('.map__filters');
  const addressField = document.querySelector('#address');

  const pristine = new MyPrestine(form, {
    classTo: 'ad-form__element',
    errorClass: 'form__item--invalid',
    // successClass: 'form__item--valid',
    errorTextParent: 'ad-form__element',
    errorTextTag: 'span',
    errorTextClass: 'ad-form__label__error-text'
  });

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

  const priceElement = form.querySelector('[name="price"]');

  const minPricePerNight = {
    'bungalow': 0,
    'flat': 1000,
    'hotel': 3000,
    'house': 5000,
    'palace': 10000,
  };

  const type = form.querySelector('[name="type"]');

  type.addEventListener('change', (evt) => {
    evt.preventDefault();
    const minPrice = minPricePerNight[evt.target.value];
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


  const checkIn = form.querySelector('[name="timein"]');
  const checkOut = form.querySelector('[name="timeout"]');

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

  const resetButton = document.querySelector('.ad-form__reset');

  resetButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    mapContoller.reset();
    form.reset();
    mapFilters.reset();
    console.log('addressField.value:', addressField.value)
    addressField.value = `lat: ${startCoordinate.lat.toFixed(5)}, lng: ${startCoordinate.lng.toFixed(5)}`;
    console.log('addressField.value:', addressField.value)
  });

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    const isValid = pristine.validate();
    if (isValid) {
      const formData = new FormData(evt.target);
      fetch(
        'https://28.javascript.pages.academy/keksobooking',
        {
          method: 'POST',
          body: formData,
          // headers: {
          //   'Content-Type': 'multipart/form-data',
          // },
        },
      )
        .then(
          (res) => {
            // throw new Error('meow');
            if (res.ok) {
              console.log('form was sent');
              console.log(res);
              publicationButton.disabled = false;
              form.reset();
              mapFilters.reset();
              mapContoller.reset();
              addressField.value = `lat: ${startCoordinate.lat.toFixed(5)}, lng: ${startCoordinate.lng.toFixed(5)}`;
              console.log('addressField.value:', addressField.value)

              const message = document.querySelector('.success');
              console.log('message:', message)

              if (message) {
                message.classList.remove('hidden');
              }

              const successMessage = message ?? createSuccessMessage();

              document.addEventListener('keydown', (evt) => {
                if (evt.key === 'Escape') {
                  successMessage.classList.add('hidden');
                }
              });

              document.addEventListener('click', () => {
                successMessage.classList.add('hidden');
              });
            }
          }
        )
        .catch(
          (err) => {
            console.log('err:', err)

            const message = document.querySelector('.error');
            const errorMessage = message ?? createErrorMessage();

            if (errorMessage) {
              errorMessage.classList.remove('hidden');
              console.log('errorMessage:', errorMessage)
            }

            document.addEventListener('keydown', (evt) => {
              if (evt.key === 'Escape') {
                errorMessage.classList.add('hidden');
              }
            });
            document.addEventListener('click', () => {
              errorMessage.classList.add('hidden');
            });

            publicationButton.disabled = false;
          }

        );

      publicationButton.disabled = true;
      console.log('publicationButton:', publicationButton)

    }

  });
};

export { initForm };
