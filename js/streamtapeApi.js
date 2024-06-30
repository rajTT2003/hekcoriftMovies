// Get the necessary elements
var moviePlayButton = document.querySelector('.movie-play-button');
var moviePlayer = document.getElementById('iframe-contain');

// Add a click event listener to the movie play button
moviePlayButton.addEventListener('click', function() {
  // Change the z-index of the movie player
  moviePlayer.style.zIndex = '3';
});
