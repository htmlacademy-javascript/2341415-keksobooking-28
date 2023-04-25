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

export { positiveIntToString, unique, createArray };
