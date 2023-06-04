const getUnique = (arr) => {
  const uniqueValues = [];

  for (const it of arr) {
    if (!uniqueValues.includes(it)) {
      uniqueValues.push(it);
    }
  }

  return uniqueValues;
};

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

export { getUnique, debounce, hide, show, disable, enable };
