const searchInput = document.getElementById('search-input');
const suggestionsList = document.getElementById('suggestions');

searchInput.addEventListener('input', debounce(handleSearchInput, 300));

async function fetchCountries(searchText) {
  try {
    const response = await fetch(`https://restcountries.com/v3.1/name/${searchText}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const countries = await response.json();
    return countries;
  } catch (error) {
    // console.error('Error fetching countries:', error);
    return []; 
  }
}

function handleSearchInput(event) {
  const searchText = event.target.value.trim().toLowerCase();

  if (searchText.length === 0) {
    clearSuggestions();
    return;
  }

  fetchCountries(searchText)
    .then((countries) => {
      if (countries.length === 0) {
        displayNoResults();
      } else {
        displaySuggestions(countries);
      }
    })
    .catch((error) => {
      console.error('Unexpected error:', error);
      displayNoResults();  
    });
}

function clearSuggestions() {
  suggestionsList.innerHTML = '';
}

function displaySuggestions(countries) {
  clearSuggestions();

  countries.forEach((country) => {
    const li = document.createElement('li');
    li.textContent = country.name.common;
    li.addEventListener('click', () => {
      searchInput.value = country.name.common;
      clearSuggestions();
    });
    suggestionsList.appendChild(li);
  });
}

function displayNoResults() {
  clearSuggestions();
  const li = document.createElement('li');
  li.textContent = 'No results found';
  suggestionsList.appendChild(li);
}

function debounce(func, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delay);
  };
}
