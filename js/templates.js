const TYPES = {
  flat: 'Квартира',
  bungalow: 'Бунгало',
  house: 'Дом',
  palace: 'Дворец',
  hotel: 'Отель',
};

const cardTemplate = document.querySelector('#card')
  .content
  .querySelector('.popup');

const cardList = document.querySelector('#map-canvas');

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

const createCard = ({offer, author}) => {
  const card = cardTemplate.cloneNode(true);
  const popupTitle = card.querySelector('.popup__title');
  const popupAddress = card.querySelector('.popup__text--address');
  const popupPrice = card.querySelector('.popup__text--price');
  const popupType = card.querySelector('.popup__type');
  const popupCapacity = card.querySelector('.popup__text--capacity');
  const popupTimeCheckInOff = card.querySelector('.popup__text--time');
  const popupDescription = card.querySelector('.popup__description');
  const popupFeatures = card.querySelector('.popup__features');
  const popupPhotos = card.querySelector('.popup__photos');
  const popupAvatar = card.querySelector('.popup__avatar');
  popupFeatures.innerHTML = '';
  const featureFragment = createFeatureFragment(offer.features);
  popupFeatures.append(featureFragment);
  const photo = card.querySelector('.popup__photo');
  offer.photos.forEach((it) => {
    const photoClone = photo.cloneNode();
    photoClone.src = it;
    popupPhotos.append(photoClone);
  });
  popupPhotos.removeChild(popupPhotos.firstElementChild);

  popupTitle.textContent = offer.title;
  popupAddress.textContent = `${offer.address.lat} с.ш. ${offer.address.lng} в.д.`;
  popupPrice.textContent = `${offer.price} ₽/ночь`;
  popupType.textContent = TYPES[offer.type];
  popupCapacity.textContent = `${offer.rooms} комнат для ${offer.guests} гостей`;
  popupTimeCheckInOff.textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;

  if(offer.description === '') {
    popupDescription.classList.add('hidden');
  } popupDescription.textContent = offer.description;
  popupAvatar.src = author.avatar;

  return card;
};

const renderCards = (cards, container = cardList) => {
  const fragment = document.createDocumentFragment();
  const card = cards[0];
  const cardElement = createCard(card);
  fragment.append(cardElement);
  container.appendChild(fragment);
};

export { renderCards };
