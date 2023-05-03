const form = document.querySelector('.ad-form');
const capacityGuestsField = form.querySelector('[name="capacity"]');
const roomNumberField = form.querySelector('[name="rooms"]');

class MyPrestine extends Pristine {
  removeValidators(item) {
    const itemData = this.fields.find((it) => it.input === item);

    if (itemData) {
      itemData.validators = [];
    }
  }
}

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

const minPricePerNightForTypeOfAccomodation = {
  'bungalow': 0,
  'flat': 1000,
  'hotel': 3000,
  'house': 5000,
  'palace': 10000,
};

const type = form.querySelector('[name="type"]');

type.addEventListener('change', (evt) => {
  const minPrice = minPricePerNightForTypeOfAccomodation[evt.target.value];
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
  pristine.validate();
});

checkOut.addEventListener('change', (evt) => {
  evt.preventDefault();
  const checkOutTime = evt.target.value;
  checkIn.value = checkOutTime;
  pristine.validate();
});

form.addEventListener('submit', validateOnEvent);

pristine.validate();
