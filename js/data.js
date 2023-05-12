import { generateOfferDescription } from './random.js';
import { createArray } from './util.js';

const offerDescriptions = createArray(10, generateOfferDescription);
console.log('offerDescriptions:', offerDescriptions)

export {
  offerDescriptions,
};
