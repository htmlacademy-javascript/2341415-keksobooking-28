const filtersFormEl = document.querySelector('.map__filters');

const resetFilters = () => filtersFormEl.reset();

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

const onFiltersChange = (fn) => filtersFormEl.addEventListener('change', fn);

export { getFilters, resetFilters, onFiltersChange };
