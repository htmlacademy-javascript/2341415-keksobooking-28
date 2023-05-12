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
  const title = card.querySelector('.popup__title');
  const address = card.querySelector('.popup__text--address');
  const price = card.querySelector('.popup__text--price');
  const type = card.querySelector('.popup__type');
  const capacity = card.querySelector('.popup__text--capacity');
  const timeCheckInOff = card.querySelector('.popup__text--time');
  const description = card.querySelector('.popup__description');
  const photos = card.querySelector('.popup__photos');
  const avatar = card.querySelector('.popup__avatar');
  const features = card.querySelector('.popup__features');
  features.innerHTML = '';
  const featureFragment = createFeatureFragment(offer.features);
  features.append(featureFragment);
  const photo = card.querySelector('.popup__photo');
  offer.photos.forEach((it) => {
    const photoClone = photo.cloneNode();
    photoClone.src = it;
    photos.append(photoClone);
  });
  photos.removeChild(photos.firstElementChild);

  title.textContent = offer.title;
  address.textContent = `${offer.address.lat} с.ш. ${offer.address.lng} в.д.`;
  price.textContent = `${offer.price} ₽/ночь`;
  type.textContent = TYPES[offer.type];
  capacity.textContent = `${offer.rooms} комнат для ${offer.guests} гостей`;
  timeCheckInOff.textContent = `Заезд после ${offer.checkin}, выезд до ${offer.checkout}`;

  if(offer.description === '') {
    description.classList.add('hidden');
  } description.textContent = offer.description;
  avatar.src = author.avatar;

  return card;
};

// const renderCards = (cards, container = cardList) => {
//   const fragment = document.createDocumentFragment();
//   const card = cards[0];
//   const cardElement = createCard(card);
//   fragment.append(cardElement);
//   container.appendChild(fragment);
// };

// export { renderCards };
export { TYPES, createFeatureFragment };
