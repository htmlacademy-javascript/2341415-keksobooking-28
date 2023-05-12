import { activateForm } from './form.js';
import { offerDescriptions } from './data.js';
import { TYPES } from './templates.js';
import { createFeatureFragment } from './templates.js'

const startCoordinate = L.latLng({
  lat: 35.68950,
  lng: 139.69200,
});

const ZOOM = 10;

const map = L.map('map-canvas')
  .on('load', () => {
    activateForm();
  })
  .setView(startCoordinate, ZOOM);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  maxZoom: 19,
  attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

const mainPinIcon = L.icon({
  iconUrl:'./img/main-pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const pinIcon = L.icon({
  iconUrl:'./img/pin.svg',
  iconSize: [52, 52],
  iconAnchor: [26, 52],
});

const mainPinMarker = L.marker(
  startCoordinate,
  {
    draggable: true,
    icon: mainPinIcon,
  },
);


const addressField = document.querySelector('#address');
addressField.value = `lat: ${startCoordinate.lat.toFixed(5)}, lng: ${startCoordinate.lng.toFixed(5)}`;

mainPinMarker.on('moveend', (evt) => {
  console.log(evt.target.getLatLng());
  const latLngPinMarker = evt.target.getLatLng();
  addressField.value = `lat: ${latLngPinMarker.lat.toFixed(5)}, lng: ${latLngPinMarker.lng.toFixed(5)}`;
  console.log('addressField:', addressField)
  console.log('latLngPinMarker:', latLngPinMarker)
});

mainPinMarker.addTo(map);


const createCustomPopup = ({title, address: {lat, lng}, price, type, rooms, guests, checkin, checkout, features, description, photos}, author) => {

  const balloonTemplate = document.querySelector('#card').content.querySelector('.popup');

  const popupElement = balloonTemplate.cloneNode(true);

  popupElement.querySelector('.popup__avatar');
  popupElement.querySelector('.popup__title').textContent = title;
  popupElement.querySelector('.popup__text--address').textContent = `Координаты: ${lat}, ${lng}`;
  const spanPrice = balloonTemplate.querySelector('.popup__text--price span');
  popupElement.querySelector('.popup__text--price').textContent = `${price} ${spanPrice.textContent}`;
  popupElement.querySelector('.popup__type').textContent = TYPES[type];
  popupElement.querySelector('.popup__text--capacity').textContent = `${rooms} комнаты для ${guests} гостей`;
  popupElement.querySelector('.popup__text--time').textContent = `Заезд после ${checkin}, выезд до ${checkout}`;
  const featuresElement = popupElement.querySelector('.popup__features');

  featuresElement.innerHTML = '';
  const featureFragment = createFeatureFragment(features);

  featuresElement.append(featureFragment);

  const descriptionEl = popupElement.querySelector('.popup__description');
  descriptionEl.textContent = description;
  const photosElement = popupElement.querySelector('.popup__photos');
  const photo = popupElement.querySelector('.popup__photo');
  photos.forEach((it) => {
    const photoClone = photo.cloneNode();
    photoClone.src = it;
    photosElement.append(photoClone);
  });
  photosElement.removeChild(photosElement.firstElementChild);
  const avatar = popupElement.querySelector('.popup__avatar');
  // console.log('avatar:', avatar)
  avatar.src = author.avatar;

  if(description === '') {
    descriptionEl.classList.add('hidden');
  }

  if(features.length === 0) {
    featuresElement.classList.add('hidden');
  }

  if(author.avatar === '') {
    avatar.classList.add('hidden');
  }

  if(photos.length === 0) {
    photosElement.classList.add('hidden');
  }

  return popupElement;
};

const markerGroup = L.layerGroup().addTo(map);

const createMarker = ({location: {lat, lng}, offer, author}) => {
  const latLng = L.latLng({ lat, lng });
  const marker = L.marker(
    latLng,
    {
      icon: pinIcon,
    },
  );

  marker
    .addTo(markerGroup)
    .bindPopup(createCustomPopup(offer, author));
};

offerDescriptions.forEach((location, offer, author) => {
  createMarker(location, offer, author);
});

// markerGroup.clearLayers();

const publicationButton = document.querySelector('.ad-form__submit');

publicationButton.addEventListener('submit', () => { // не срабатывает при отправке
  mainPinMarker.setLatLng(startCoordinate);
  map.setView(startCoordinate, ZOOM);
});
