import { CARDS_COUNT } from './config.js';
import { getFilters, onFiltersChange } from './filters.js';

const getTypePredicate = (type) => (card) => card.offer.type === type;
const getGuestsPredicate = (guestsCount) => (card) => card.offer.guests.toString() === guestsCount;
const getPricePredicate = (price) => (card) => {
  let priceStr = '';
  if(card.offer.price >= 10000 && card.offer.price <= 50000) {
    priceStr = 'middle';
    return priceStr === price;
  }

  if(card.offer.price < 10000) {
    priceStr = 'low';
    return priceStr === price;
  }

  if(card.offer.price > 50000) {
    priceStr = 'high';
    return priceStr === price;
  }
};

const getFeaturesPredicate = (features) => (card) => card.offer.features
  ? features.every((feature) => card.offer.features.includes(feature))
  : false;

const getRoomsPredicate = (rooms) => (card) => card.offer.rooms.toString() === rooms;

const filterCards = (offerCards) => {
  let filtered = offerCards;

  const { type, price, guestsCount, roomsCount, features } = getFilters();

  if (type && type !== 'any') {
    filtered = filtered.filter(getTypePredicate(type));
  }

  if (guestsCount && guestsCount !== 'any') {
    filtered = filtered.filter(getGuestsPredicate(guestsCount));
  }

  if (price && price !== 'any') {
    filtered = filtered.filter(getPricePredicate(price));
  }

  if (roomsCount && roomsCount !== 'any') {
    filtered = filtered.filter(getRoomsPredicate(roomsCount));
  }

  if (features && features !== '') {
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
