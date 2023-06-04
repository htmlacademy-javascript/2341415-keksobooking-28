import { TYPES } from './templates.js';
import { createFeatureFragment } from './templates.js';
import { hide } from './util.js';

const clean = (el) => {
  el.innerHTML = '';
};

const hideIfEmpty = (el) => {
  if (!el.innerHTML.trim() === '') {
    hide(el);
  }
};

const setTitle = (popupElement, title) => {
  popupElement.querySelector('.popup__title').textContent = title;
};

const clonePopup = () => {
  const balloonTemplate = document.querySelector('#card').content.querySelector('.popup');
  return balloonTemplate.cloneNode(true);
};

const setAddres = (popupElement, address) => {
  popupElement.querySelector('.popup__text--address').textContent = address;

};

const setPrice = (popupElement, price, postfix = '₽/ночь') => {
  popupElement.querySelector('.popup__text--price').textContent = `${price} ${postfix}`;
};

const setType = (popupElement, type) => {
  popupElement.querySelector('.popup__type').textContent = TYPES[type];
};

const setCapacity = (popupElement, rooms, guests) => {
  popupElement.querySelector('.popup__text--capacity').textContent = `${rooms} комнаты для ${guests} гостей`;
};

const setTiming = (popupElement, checkin, checkout) => {
  popupElement.querySelector('.popup__text--time').textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
};

const setFeature = (popupElement, features) => {
  if (!features) {
    return;
  }

  const el = popupElement.querySelector('.popup__features');
  clean(el);

  const fragment = createFeatureFragment(features);
  el.append(fragment);

  hideIfEmpty(el);
};

const setDescription = (popupElement, description) => {
  const el = popupElement.querySelector('.popup__description');
  el.textContent = description;
  hideIfEmpty(el);
};

const createPhotoAdder = (containerEl, protoEl) => (src) => {
  const photoClone = protoEl.cloneNode();
  photoClone.src = src;
  containerEl.append(photoClone);
};

const setPhotos = (popupElement, photos) => {

  const el = popupElement.querySelector('.popup__photos');
  const photoElProto = popupElement.querySelector('.popup__photo');

  const addPhoto = createPhotoAdder(el, photoElProto);
  clean(el);

  if(!photos) {
    return;
  }
  photos.forEach(addPhoto);

  hideIfEmpty(el);
};

const setAvatar = (popupEl, avatar) => {
  const el = popupEl.querySelector('.popup__avatar');

  if (!avatar) {
    return hide(el);
  }

  el.src = avatar;
};

const createPopup = (offer, author) => {
  const { title, address, price, type, rooms, guests, checkin, checkout, features, description, photos } = offer;
  const popupEl = clonePopup();

  setTitle(popupEl, title);
  setAddres(popupEl, address);
  setPrice(popupEl, price);
  setType(popupEl, type);
  setCapacity(popupEl, rooms, guests);
  setTiming(popupEl, checkin, checkout);
  setFeature(popupEl, features);
  setDescription(popupEl, description);
  setPhotos(popupEl, photos);
  setAvatar(popupEl, author.avatar);

  return popupEl;
};

const createMarker = (location, icon) => L.marker(L.latLng(location), { icon });

const pinIcon = L.icon({
  iconUrl:'./img/pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const form = document.querySelector('.ad-form');

const createMarkerOf = (offerCard) => {
  const { location, offer, author } = offerCard;

  const marker = createMarker(location, pinIcon);
  const popupEl = createPopup(offer, author);

  marker.bindPopup(popupEl);

  form.addEventListener(
    'submit',
    () => {
      marker.closePopup();
    }
  );

  return marker;
};

export {
  createMarkerOf
};
