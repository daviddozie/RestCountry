document.addEventListener('DOMContentLoaded', () => {
    const countryList = document.getElementById('country-list');
    const searchInput = document.getElementById('search');
    const regionFilter = document.getElementById('region-filter');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let countries = [];
    let darkMode = localStorage.getItem('darkMode') === 'true';

    const fetchCountries = async () => {
        try {
            const response = await fetch('https://restcountries.com/v3.1/all');
            countries = await response.json();
            displayCountries(countries);
        } catch (error) {
            console.error('Error fetching countries:', error);
        }
    };

    const displayCountries = (countries) => {
        countryList.innerHTML = countries.map(country => `
        <div class="country-card" onclick="viewCountryDetails('${country.cca3}')">
          <img src="${country.flags.svg}" alt="${country.name.common} flag">
          <div class="country__text__wrapper">
          <h3>${country.name.common}</h3>
          <p class="country__card__item">Population:<span class="country__card__item_sm">${country.population.toLocaleString()}</span></p>
          <p class="country__card__item">Region:<span class="country__card__item_sm">${country.region}</span></p>
          <p class="country__card__item">Capital: <span class="country__card__item_sm">${country.capital ? country.capital[0] : 'N/A'}</span></p>
          </div>
        </div>
      `).join('');
    };

    searchInput.addEventListener('input', () => {
        const searchTerm = searchInput.value.toLowerCase();
        const filteredCountries = countries.filter(country =>
            country.name.common.toLowerCase().includes(searchTerm)
        );
        displayCountries(filteredCountries);
    });

    regionFilter.addEventListener('change', () => {
        const region = regionFilter.value;
        const filteredCountries = countries.filter(country =>
            country.region === region || !region
        );
        displayCountries(filteredCountries);
    });

    toggleThemeButton.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    });

    const applyDarkMode = () => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    };

    fetchCountries();
    applyDarkMode();
});

function viewCountryDetails(code) {
    localStorage.setItem('countryCode', code);
    window.location.href = 'country-page.html';
}

if (window.location.pathname.endsWith('country-page.html')) {
    const countryDetails = document.getElementById('country-details');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let darkMode = localStorage.getItem('darkMode') === 'true';

    const fetchCountryDetails = async (code) => {
        try {
            const response = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
            const [country] = await response.json();
            displayCountryDetails(country);
        } catch (error) {
            console.error('Error fetching country details:', error);
        }
    };

    const displayCountryDetails = (country) => {
        countryDetails.innerHTML = `
        <h1>${country.name.common}</h1>
        <img src="${country.flags.svg}" class="country__details__img" alt="${country.name.common} flag">
        <p>Population:<span>${country.population.toLocaleString()}</span></p>
        <p>Region: ${country.region}</p>
        <p>Subregion: ${country.subregion}</p>
        <p>Capital: ${country.capital ? country.capital[0] : 'N/A'}</p>
        <h2>Border Countries</h2>
        <ul>
          ${country.borders.map(border => `
            <li><a href="javascript:void(0)" onclick="viewCountryDetails('${border}')">${border}</a></li>
          `).join('')}
        </ul>
      `;
    };

    toggleThemeButton.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    });

    const applyDarkMode = () => {
        if (darkMode) {
            document.body.classList.add('dark-mode');
        }
    };

    const countryCode = localStorage.getItem('countryCode');
    if (countryCode) {
        fetchCountryDetails(countryCode);
    }
    applyDarkMode();
}
