import { CARDS_COUNT, PRICE, ANY, PRICE_FILTER } from './config.js';
import { getFilters, onFiltersChange } from './filters.js';

const getTypePredicate = (type) => (card) => card.offer.type === type;
const getGuestsPredicate = (guestsCount) => (card) => card.offer.guests.toString() === guestsCount;
const getPricePredicate = (price) => (card) => {
  if(price === PRICE_FILTER.LOW) {
    return card.offer.price <= PRICE.LOW;
  }

  if(price === PRICE_FILTER.HIGH) {
    return card.offer.price > PRICE.HIGH;
  }

  return card.offer.price > PRICE.LOW && card.offer.price < PRICE.HIGH;
};

const getFeaturesPredicate = (features) => (card) => card.offer.features
  ? features.every((feature) => card.offer.features.includes(feature))
  : false;

const getRoomsPredicate = (rooms) => (card) => card.offer.rooms.toString() === rooms;

const filterCards = (offerCards) => {
  let filtered = offerCards;

  const { type, price, guestsCount, roomsCount, features } = getFilters();

  if (type && type !== ANY) {
    filtered = filtered.filter(getTypePredicate(type));
  }

  if (guestsCount && guestsCount !== ANY) {
    filtered = filtered.filter(getGuestsPredicate(guestsCount));
  }

  if (price && price !== ANY) {
    filtered = filtered.filter(getPricePredicate(price));
  }

  if (roomsCount && roomsCount !== ANY) {
    filtered = filtered.filter(getRoomsPredicate(roomsCount));
  }

  if (features) {
    filtered = filtered.filter(getFeaturesPredicate(features));
  }

  return filtered.slice(0, CARDS_COUNT);
};

/**
 * @param offerCards - list of offer cards
 * @param onUpdateFns - array of functions, interface (filteredCards) => {...}
 */
const createStore = (offerCards, onUpdateFns) => {
  let filteredCards = filterCards(offerCards);

  const notify = () => onUpdateFns.forEach((fn) => fn(filteredCards));

  const update = () => {
    filteredCards = filterCards(offerCards);
    notify();
  };

  onFiltersChange(update);

  return { notify, update };
};

export { filterCards, createStore };
