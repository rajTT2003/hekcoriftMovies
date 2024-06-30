

// Start of getting Genre list

const GENRES_API = 'https://api.themoviedb.org/3/genre/movie/list?api_key=cee4c96c8b0db2fbb25f4450debdc8aa&language=en-US';
const SERIES_GENRES_API = 'https://api.themoviedb.org/3/genre/tv/list?api_key=cee4c96c8b0db2fbb25f4450debdc8aa&language=en-US';

// Fetch movie genres from API
const fetchMovieGenres = fetch(GENRES_API).then(response => response.json());

// Fetch TV series genres from API
const fetchSeriesGenres = fetch(SERIES_GENRES_API).then(response => response.json());

// Combine movie and TV series genres when both requests are fulfilled
Promise.all([fetchMovieGenres, fetchSeriesGenres])
  .then(data => {
    const movieGenres = data[0].genres;
    const seriesGenres = data[1].genres;
    const genreDropdownMenu = document.getElementById('genre-dropdown-menu');

    createGenres(movieGenres, seriesGenres, genreDropdownMenu);
    const urlParams = new URLSearchParams(window.location.search);
    const genreId = urlParams.get('genre');
    const page = parseInt(urlParams.get('page')) || 1;
    loadMoviesByGenre(genreId, page);
  })
  .catch(error => {
    console.log('Error:', error);
  });

function createGenres(movieGenres, seriesGenres, dropdownMenu) {
  const combinedGenres = combineGenres(movieGenres, seriesGenres);

  for (let i = 0; i < combinedGenres.length; i++) {
    const genre = combinedGenres[i];

    const genreItem = document.createElement('a');
    genreItem.href = '#';
    genreItem.textContent = genre.name;
    genreItem.addEventListener('click', () => {
      const page = 1; // Reset page to 1 when selecting a new genre
      loadMoviesByGenre(genre.id, page);
      window.location.href = 'morePage.html?genre=' + genre.id; // Redirect to morePage.html with selected genre
    });

    dropdownMenu.appendChild(genreItem);
  }
}

function loadMoviesByGenre(genreId, page = 1) {
  // Construct the API URL with the selected genreId and page number
  const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=cee4c96c8b0db2fbb25f4450debdc8aa&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`;

  // Fetch movies based on the API URL
  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      // Display movies in the more-tray
      displayMovies(movies);
      // Display pagination
      displayPagination(data.page, data.total_pages, genreId);
      // Add event listener to movie containers
      addMovieContainerListeners(movies);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayMovies(movies) {
  const moreTray = document.getElementById('more-tray');
  moreTray.innerHTML = '';

  let html = '';

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    if (i % 5 === 0) {
      html += '<div class="movie-row">';
    }

    html += `
      <a href="#">
        <div class="movie-container">
          <img class="playbuttons" src="css/images/playbutton.png" alt="playbutton">
          <div class="movie-picture">
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'css/images/placeholder.png'}" alt="${movie.title}">
            <div class="movie-rating">${movie.vote_average}</div>
          </div>
          <div class="movie-title">
            <h4 class="title-text">${movie.title}</h4>
          </div>
          <div class="movie-info">
            <div class="movie-year">${movie.release_date ? movie.release_date.substring(0, 4) : ''}</div>
            <div class="movie-time">${movie.runtime ? `${movie.runtime} min` : ''}</div>
            <div class="type">Movie</div>
          </div>
          <div class="overview">${movie.overview}</div>
        </div>
      </a>
    `;

    if ((i + 1) % 5 === 0 || i === movies.length - 1) {
      html += '</div>';
    }
  }
  moreTray.innerHTML = html;
}

function addMovieContainerListeners(movies) {
  const movieContainers = document.getElementsByClassName('movie-container');

  for (let i = 0; i < movieContainers.length; i++) {
    const movieContainer = movieContainers[i];
    const movie = movies[i];

    movieContainer.addEventListener('click', () => {
      const selectedMovie = JSON.stringify(movie);

      if (window.location.pathname.includes('playPage.html')) {
        // If on playPage.html, set the URL parameter and reload the page
        const urlParams = new URLSearchParams(window.location.search);
        urlParams.set('movie', selectedMovie);
        const newUrl = 'playPage.html' + '?' + urlParams.toString();
        window.location.href = newUrl;
      } else {
        // If on index.html, navigate to playPage.html with the URL parameter
        window.location.href = 'playPage.html' + '?movie=' + encodeURIComponent(selectedMovie);
      }
    });
  }
}

// Update the event listener for moreTray
series.addEventListener('click', () => {
  const selectedSeries = JSON.stringify(series);

  if (window.location.pathname.includes('playPage.html')) {
    // If on playPage.html, set the URL parameter and reload the page
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('series', selectedSeries);
    const newUrl = 'playPage.html' + '?' + urlParams.toString();
    window.location.href = newUrl;
  } else {
    // If on index.html, navigate to playPage.html with the URL parameter
    window.location.href = 'playPage.html' + '?series=' + encodeURIComponent(selectedSeries);
  }
});

function combineGenres(movieGenres, seriesGenres) {
  const combinedGenres = [];

  for (let i = 0; i < movieGenres.length; i++) {
    const movieGenre = movieGenres[i];
    const combinedGenre = {
      id: movieGenre.id,
      name: movieGenre.name,
      type: 'movie'
    };

    combinedGenres.push(combinedGenre);
  }

  for (let i = 0; i < seriesGenres.length; i++) {
    const seriesGenre = seriesGenres[i];
    const existingGenre = combinedGenres.find(genre => genre.id === seriesGenre.id);

    if (existingGenre) {
      existingGenre.type = 'both';
    } else {
      const combinedGenre = {
        id: seriesGenre.id,
        name: seriesGenre.name,
        type: 'tv'
      };

      combinedGenres.push(combinedGenre);
    }
  }

  return combinedGenres;
}

function displayPagination(currentPage, totalPages, genreId) {
  const pageContainer = document.getElementById('pageContainer');
  pageContainer.innerHTML = '';

  const maxPageButtons = 5; // Maximum number of page buttons to show
  const pageRange = Math.min(maxPageButtons, totalPages); // Adjust the page range if there are fewer pages than maxPageButtons
  const halfRange = Math.floor(pageRange / 2);

  let startPage = currentPage - halfRange;
  let endPage = currentPage + halfRange;

  if (totalPages <= maxPageButtons) {
    startPage = 1;
    endPage = totalPages;
  } else {
    if (startPage < 1) {
      startPage = 1;
      endPage = maxPageButtons;
    }

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = totalPages - maxPageButtons + 1;
    }
  }

  const paginationContainer = document.createElement('div');
  paginationContainer.className = 'pagination-container';

  if (currentPage > 1) {
    const prevButton = createPaginationButton('Prev', currentPage - 1, genreId);
    paginationContainer.appendChild(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const pageButton = createPaginationButton(i, i, genreId, currentPage);
    paginationContainer.appendChild(pageButton);
  }

  if (currentPage < totalPages) {
    const nextButton = createPaginationButton('Next', currentPage + 1, genreId);
    paginationContainer.appendChild(nextButton);
  }

  pageContainer.appendChild(paginationContainer);
}

function createPaginationButton(text, page, genreId, currentPage) {
  const button = document.createElement('button');
  button.className = 'pagination-button';
  button.textContent = text;

  if (typeof page === 'number') {
    button.addEventListener('click', () => loadMoviesByGenre(genreId, page));

    if (page === currentPage) {
      button.classList.add('active');
    }
  }

  return button;
}

function loadMoviesFromURL() {
  const urlParams = new URLSearchParams(window.location.search);
  const genreId = urlParams.get('genre');
  const page = parseInt(urlParams.get('page')) || 1;

  if (genreId && page) {
    loadMoviesByGenre(genreId, page);
  }
}

function updateURL(genreId, page) {
  const urlParams = new URLSearchParams(window.location.search);
  urlParams.set('genre', genreId);
  urlParams.set('page', page);
  history.replaceState(null, null, '?' + urlParams.toString());
}

function loadMoviesByGenre(genreId, page = 1) {
  const API_URL = `https://api.themoviedb.org/3/discover/movie?api_key=cee4c96c8b0db2fbb25f4450debdc8aa&language=en-US&sort_by=popularity.desc&with_genres=${genreId}&page=${page}`;

  fetch(API_URL)
    .then(response => response.json())
    .then(data => {
      const movies = data.results;
      displayMovies(movies);
      displayPagination(data.page, data.total_pages, genreId);
      addMovieContainerListeners(movies);
      updateURL(genreId, page);
    })
    .catch(error => {
      console.log('Error:', error);
    });
}

function displayMovies(movies) {
  const moreTray = document.getElementById('more-tray');
  moreTray.innerHTML = '';

  let html = '';

  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];

    if (i % 5 === 0) {
      html += '<div class="movie-row">';
    }

    html += `
      <a href="#">
        <div class="movie-container">
          <img class="playbuttons" src="css/images/playbutton.png" alt="playbutton">
          <div class="movie-picture">
            <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'css/images/placeholder.png'}" alt="${movie.title}">
            <div class="movie-rating">${movie.vote_average}</div>
          </div>
          <div class="movie-title">
            <h4 class="title-text">${movie.title}</h4>
          </div>
          <div class="movie-info">
            <div class="movie-year">${movie.release_date ? movie.release_date.substring(0, 4) : ''}</div>
            <div class="movie-time">${movie.runtime ? `${movie.runtime} min` : ''}</div>
            <div class="type">Movie</div>
          </div>
          <div class="overview">${movie.overview}</div>
        </div>
      </a>
    `;

    if ((i + 1) % 5 === 0 || i === movies.length - 1) {
      html += '</div>';
    }
  }
  moreTray.innerHTML = html;
}

// Call loadMoviesFromURL when the page is loaded to check for genre and page parameters in the URL
window.addEventListener('load', loadMoviesFromURL);








