const body = document.querySelector('body');

const offerSuccessSendTemplate = document.querySelector('#success')
.content
.querySelector('.success');

const createSuccessMessage = () => {
  const message = offerSuccessSendTemplate.cloneNode(true);
  body.append(message);

  return message;
};

export { createSuccessMessage };

