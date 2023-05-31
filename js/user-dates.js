const createLoader = (onSuccess, onError) => () => fetch(
  'https://28.javascript.pages.academy/keksobooking/data',
  {
    method: 'GET',
    // credentials: 'same-origin',
  },
)
  .then((response) => {
    // throw new Error('error!!!!');
    if (response.ok) {
      return response.json();
    }

    throw new Error(`${response.status} ${response.statusText}`);
  })
  .then(onSuccess)
  .catch(onError);

export {createLoader};
