const authScreen = document.getElementById('authScreen');
const dashboardScreen = document.getElementById('dashboardScreen');
const authTabs = document.querySelectorAll('.tab');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const logoutButton = document.getElementById('logoutButton');
const userNameEl = document.getElementById('userName');
const userEmailEl = document.getElementById('userEmail');
const nextDepartures = document.getElementById('nextDepartures');
const routeList = document.getElementById('routeList');
const refreshMap = document.getElementById('refreshMap');
const toast = document.getElementById('toast');

const users = [];
let currentUser = null;
let activeAuthView = 'login';
let selectedRoute = 'tallinn-tartu';

const routeData = {
  'tallinn-tartu': {
    title: 'Tallinn → Tartu',
    description: 'Modernne liin, mis ühendab pealinna ja ülikoolilinna.',
    departures: ['12:05', '13:35', '15:05', '16:30'],
    stops: ['Tallinn', 'Jüri', 'Tartu'],
    schedule: ['Tallinn 12:05', 'Jüri 13:15', 'Tartu 15:10']
  },
  'tallinn-parnu': {
    title: 'Tallinn → Pärnu',
    description: 'Rannalinna ekspressliin mugavaks suviseks sõiduks.',
    departures: ['10:20', '12:30', '14:45', '17:00'],
    stops: ['Tallinn', 'Keila', 'Pärnu'],
    schedule: ['Tallinn 10:20', 'Keila 11:10', 'Pärnu 13:05']
  }
};

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

function setAuthTab(view) {
  activeAuthView = view;
  authTabs.forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.view === view);
  });
  document.getElementById('loginForm').classList.toggle('hidden', view !== 'login');
  document.getElementById('signupForm').classList.toggle('hidden', view !== 'signup');
}

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => setAuthTab(tab.dataset.view));
});

function renderRouteButtons() {
  routeList.innerHTML = '';
  Object.entries(routeData).forEach(([routeId, route]) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `route-card ${routeId === selectedRoute ? 'active' : ''}`;
    button.innerHTML = `<strong>${route.title}</strong><span>${route.description}</span>`;
    button.addEventListener('click', () => {
      selectedRoute = routeId;
      renderRouteButtons();
      renderSchedule();
      showToast(`${route.title} ajad uuendatud.`);
    });
    routeList.appendChild(button);
  });
}

function renderSchedule() {
  const route = routeData[selectedRoute];
  document.getElementById('tallinnTartuSchedule').innerHTML = route.schedule
    .map((stop) => `<li>${stop}</li>`)
    .join('');
  document.getElementById('tallinnParnuSchedule').innerHTML = route.schedule
    .map((stop) => `<li>${stop}</li>`)
    .join('');
}

function renderNextDepartures() {
  const route = routeData[selectedRoute];
  nextDepartures.innerHTML = route.departures
    .map(
      (departure) => `<li><strong>${departure}</strong> • ${route.title}</li>`
    )
    .join('');
}

function showDashboard(user) {
  currentUser = user;
  userNameEl.textContent = user.name;
  userEmailEl.textContent = user.email;
  authScreen.classList.add('hidden');
  dashboardScreen.classList.remove('hidden');
  renderRouteButtons();
  renderSchedule();
  renderNextDepartures();
}

function handleLoginSubmit(event) {
  event.preventDefault();
  const email = event.target.email.value.trim().toLowerCase();
  const password = event.target.password.value.trim();
  if (!email || !password) {
    showToast('Palun täida mõlemad väljad.');
    return;
  }

  const account = users.find((user) => user.email === email && user.password === password);
  if (!account) {
    showToast('Konto puudub või parool on vale. Proovi uuesti.');
    return;
  }

  showToast('Tere tulemast tagasi!');
  showDashboard(account);
}

function handleSignupSubmit(event) {
  event.preventDefault();
  const name = event.target.name.value.trim();
  const email = event.target.email.value.trim().toLowerCase();
  const password = event.target.password.value.trim();

  if (!name || !email || !password) {
    showToast('Palun täida kõik väljad.');
    return;
  }

  if (users.some((user) => user.email === email)) {
    showToast('Sellise e-postiga konto on juba olemas. Logi sisse.');
    return;
  }

  const newUser = { name, email, password };
  users.push(newUser);
  showToast('Konto loodud. Tervitan sind süsteemis!');
  setTimeout(() => showDashboard(newUser), 800);
}

function handleLogout() {
  currentUser = null;
  dashboardScreen.classList.add('hidden');
  authScreen.classList.remove('hidden');
  showToast('Oled välja logitud.');
}

loginForm.addEventListener('submit', handleLoginSubmit);
signupForm.addEventListener('submit', handleSignupSubmit);
logoutButton.addEventListener('click', handleLogout);
refreshMap.addEventListener('click', () => {
  renderNextDepartures();
  showToast('Kaardivaade ja bussiajad uuendatud.');
});

window.addEventListener('load', () => {
  renderRouteButtons();
  renderSchedule();
});
