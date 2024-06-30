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
    suggestionLink.href = `morePage.html?movie=${encodeURIComponent(JSON.stringify(suggestion))}`;

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
async function handleSearchInput(event) {
  const searchInput = event.target.value.trim();
  const searchSuggestions = document.getElementById('search-suggestions');

  if (searchInput === '') {
    searchSuggestions.innerHTML = '';
    searchSuggestions.style.display = 'none';
    return;
  }

  const suggestions = await searchMovieAndSeries(searchInput);
  displaySearchSuggestions(suggestions);
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

// Function to retrieve search query from URL parameter
function getSearchQueryFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('query');
}

// Function to display search results
async function displaySearchResults() {
  const searchQuery = getSearchQueryFromURL();

  if (!searchQuery) {
    return;
  }

  const results = await searchMovieAndSeries(searchQuery);

  const resultTray = document.getElementById('result-tray');
  resultTray.innerHTML = '';

  results.forEach((result) => {
    if (!result.poster_path) {
      return; // Skip results without a poster image
    }

    const movieContainer = document.createElement('div');
    movieContainer.classList.add('movie-container');

    const playButton = document.createElement('img');
    playButton.classList.add('playbuttons');
    playButton.src = 'css/images/playbutton.png';
    playButton.alt = 'playbutton';

    const moviePicture = document.createElement('div');
    moviePicture.classList.add('movie-picture');

    const movieImage = document.createElement('img');
    movieImage.src = `https://image.tmdb.org/t/p/w200/${result.poster_path}`;
    movieImage.alt = result.title || result.name;

    const movieRating = document.createElement('h4');
    movieRating.classList.add('movie-rating');
    movieRating.textContent = result.vote_average.toFixed(1); // Display rating to first decimal place

    const movieTitle = document.createElement('div');
    movieTitle.classList.add('movie-title');

    const titleText = document.createElement('h4');
    titleText.classList.add('title-text');
    titleText.textContent = result.title || result.name;

    const movieInfo = document.createElement('div');
    movieInfo.classList.add('movie-info');

    const movieYear = document.createElement('div');
    movieYear.classList.add('movie-year');
    movieYear.textContent = result.release_date ? result.release_date.slice(0, 4) : '';

    const movieTime = document.createElement('div');
    movieTime.classList.add('movie-time');
    movieTime.textContent = result.runtime ? `${result.runtime} min` : '';

    const movieType = document.createElement('div');
    movieType.classList.add('type');
    movieType.textContent = result.media_type === 'tv' ? 'series' : 'movie';

    const movieOverview = document.createElement('div');
    movieOverview.classList.add('overview');
    movieOverview.textContent = result.overview;

    moviePicture.appendChild(movieImage);
    moviePicture.appendChild(movieRating);
    movieTitle.appendChild(titleText);
    movieInfo.appendChild(movieYear);
    movieInfo.appendChild(movieTime);
    movieInfo.appendChild(movieType);

    movieContainer.appendChild(playButton);
    movieContainer.appendChild(moviePicture);
    movieContainer.appendChild(movieTitle);
    movieContainer.appendChild(movieInfo);
    movieContainer.appendChild(movieOverview);


     // Create a click event listener for the movie container
movieContainer.addEventListener('click', () => {
// Redirect to the morePage.html with the selected movie as a parameter
window.location.href = `playPage.html?movie=${encodeURIComponent(JSON.stringify(result))}`;
});

    resultTray.appendChild(movieContainer);
  });
}

// Call the displaySearchResults function when the searchResults.html is loaded
displaySearchResults();







/*



const urlParams = new URLSearchParams(window.location.search);
const selectedMovie = JSON.parse(urlParams.get('movie'));
const selectedSeries = JSON.parse(urlParams.get('series'));

// Use the selected movie or series object to populate the page with its information
if (selectedMovie) {
  const { title, poster_path, vote_average, release_date, backdrop_path, overview, genre_ids, id, type } = selectedMovie;
  document.getElementById('movieTitle').textContent = title;
  document.getElementById('moviePoster').src = IMG_URL + poster_path;
  document.getElementById('backdropPoster').src = IMG_URL + backdrop_path;

  // Limit overview to 75 words and add ellipsis if needed
  const limitedOverview = limitWords(overview, 75);
  document.getElementById('overview').textContent = limitedOverview;

  document.getElementById('release_date').textContent = release_date;
  document.getElementById('rating').textContent = vote_average.toFixed(1);

  // Retrieve the runtime for the selected movie or series
  fetchMovieRuntime(id)
    .then(runtime => {
      document.getElementById('runtime').textContent = runtime !== null ? `${runtime} min` : 'N/A';
    })
    .catch(error => {
      console.log('Error:', error);
      document.getElementById('runtime').textContent = 'N/A';
    });

  // Retrieve the file ID for the selected movie
  const login = 'd2de7b9531a0984ad347';
  const key = 'wgV9XgqB1MIlxD';
  const folder = 'Ue7rIWly2Bg';
  fetch(`https://api.streamtape.com/file/listfolder?login=${login}&key=${key}&folder=${folder}`)
    .then(response => response.json())
    .then(data => {
      let linkid;
      for (const file of data.result.files) {
        if (file.name === selectedMovie.title) {
          linkid = file.linkid;
          break;
        }
      }
      if (linkid) {
        // Generate the embedded URL
        const embeddedURL = `https://streamtape.com/e/${linkid}`;

        // Update the movie player container with the embedded iframe URL
        const moviePlayer = document.getElementById('movie-player');
        moviePlayer.src = embeddedURL;
      } else {
        console.log('Link ID not found for the selected movie.');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });

  // Get trailer for the movie or series
  getTrailer(id)
    .then(trailerKey => {
      const trailerContainer = document.getElementById('trailer-container');
      if (trailerKey) {
        const trailerUrl = `https://www.youtube.com/embed/${trailerKey}`;
        const iframe = document.createElement('iframe');
        iframe.src = trailerUrl;
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';
        trailerContainer.appendChild(iframe);
      } else {
        trailerContainer.textContent = 'Trailer not available';
      }
    })
    .catch(error => {
      console.log('Error:', error);
      trailerContainer.textContent = 'Failed to load trailer';
    });
} else if (selectedSeries) {
  const { name, poster_path, vote_average, first_air_date, backdrop_path, overview, genre_ids, id, type } = selectedSeries;
  document.getElementById('movieTitle').textContent = name;
  document.getElementById('moviePoster').src = IMG_URL + poster_path;
  document.getElementById('backdropPoster').src = IMG_URL + backdrop_path;

  // Limit overview to 75 words and add ellipsis if needed
  const limitedOverview = limitWords(overview, 75);
  document.getElementById('overview').textContent = limitedOverview;

  document.getElementById('release_date').textContent = first_air_date;
  document.getElementById('rating').textContent = vote_average.toFixed(1);

  // Retrieve the runtime for the selected series
  fetchSeriesRuntime(id)
    .then(runtime => {
      document.getElementById('runtime').textContent = runtime !== null ? `${runtime} min` : 'N/A';
    })
    .catch(error => {
      console.log('Error:', error);
      document.getElementById('runtime').textContent = 'N/A';
    });

  // Search Streamtape for series title
  searchStreamtape(selectedSeries.name)
    .then(linkid => {
      if (linkid) {
        // Generate the embedded URL
        const embeddedURL = `https://streamtape.com/e/${linkid}`;

        // Update the movie player container with the embedded iframe URL
        const moviePlayer = document.getElementById('movie-player');
        moviePlayer.src = embeddedURL;
      } else {
        console.log('Link ID not found for the selected series.');
      }
    })
    .catch(error => {
      console.log('Error:', error);
    });

  // Get trailer for the series
  getTrailer(id)
    .then(trailerKey => {
      const trailerContainer = document.getElementById('trailer-container');
      if (trailerKey) {
        const trailerUrl = `https://www.youtube.com/embed/${trailerKey}`;
        const iframe = document.createElement('iframe');
        iframe.src = trailerUrl;
        iframe.allowFullscreen = true;
        iframe.frameBorder = '0';
        trailerContainer.appendChild(iframe);
      } else {
        trailerContainer.textContent = 'Trailer not available';
      }
    })
    .catch(error => {
      console.log('Error:', error);
      trailerContainer.textContent = 'Failed to load trailer';
    });
} else {
  console.log('No movie or series selected.');
}

// Function to limit the number of words in a string and add ellipsis if needed
function limitWords(text, wordLimit) {
  const words = text.trim().split(' ');
  if (words.length > wordLimit) {
    return words.slice(0, wordLimit).join(' ') + '...';
  }
  return text;
}

// Function to fetch the movie or series runtime from TMDB API
async function fetchMovieRuntime(movieId) {
  const apiKey = 'cee4c96c8b0db2fbb25f4450debdc8aa';
  const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.runtime) {
      return data.runtime;
    }
    return null;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

// Function to fetch the series runtime from TMDB API
async function fetchSeriesRuntime(tvId) {
  const apiKey = 'cee4c96c8b0db2fbb25f4450debdc8aa';
  const url = `https://api.themoviedb.org/3/tv/${tvId}?api_key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.episode_run_time && data.episode_run_time.length > 0) {
      return data.episode_run_time[0];
    }
    return null;
  } catch (error) {
    console.log('Error:', error);
    return null;
  }
}

// Function to search Streamtape for a series title
async function searchStreamtape(seriesTitle) {
  const login = 'd2de7b9531a0984ad347';
  const key = 'wgV9XgqB1MIlxD';
  const folder = 'Ue7rIWly2Bg';
  const response = await fetch(`https://api.streamtape.com/file/listfolder?login=${login}&key=${key}&folder=${folder}`);
  const data = await response.json();

  const seriesTitleRegex = /^(.*?)\sS\d+\sE\d+/i; // Regex to match series title before "S1 E2" format

  for (const file of data.result.files) {
    const match = seriesTitle.match(seriesTitleRegex);
    if (match && file.name.toLowerCase().includes(match[1].toLowerCase())) {
      return file.linkid;
    }
  }

  return null;
}

// Function to get the trailer for the movie or series
function getTrailer(movieId) {
  const apiKey = 'cee4c96c8b0db2fbb25f4450debdc8aa';
  const trailerUrl = `https://api.themoviedb.org/3/movie/${movieId}/videos?api_key=${apiKey}`;

  return fetch(trailerUrl)
    .then(response => response.json())
    .then(data => {
      const trailers = data.results.filter(trailer => trailer.type === 'Trailer');
      if (trailers.length > 0) {
        return trailers[0].key;
      }
      return null;
    })
    .catch(error => {
      console.log('Error:', error);
      return null;
    });
}


*/