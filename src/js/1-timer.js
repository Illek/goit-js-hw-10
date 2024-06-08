import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const elements = {
  input: document.querySelector('input#datetime-picker'),
  startBtn: document.querySelector('button[type="button"]'),
  timeDays: document.querySelector('span[data-days]'),
  timeMinutes: document.querySelector('span[data-minutes]'),
  timeHours: document.querySelector('span[data-hours]'),
  timeSeconds: document.querySelector('span[data-seconds]'),
};

elements.startBtn.addEventListener('click', startTimer);

let userSelectedDate = null;
elements.startBtn.disabled = true;
elements.input.disabled = false;

const flatpickrOptions = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];
    handleDateSelection(selectedDate);
  },
};

flatpickr(elements.input, flatpickrOptions);

function handleDateSelection(selectedDate) {
  if (selectedDate.getTime() <= Date.now()) {
    iziToast.error({
      position: 'topRight',
      message: 'Please choose a date in the future',
    });
    elements.startBtn.disabled = true;
  } else {
    userSelectedDate = selectedDate.getTime();
    elements.startBtn.disabled = false;
  }
}

function startTimer() {
  if (!userSelectedDate) return;

  elements.input.disabled = true;
  const intervalId = setInterval(() => {
    const now = new Date();
    const totalMs = userSelectedDate - now.getTime();
    const time = convertMs(totalMs);
    updateDisplayedTime(time);
    elements.startBtn.disabled = true;

    if (totalMs <= 0) {
      clearInterval(intervalId);
      elements.input.disabled = false;
      resetDisplayedTime();
      iziToast.success({
        position: 'topRight',
        message: 'Countdown finished!',
      });
    }
  }, 1000);
}

function updateDisplayedTime({ days, hours, minutes, seconds }) {
  elements.timeDays.textContent = days;
  elements.timeHours.textContent = hours;
  elements.timeMinutes.textContent = minutes;
  elements.timeSeconds.textContent = seconds;
}

function resetDisplayedTime() {
  updateDisplayedTime({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00',
  });
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = padTime(Math.floor(ms / day));
  const hours = padTime(Math.floor((ms % day) / hour));
  const minutes = padTime(Math.floor(((ms % day) % hour) / minute));
  const seconds = padTime(Math.floor((((ms % day) % hour) % minute) / second));

  return { days, hours, minutes, seconds };
}

function padTime(value) {
  return String(value).padStart(2, '0');
}
