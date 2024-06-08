import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
  event.preventDefault();

  const input = document.querySelector('input[name="delay"]');
  const state = document.querySelector('input[name="state"]:checked');

  const delay = parseInt(input.value, 10);

  createBannerPromise(delay, state.value)
    .then(displaySuccessMessage)
    .catch(displayErrorMessage)
    .finally(() => {
      input.value = '';
    });
}

function createBannerPromise(delay, state) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      state === 'fulfilled' ? resolve(delay) : reject(delay);
    }, delay);
  });
}

function displaySuccessMessage(delay) {
  iziToast.success({
    position: 'topRight',
    message: `✅ Fulfilled promise in ${delay}ms`,
    icon: '',
  });
}

function displayErrorMessage(delay) {
  iziToast.error({
    position: 'topRight',
    message: `❌ Rejected promise in ${delay}ms`,
    icon: '',
  });
}
