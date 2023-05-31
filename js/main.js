
import { inactivateForm, activateFilters } from './form.js';
import {createLoader} from './user-dates.js';
import { initForm } from './user-form.js';
import { createMapController, startCoordinate, ZOOM } from './map.js';
import { createMarkerAdder } from './markers.js';
import { showErrorPopup } from './server-error-popup.js';
import './form-success-popup.js';
import './form-error-popup.js';


inactivateForm();
const mapController = createMapController(startCoordinate, ZOOM);
initForm(mapController);

const handleOfferCards = (offerCards) => {
  const addMarkers = createMarkerAdder(mapController.map);
  addMarkers(offerCards);
  activateFilters();
};

const renderOfferCards = createLoader(
  handleOfferCards,
  () => showErrorPopup('ошибка загрузки данных', 5000)
);

renderOfferCards();

import './map.js';
import './slider.js';
