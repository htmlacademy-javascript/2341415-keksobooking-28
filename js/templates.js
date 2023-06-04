const TYPES = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const createFeatureElement = (feature) => {
  const el = document.createElement('li');
  el.classList.add('popup__feature');
  el.classList.add(`popup__feature--${feature}`);

  return el;
};

const createFeatureFragment = (features) => {
  const fragment = document.createDocumentFragment();
  features.forEach((feature) => fragment.append(createFeatureElement(feature)));

  return fragment;
};

export { TYPES, createFeatureFragment };
