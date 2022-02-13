
import './css/styles.css';
import { debounce } from 'debounce';
import { fetchCountries } from './css/fetchCountries';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const inputFind = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const manyMessage = 'Too many matches found. Please enter a more specific name.';
const oopsMmessage = 'Oops, there is no country with that name, buy the globe';
const foundContry = 'We found country';
const emptyName = 'Empty field, input country name';

inputFind.addEventListener('input', debounce(onInputCountryName, DEBOUNCE_DELAY));

function onInputCountryName() {
  clear();
  const countryFetchName = inputFind.value;
  if (countryFetchName.trim() === '') {
    makeMessage('failure', emptyName);
    return;
  }

  fetchCountries(countryFetchName)
    .then(countries => {
      if (countries.length === 1) {
        countryCardTemplate(countries);
        makeMessage('success', foundContry);
        return;
      }
      if (countries.length < 11) {
        markupCountryList(countries);
        makeMessage('success', `Founded ${countries.length} countries!!!`);
        return;
      }
      makeMessage('warning', manyMessage);
    })
    .catch(error => {
      makeMessage('failure', oopsMmessage);
    });
}

function markupCountryList(countries) {
  const markup = countries
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li class="list-item">
            <p class='list-position'>
            <img src=${svg} width=30px alt=${official} class="list-flag">
            ${official}</p>
        </li>`;
    })
    .join('');
  countryList.innerHTML = markup;
}

function countryCardTemplate(country) {
  const markup = country
    .map(({ flags: { svg }, name: { official }, capital, population, languages }) => {
      return `<li class="card-item">
            <p class="card-position">
            <img src=${svg} width=200px alt=flag class="card-flag"><br>
            ${official}</p>
            <p class="card-cap">Capital: ${capital}</p>
            <p class="card-other">population: ${population}</p>
            <p class="card-other">languages: ${Object.values(languages)}</p>
        </li>`;
    })
    .join('');
  countryInfo.innerHTML = markup;
}

function clear() {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';
}

function makeMessage(type, message) {
  Notiflix.Notify[type](message);
}