import { CARDS_COUNT } from './config.js';

const filtersFormEl = document.querySelector('.map__filters');

const getFilters = () => {
  const formData = new FormData(filtersFormEl);

  return {
    type: formData.get('housing-type'),
    price: formData.get('housing-price'),
    guestsCount: formData.get('housing-guests'),
    roomsCount: formData.get('housing-rooms'),
    features: formData.getAll('features'),
  };
};


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

  const process = () => {
    onUpdateFns.forEach((fn) => fn(filteredCards));
  };

  const update = () => {
    filteredCards = filterCards(offerCards);
    process();
  };

  filtersFormEl.addEventListener('change', update);

  return { process, update };
};

export { filterCards, createStore };
