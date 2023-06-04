
import { inactivateForm, activateFilters } from './form.js';
import {createLoader} from './user-dates.js';
import { initForm } from './user-form.js';
import { createMapController } from './map.js';
import { createMarkerOf } from './markers.js';
import { showErrorPopup } from './server-error-popup.js';
import './form-success-popup.js';
import './form-error-popup.js';
import './map.js';
import './slider.js';
import { createStore } from './store.js';
import { debounce } from './util.js';
import { RERENDER_DELAY } from './config.js';
import './avatar.js';
import './user-photo.js';
import { resetFilters } from './filters.js';

inactivateForm();

const mapController = createMapController();

const handleOfferCards = (offerCards) => {
  const updateOfferCardsMarkers = (filteredCards) => {
    mapController.clearMarkers();
    const markers = filteredCards.map((card) => createMarkerOf(card));
    mapController.addMarkers(markers);
  };

  const store = createStore(
    offerCards,
    [
      debounce(updateOfferCardsMarkers, RERENDER_DELAY),
    ]
  );

  initForm(
    mapController,
    [
      resetFilters,
      () => store.update()
    ],
    [
      resetFilters,
      () => store.update()
    ],
  );

  store.notify();
  activateFilters();

  return updateOfferCardsMarkers;
};

const appStart = createLoader(
  handleOfferCards,
  () => showErrorPopup('ошибка загрузки данных', 5000)
);

appStart();

export { handleOfferCards };
