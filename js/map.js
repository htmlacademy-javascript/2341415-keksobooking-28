import { activateForm } from './form.js';

const addressField = document.querySelector('#address');

const startCoordinate = L.latLng({
  lat: 35.68950,
  lng: 139.69200,
});

const ZOOM = 10;

const getLatLangStr = ({ lat, lng }) => `lat: ${lat.toFixed(5)}, lng: ${lng.toFixed(5)}`;

const createMainPinIcon = () =>
  L.icon({
    iconUrl:'./img/main-pin.svg',
    iconSize: [52, 52],
    iconAnchor: [26, 52],
  });

const createMainPinMarker = () => {
  const marker = L.marker(
    startCoordinate,
    {
      draggable: true,
      icon: createMainPinIcon(),
    }
  );

  marker.on('moveend', (evt) => {
    const latLngPinMarker = evt.target.getLatLng();
    addressField.value = getLatLangStr(latLngPinMarker);
  });

  return marker;
};

const mainPinMarker = createMainPinMarker();

const setAddresToStartCoordinate = () => {
  addressField.value = getLatLangStr(startCoordinate);
};

const createTitleLayer = () => {
  const options = {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
  };

  return L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', options);
};

const initMap = () => L.map('map-canvas')
  .on('load', () => activateForm())
  .setView(startCoordinate, ZOOM);

function createMap(aMainPinMarker) {

  const theMap = initMap();
  const titleLayer = createTitleLayer();
  titleLayer.addTo(theMap);
  setAddresToStartCoordinate();

  aMainPinMarker.addTo(theMap);

  return theMap;
}

const createMapController = (aStartCoordinate, aZOOM) => {
  const mainMarker = createMainPinMarker();
  const map = createMap(mainMarker);

  const resetMap = () => map.setView(aStartCoordinate, aZOOM);
  const resetMainPinMarkerCoordinates = () => mainMarker.setLatLng(aStartCoordinate);

  const reset = () => {
    resetMap();
    resetMainPinMarkerCoordinates();
  };

  return { map, reset };
};

export { createMapController, startCoordinate, ZOOM };
