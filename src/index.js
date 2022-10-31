import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

import './scss/styles.scss';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');

const onInputChanged = event => {
  countryList.innerHTML = '';
  countryInfo.innerHTML = '';

  const searchTerm = event.target.value.trim();

  fetchCountries(searchTerm)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length < 10 && data.length > 1) {
        data.forEach(({ name, flags }) => {
          countryList.insertAdjacentHTML(
            'beforeend',
            countryListTemplate(name.official, flags.svg)
          );
        });
      }

      if (data.length === 1) {
        const { name, capital, flags, population, languages } = data[0];
        const languageList = Object.values(languages).join(', ');
        countryInfo.innerHTML = countryTemplate(
          name.official,
          flags.svg,
          capital,
          population,
          languageList
        );
      }
    })
    .catch(error => {
      if (error.message === '404') {
        Notify.failure('Oops, there is no country with that name');
      }
    });
};

const countryListTemplate = (name, flag) => `
  <li class="country-list-item">
    <img src="${flag}" >
    <p class="country">${name}</p>
  </li>`;

const countryTemplate = (name, flag, capital, population, languages) => `
  <div class="header">
    <img src="${flag}">
    <h2>${name}</h2>
  </div>
  <ul>
    <li>
      <p>Capital: <span>${capital}</spanp></p>
    </li>
    <li>
      <p>Population:  <span>${population}</span></p>
    </li>
    <li>
      <p>Languages: <span>${languages}</span></p>
    </li>
  </ul>
`;

input.addEventListener('input', debounce(onInputChanged, DEBOUNCE_DELAY));
