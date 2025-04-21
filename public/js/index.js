import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";

// DOM Elements
const mapbox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutBtn = document.querySelector('.nav__el--logout');

// Delegation
if (mapbox) {
    const locations = JSON.parse(mapbox.dataset.locations);
    displayMap(locations);
}

if (loginForm) {
    loginForm.addEventListener('submit', e => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        login(email, password);
    });
}

if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
}