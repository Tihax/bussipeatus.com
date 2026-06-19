const notification = document.getElementById('betaNotification');
const countdown = document.getElementById('notificationCountdown');
const closeNotification = document.getElementById('closeNotification');
const tabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const toast = document.getElementById('toast');
const jokeButton = document.getElementById('jokeButton');
const jokeText = document.getElementById('jokeText');

let countdownValue = 10;
let countdownTimer = null;
let activeView = 'login';

function showNotification() {
  notification.classList.add('open');
  countdown.textContent = countdownValue;
  countdownTimer = setInterval(() => {
    countdownValue -= 1;
    countdown.textContent = countdownValue;
    if (countdownValue <= 0) {
      closeBetaNotification();
    }
  }, 1000);
}

function closeBetaNotification() {
  if (!notification.classList.contains('open')) return;
  notification.classList.remove('open');
  clearInterval(countdownTimer);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function setActiveTab(selected) {
  tabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === selected);
  });
  document.getElementById('loginPanel').classList.toggle('hidden', selected !== 'login');
  document.getElementById('signupPanel').classList.toggle('hidden', selected !== 'signup');
  activeView = selected;
}

tabs.forEach((tab) => {
  tab.addEventListener('click', () => setActiveTab(tab.dataset.view));
});

closeNotification.addEventListener('click', closeBetaNotification);

loginForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = loginForm.querySelector('[name="email"]').value.trim();
  const password = loginForm.querySelector('[name="password"]').value.trim();
  if (!email || !password) {
    showToast('Sisesta e-post ja salasõna.');
    return;
  }
  showToast('Logid sisse...');
  setTimeout(() => {
    showToast('Kahjuks on see alles beta ehk katseversioon — aga väga peaaegu!');
  }, 1200);
});

signupForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = signupForm.querySelector('[name="name"]').value.trim();
  const email = signupForm.querySelector('[name="email"]').value.trim();
  const password = signupForm.querySelector('[name="password"]').value.trim();
  if (!name || !email || !password) {
    showToast('Täida kõik väljad enne jätkamist.');
    return;
  }
  showToast('Registreerimine käib...');
  setTimeout(() => {
    showToast('Oled peaaegu valmis, aga see leht naerab sind veel. 😄');
  }, 1200);
});

jokeButton.addEventListener('click', () => {
  jokeText.textContent = 'Miks bussipeatus ei räägi? Sest tal on alati järgmine peatus!';
  showToast('Hea valik! Naerame koos.');
});

window.addEventListener('load', () => {
  showNotification();
});
