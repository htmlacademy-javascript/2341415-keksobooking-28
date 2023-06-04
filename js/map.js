import { activateForm } from './form.js';
import { ZOOM, MAIN_PIN_MARKER_START_POSITION } from './config.js';

const addressField = document.querySelector('#address');
const startCoordinate = L.latLng(MAIN_PIN_MARKER_START_POSITION);

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

const createMap = (aMainPinMarker) => {

  const theMap = initMap();
  const titleLayer = createTitleLayer();
  titleLayer.addTo(theMap);
  setAddresToStartCoordinate();

  aMainPinMarker.addTo(theMap);

  return theMap;
};

const createMapController = () => {
  const mainMarker = createMainPinMarker();
  const map = createMap(mainMarker);
  const markerGroup = L.layerGroup().addTo(map);

  const resetMap = () => map.setView(startCoordinate, ZOOM);

  const resetMainPinMarkerCoordinates = () => mainMarker.setLatLng(startCoordinate);

  const clearMarkers = () => markerGroup.clearLayers();

  const addMarkers = (markers) => {
    markers.forEach((marker) => marker.addTo(markerGroup));
  };

  const reset = () => {
    resetMap();
    resetMainPinMarkerCoordinates();
    clearMarkers();
  };

  return { addMarkers, reset, clearMarkers };
};

export { createMapController, startCoordinate, ZOOM };
