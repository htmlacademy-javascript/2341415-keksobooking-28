const body = document.querySelector('body');

const offerErrorSendTemplate = document.querySelector('#error')
.content
.querySelector('.error');

const createErrorMessage = () => {
  const message = offerErrorSendTemplate.cloneNode(true);
  body.append(message);

  return message;
};

export { createErrorMessage };
