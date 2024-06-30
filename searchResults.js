// Constants
const THE_KEY = 'cee4c96c8b0db2fbb25f4450debdc8aa'; // Replace with your TMDb API key
const RESULTS_PER_PAGE = 20; // Number of results to display per page

// Function to search for movies and series
async function searchMoviesAndSeries(query, page = 1) {
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${THE_KEY}&language=en-US&query=${encodeURIComponent(
    query
  )}&page=${page}&include_adult=false`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies and series:', error);
    return {
      results: [],
      total_pages: 0,
    };
  }
}

// Function to get URL parameters
function getURLParameters() {
  const urlParams = new URLSearchParams(window.location.search);
  const params = {};

  for (const [key, value] of urlParams.entries()) {
    params[key] = value;
  }

  return params;
}

// Function to display movie results
function displayMovieResults(results) {
  const resultTray = document.getElementById('result-tray');
  resultTray.innerHTML = '';

  if (results.length === 0) {
    resultTray.innerHTML = 'No results found.';
    return;
  }

  results.forEach((result) => {
    if (!result.poster_path) {
      return; // Skip results without a poster image
    }

    const movieContainer = document.createElement('a');
    movieContainer.classList.add('movie-container');
    movieContainer.href = `playPage.html?movie=${encodeURIComponent(JSON.stringify(result))}`;

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

    movieContainer.appendChild(moviePicture);
    movieContainer.appendChild(movieTitle);
    movieContainer.appendChild(movieInfo);
    movieContainer.appendChild(movieOverview);

    resultTray.appendChild(movieContainer);
  });
}

// Function to display series results
function displaySeriesResults(results) {
  const seriesTray = document.getElementById('result-tray');
  seriesTray.innerHTML = '';

  if (results.length === 0) {
    seriesTray.innerHTML = 'No results found.';
    return;
  }

  results.forEach((result) => {
    if (!result.poster_path) {
      return; // Skip results without a poster image
    }

    const seriesContainer = document.createElement('a');
    seriesContainer.classList.add('series-container');
    seriesContainer.href = `playPage.html?series=${encodeURIComponent(JSON.stringify(result))}`;

    const seriesPicture = document.createElement('div');
    seriesPicture.classList.add('series-picture');

    const seriesImage = document.createElement('img');
    seriesImage.src = `https://image.tmdb.org/t/p/w200/${result.poster_path}`;
    seriesImage.alt = result.title || result.name;

    const seriesRating = document.createElement('h4');
    seriesRating.classList.add('series-rating');
    seriesRating.textContent = result.vote_average.toFixed(1); // Display rating to first decimal place

    const seriesTitle = document.createElement('div');
    seriesTitle.classList.add('series-title');

    const titleText = document.createElement('h4');
    titleText.classList.add('title-text');
    titleText.textContent = result.title || result.name;

    const seriesInfo = document.createElement('div');
    seriesInfo.classList.add('series-info');

    const seriesYear = document.createElement('div');
    seriesYear.classList.add('series-year');
    seriesYear.textContent = result.first_air_date ? result.first_air_date.slice(0, 4) : '';

    const seriesSeasons = document.createElement('div');
    seriesSeasons.classList.add('series-seasons');
    seriesSeasons.textContent = result.number_of_seasons ? `${result.number_of_seasons} seasons` : '';

    const seriesType = document.createElement('div');
    seriesType.classList.add('type');
    seriesType.textContent = result.media_type === 'tv' ? 'series' : 'movie';

    const seriesOverview = document.createElement('div');
    seriesOverview.classList.add('overview');
    seriesOverview.textContent = result.overview;

    seriesPicture.appendChild(seriesImage);
    seriesPicture.appendChild(seriesRating);
    seriesTitle.appendChild(titleText);
    seriesInfo.appendChild(seriesYear);
    seriesInfo.appendChild(seriesSeasons);
    seriesInfo.appendChild(seriesType);

    seriesContainer.appendChild(seriesPicture);
    seriesContainer.appendChild(seriesTitle);
    seriesContainer.appendChild(seriesInfo);
    seriesContainer.appendChild(seriesOverview);

    seriesTray.appendChild(seriesContainer);
  });
}

// Function to display search results
function displaySearchResults(results) {
  const movieResults = results.filter(result => result.media_type === 'movie');
  const seriesResults = results.filter(result => result.media_type === 'tv');

  if (movieResults.length > 0) {
    displayMovieResults(movieResults);
  }

  if (seriesResults.length > 0) {
    displaySeriesResults(seriesResults);
  }
}

// Function to display pagination
function displayPagination(totalPages, currentPage) {
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  if (totalPages <= 1) {
    return;
  }

  const prevButton = document.createElement('button');
  prevButton.textContent = 'Prev';
  prevButton.disabled = currentPage === 1;
  prevButton.addEventListener('click', () => handlePageChange(currentPage - 1));

  const pageNumbers = document.createElement('div');
  pageNumbers.classList.add('page-numbers');

  for (let i = 1; i <= totalPages; i++) {
    const pageNumber = document.createElement('button');
    pageNumber.textContent = i;
    pageNumber.classList.toggle('active', i === currentPage);
    pageNumber.addEventListener('click', () => handlePageChange(i));
    pageNumbers.appendChild(pageNumber);
  }

  const nextButton = document.createElement('button');
  nextButton.textContent = 'Next';
  nextButton.disabled = currentPage === totalPages;
  nextButton.addEventListener('click', () => handlePageChange(currentPage + 1));

  pagination.appendChild(prevButton);
  pagination.appendChild(pageNumbers);
  pagination.appendChild(nextButton);
}

// Function to handle page change
async function handlePageChange(page) {
  const params = getURLParameters();
  const query = params.query;

  if (query) {
    const { results, total_pages } = await searchMoviesAndSeries(query, page);
    displaySearchResults(results);
    displayPagination(total_pages, page);
  }
}

// Function to handle retrieving the search query from the URL and displaying the search results
async function handleSearchQuery() {
  const params = getURLParameters();
  const query = params.query;

  if (query) {
    const { results, total_pages } = await searchMoviesAndSeries(query);
    displaySearchResults(results);
    displayPagination(total_pages, 1);
  }
}

// Add event listener to handle search query and display results when the page loads
window.addEventListener('DOMContentLoaded', handleSearchQuery);

// Assuming you have a movieContainer element
const movieContainer = document.getElementById('movie-container');

// Add a click event listener to the movieContainer
movieContainer.addEventListener('click', () => {
  // Code to be executed when the movieContainer is clicked
  console.log('Movie container clicked!');
  // You can perform any actions or logic here
});


/*
// Get the selected movie from URL parameter
const urlParams = new URLSearchParams(window.location.search);
const movieParam = urlParams.get('movie');
const selectedMovie = JSON.parse(decodeURIComponent(movieParam));

const seriesParam = urlParams.get('series');
const selectedSeries = JSON.parse(decodeURIComponent(seriesParam));


// Use the selected movie object to populate the page with its information
if (selectedMovie) {
  const { name, poster_path, vote_average, release_date, backdrop_path, overview, genre_ids, id, type } = selectedMovie;
  document.getElementById('movieTitle').textContent = name;
  document.getElementById('moviePoster').src = IMG_URL + poster_path;
  document.getElementById('backdropPoster').src = IMG_URL + backdrop_path;

  // Limit overview to 75 words and add ellipsis if needed
  const limitedOverview = limitWords(overview, 75);
  document.getElementById('overview').textContent = limitedOverview;

  document.getElementById('release_date').textContent = release_date;
  document.getElementById('rating').textContent = vote_average.toFixed(1);

  // Retrieve the runtime for the selected movie
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

  // Get trailer for the movie
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
}



// Use the selected series object to populate the page with its information
if (selectedSeries) {
  const { name, poster_path, vote_average, first_air_date, backdrop_path, overview, genre_ids, id } = selectedSeries;
  document.getElementById('movieTitle').textContent =name;
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
}
*/
// Call the handleSearchQuery function from search.js when the page loads
window.addEventListener('DOMContentLoaded', handleSearchQuery);
