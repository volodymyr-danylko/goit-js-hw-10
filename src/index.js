import { Notify } from 'notiflix/build/notiflix-notify-aio';
import debounce from 'lodash.debounce';
import { fetchCountries } from './fetchCountries';

import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

const onInputChanged = event => {
  list.innerHTML = '';
  info.innerHTML = '';

  const searchTerm = input.value.trim();

  fetchCountries(searchTerm)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name.'
        );
      }
      if (data.length < 10 && data.length > 1) {
        console.log(data);
        data.forEach(country => {
          console.log(country);
          list.insertAdjacentHTML(
            'beforeend',
            countryListTemplate(country.name.official, country.flags.svg)
          );
        });
      }

      if (data.length === 1) {
        const { name, capital, flags, population, languages } = data[0];
        const languageList = Object.values(languages).join(', ');
        info.innerHTML = countryTemplate(
          name.official,
          flags.svg,
          capital,
          population,
          languageList
        );
      }
    })
    .catch(err => {
      console.log(err);
      if (err.message === '404') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
      }
    });
};

const countryListTemplate = (name, flag) => `
<li class="country-list-item">
     <img src="${flag}" width="40" height="30">
    <p class="country">${name}</p>
</li>`;

const countryTemplate = (name, flag, capital, population, languages) => `
<div class="info">
  <div class="top">
    <img src="${flag}" width="40" height="30">
    <h2>${name}</h2>
  </div>
  <ul class='country-info-list'>
    <li>
      <p>Capital</p>
      <p>${capital}</p>
    </li>
    <li>
      <p>Population</p>
      <p>${population}</p>
    </li>
    <li>
      <p>Languages</p>
      <p>${languages}</p>
    </li>
  </div>
</div>`;

input.addEventListener('input', debounce(onInputChanged, DEBOUNCE_DELAY));
