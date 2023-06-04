const positiveIntToString = (n) => n < 10 ? `0${n.toString()}` : n.toString();

const unique = (arr) => {
  const result = [];

  for (const it of arr) {
    if (!result.includes(it)) {
      result.push(it);
    }
  }

  return result;
};

const createArray = (length, fn) => Array.from({ length }, fn);

const debounce = (callback, timeoutDelay) => {
  let timeoutId;
  return (...rest) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback.apply(this, rest), timeoutDelay);
  };
};

const hide = (el) => el.classList.add('hidden');
const show = (el) => el.classList.remove('hidden');

const disable = (el) => {
  el.disabled = true;
};

const enable = (el) => {
  el.disabled = false;
};

export { positiveIntToString, unique, createArray, debounce, hide, show, disable, enable };
