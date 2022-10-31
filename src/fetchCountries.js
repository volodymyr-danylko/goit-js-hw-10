const baseUrl = 'https://restcountries.com/v3.1/name/';
const filter = 'name,capital,population,flags,languages';

export const fetchCountries = name => {
  return fetch(`${baseUrl}${name}?fields=${filter}`).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
};
