import { positiveIntToString, unique } from './util.js';

const TYPES = [
  'palace',
  'flat',
  'house',
  'bungalow',
  'hotel'
];

const CHECKIN_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

const CHECKOUT_TIME = [
  '12:00',
  '13:00',
  '14:00'
];

const FEATURES = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

const DESCRIPTIONS = [
  'Самые компактные апартаменты площадью собственный санузел и удобное двуспальное место на антресоли.',
  'В наших апартаментах все пропитано люксом и роскошью, а воплощение дизайнерской идеи наших spa loft апартаментов точно не оставит Вас равнодушными.',
  'Апартаменты расположены в шаговой доступности от станции метро. Оснащены всем необходимым для комфортного проживания',
  'Уборка и дезинфекция проводятся после каждого заезда. Комфортное проживание гарантировано. Идеальный вариант для командированных сотрудников.',
  'Дизайнерский лофт отель в самом центре.',
  'Мы с заботой подготовили для Вас все самое необходимое для проживания в апартаментах: от зубной щётки до мягких полотенец и тапочек.',
  'Из небольшого, но честного минуса: апартаменты находятся на первом этаже.',
  'На автобусе/троллейбусе можно добраться почти до любого места в центре.',
  'Яркий, необычный апартамент в пентхаусе на 38-м этаже небоскреба.',
  'В апартаментах качественный ремонт, есть все необходимое для комфортного проживания.'
];


const PHOTOS = [
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/duonguyen-8LrGtIxxa4w.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/brandon-hoogenboom-SNxQGWxZQi0.jpg',
  'https://assets.htmlacademy.ru/content/intensive/javascript-1/keksobooking/claire-rendall-b6kAwr1i0Iw.jpg'
];

const TITLES = [
  'Прекрасная квартира рядом с рок-клубом',
  'Яркая студия-бесконтактный заезд и выезд',
  'Светлое и уютное жильё в центре',
  'Апартаменты в небоскребе',
  'Двухместный номер с 1 кроватью Стандарт',
  'Лофт студия в центре',
  'Стильный лофт в ЖК бизнес класса у метро'
];

const generateAuthor = (n) => ({
  avatar: `img/avatars/user${n}.png`,
});

const generateIntBetween = (a, b) => {
  const min = Math.ceil(Math.min(a, b));
  const max = Math.floor(Math.max(a, b));

  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomArrayElement = (arr) => arr[generateIntBetween(0, arr.length - 1)];

const generateFloatBetween = (a, b) => a + Math.random() * (a - b);

const generateLocation = () => ({
  lat: generateFloatBetween(35.65000, 35.70000).toString().slice(0,8),
  lng: generateFloatBetween(139.70000, 139.80000).toString().slice(0,9),
});

const getRndInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomUniqItems = (list, aCount) => {
  const uniqList = unique(list);
  const count = aCount ?? getRndInteger(1, uniqList.length);

  if (uniqList.length < count) {
    throw new Error('count greater than array length');
  }

  if (uniqList.length === count) {
    return uniqList;
  }

  const arr = [];

  while(arr.length < count){
    const item = getRandomArrayElement(uniqList);
    if(!arr.includes(item)) {
      arr.push(item);
    }
  }

  return arr;
};

const generateOffer = () => ({
  title: getRandomArrayElement(TITLES),
  address: generateLocation(),
  price: getRndInteger(10, 50000),
  type: getRandomArrayElement(TYPES),
  rooms: getRndInteger(1, 50),
  guests: getRndInteger(1, 150),
  checkin: getRandomArrayElement(CHECKIN_TIME),
  checkout: getRandomArrayElement(CHECKOUT_TIME),
  features: getRandomUniqItems(FEATURES),
  description: getRandomArrayElement(DESCRIPTIONS),
  photos: getRandomUniqItems(PHOTOS),
});

const generateOfferDescription = (offer = generateOffer()) => ({
  offer,
  location: offer.address,
  author: generateAuthor(positiveIntToString(generateIntBetween(1,10)))
});

export { generateOfferDescription, generateOffer };


