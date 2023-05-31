const setStyles = (popup) => {
  popup.style.zIndex = '100';
  popup.style.position = 'absolute';
  popup.style.left = '0';
  popup.style.top = '0';
  popup.style.right = '0';
  popup.style.padding = '10px 3px';
  popup.style.fontSize = '30px';
  popup.style.textAlign = 'center';
  popup.style.backgroundColor = 'red';
};

const showErrorPopup = (message, messageTimeout) => {
  const popup = document.createElement('div');
  setStyles(popup);

  popup.textContent = message;

  document.body.append(popup);

  setTimeout(
    () => {
      popup.remove();
    },
    messageTimeout
  );
};

export { showErrorPopup };
