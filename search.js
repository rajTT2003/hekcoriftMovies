const THE_KEY = 'cee4c96c8b0db2fbb25f4450debdc8aa'; // Replace with your TMDb API key

// Function to search for movies and series
async function searchMovieAndSeries(query) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${THE_KEY}&language=en-US&query=${encodeURIComponent(query)}&page=1&include_adult=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error searching movies and series:', error);
    return [];
  }
}

// Function to display search suggestions
function displaySearchSuggestions(suggestions) {
  const MAX_SUGGESTIONS = 10;
  const searchSuggestions = document.getElementById('search-suggestions');
  searchSuggestions.innerHTML = '';

  if (suggestions.length === 0) {
    searchSuggestions.style.display = 'none';
    return;
  }

  const limitedSuggestions = suggestions.slice(0, MAX_SUGGESTIONS);

  limitedSuggestions.forEach((suggestion) => {
    if (!suggestion.poster_path) {
      return; // Skip suggestions without a poster image
    }

    const suggestionItem = document.createElement('li');
    const suggestionLink = document.createElement('a');
    suggestionLink.href = `playPage.html?movie=${encodeURIComponent(JSON.stringify(suggestion))}`;

    const suggestionImage = document.createElement('img');
    suggestionImage.src = `https://image.tmdb.org/t/p/w200/${suggestion.poster_path}`;
    suggestionImage.alt = suggestion.title || suggestion.name;
    suggestionImage.style.width = '30px'; // Adjust the width as needed
    suggestionImage.style.height = 'auto';
    suggestionImage.style.marginRight = '10px';

    const suggestionTitle = document.createElement('span');
    suggestionTitle.textContent = suggestion.title || suggestion.name;
    suggestionTitle.style.fontWeight = 'bold';
    suggestionTitle.style.textAlign = 'center';
    suggestionTitle.style.fontSize = '12px';
    suggestionTitle.style.whiteSpace = 'nowrap';
    suggestionTitle.style.overflow = 'hidden';
    suggestionTitle.style.textOverflow = 'ellipsis';
    suggestionTitle.style.maxWidth = '200px'; // Adjust the max width as needed

    if (suggestionTitle.textContent.length > 30) {
      suggestionTitle.textContent = suggestionTitle.textContent.slice(0, 30) + '...';
    }

    suggestionLink.appendChild(suggestionImage);
    suggestionLink.appendChild(suggestionTitle);
    suggestionItem.appendChild(suggestionLink);
    searchSuggestions.appendChild(suggestionItem);

    // Add click event listener to each suggestion
    suggestionItem.addEventListener('click', () => {
      window.location.href = suggestionLink.href;
    });
  });

  searchSuggestions.style.display = 'block';
}

// Function to handle search input
// Function to handle search input
async function handleSearchInput(event) {
  const searchInput = event.target.value.trim();
  const searchSuggestions = document.getElementById('search-suggestions');
  const movieContainer = document.getElementById('search-container');

  if (searchInput === '') {
    searchSuggestions.innerHTML = '';
    searchSuggestions.style.display = 'none';
    return;
  }

  const suggestions = await searchMovieAndSeries(searchInput);
  displaySearchSuggestions(suggestions);

  // Show the movie container when there are search suggestions
  movieContainer.style.display = 'block';
}


// Function to handle search submit
async function handleSearchSubmit(event) {
  event.preventDefault();
  const searchInput = document.getElementById('search').value.trim();

  if (searchInput === '') {
    return;
  }

  // Encode the search query for the URL
  const encodedQuery = encodeURIComponent(searchInput);

  // Redirect to the searchResults.html with the search query as a parameter
  window.location.href = `searchResults.html?query=${encodedQuery}`;
}

// Add event listener to handle search input
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', handleSearchInput);

// Add event listener to handle search submit
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', handleSearchSubmit);

// Assuming you have a movieContainer element
const movieContainer = document.getElementById('search-container');

// Add a click event listener to the movieContainer
movieContainer.addEventListener('click', () => {
  // Code to be executed when the movieContainer is clicked
  console.log('Movie container clicked!');
  // You can perform any actions or logic here
});

// Function to initialize the movie page
function initializeMoviePage() {
  // Assuming you have HTML elements for the movie details
  const movieTitleElement = document.getElementById('movieTitle');
  const moviePosterElement = document.getElementById('moviePoster');
  const backdropPosterElement = document.getElementById('backdropPoster');
  const overviewElement = document.getElementById('overview');
  const releaseDateElement = document.getElementById('release_date');
  const ratingElement = document.getElementById('rating');

  // Get the selected movie from URL parameter
  const urlParams = new URLSearchParams(window.location.search);
  const movieParam = urlParams.get('movie');
  const selectedMovie = JSON.parse(decodeURIComponent(movieParam));

  // Use the selected movie object to populate the page with its information
  if (selectedMovie) {
    const { title, poster_path, vote_average, release_date, backdrop_path, overview } = selectedMovie;
    movieTitleElement.textContent = title;
    moviePosterElement.src = `https://image.tmdb.org/t/p/w200/${poster_path}`;
    backdropPosterElement.src = `https://image.tmdb.org/t/p/w500/${backdrop_path}`;
    overviewElement.textContent = overview;
    releaseDateElement.textContent = `Release Date: ${release_date}`;
    ratingElement.textContent = `Rating: ${vote_average}`;

    // ...perform additional actions or logic with the selected movie...
  }
}

// Call the initializeMoviePage function when the playPage is loaded
initializeMoviePage();










