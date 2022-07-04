'use strict';

const trendingMovies = document.querySelector('header #trending');
const gensHead = document.querySelector('header #dropdown-head');
const gensList = document.querySelector('#dropdown-content');
const searchINPT = document.querySelector('#search input');
const searchBTN = document.querySelector('#search button');
const filmsSection = document.querySelector('main #films');
const subTitle = document.querySelector('main #subtitle');
const description = document.querySelector('main #films  #description');
const descriptionClose = document.querySelector('main #films  #description i');
const descTitle = document.querySelector(
  'main #films  #description #about #photo h3'
);
const descPhoto = document.querySelector(
  'main #films  #description #about #photo div'
);
const descOverview = document.querySelector(
  'main #films  #description #about #details p#overview'
);
const descRelDate = document.querySelector(
  'main #films  #description #about #details p#rel_date'
);
const descRating = document.querySelector(
  'main #films  #description #about #details p#rating'
);
const descDuration = document.querySelector(
  'main #films  #description #about #details p#duration'
);

// Genres list
async function genresFunc() {
  // Get genres data
  await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=c24f09a7589f9ef8b6dad6f0836116a0&language=en-US`
  )
    .then((response) => response.json())
    .then((data) => {
      // Display genres list
      const gens = data.genres;
      for (let i = 0; i < gens.length; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.setAttribute('href', `#${gens[i].name}`);
        const genName = document.createTextNode(gens[i].name);
        a.appendChild(genName);
        li.appendChild(a);
        li.id = gens[i].id;
        gensList.appendChild(li);
      }
    })
    .catch(console.error);

  // Display specified genre films
  const genres = document.querySelectorAll('#dropdown-content li');
  genres.forEach((gen) => {
    gen.addEventListener('click', (e) => {
      e.preventDefault();
      trendingMovies.classList.remove('active');
      gensHead.classList.add('active');
      const genValue = e.target.innerText;
      console.log(genValue);
      subTitle.innerText = `${genValue}`;
      const genID = e.target.parentElement.id;
      console.log(genID);
      fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=c24f09a7589f9ef8b6dad6f0836116a0&with_genres=${genID}`
      )
        .then((response) => response.json())
        .then((data) => {
          // Remove old movies
          const elements = document.getElementsByClassName('film');
          while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
          }

          // Display new movies
          displayMovies(data);

          // Add description
          addDescFunction();
        })
        .catch(console.error);
    });
  });
}
genresFunc();

// Get trending movies and details
async function trendingMoviesFunc() {
  // Get trending movies data
  await fetch(
    'https://api.themoviedb.org/3/trending/movie/week?api_key=c24f09a7589f9ef8b6dad6f0836116a0'
  )
    .then((response) => response.json())
    .then((data) => {
      // Display movies
      displayMovies(data);
    })
    .catch(console.error);

  // Add description
  addDescFunction();
}
trendingMoviesFunc();

// Display trending movies by clicking button
trendingMovies.addEventListener('click', (e) => {
  e.preventDefault();
  gensHead.classList.remove('active');
  trendingMovies.classList.add('active');
  subTitle.innerText = `Trending Movies`;
  // Remove old movies
  const elements = document.getElementsByClassName('film');
  while (elements.length > 0) {
    elements[0].parentNode.removeChild(elements[0]);
  }
  // Display trending movies
  trendingMoviesFunc();
});

// Display movies function
function displayMovies(data) {
  const results = data.results;
  for (let i = 0; i < results.length; i++) {
    if (results[i].poster_path != null) {
      const div = document.createElement('div');
      div.style.backgroundImage = `url(https://image.tmdb.org/t/p/w185${results[i].poster_path})`;
      const text = document.createElement('h2');
      text.appendChild(document.createTextNode(results[i].title));
      div.id = results[i].id;
      div.classList.add('film');
      div.appendChild(text);
      filmsSection.appendChild(div);
    }
  }
}

// Add description function
function addDescFunction() {
  filmsSection.querySelectorAll('div.film').forEach((d) => {
    d.addEventListener('click', (e) => {
      e.preventDefault();
      fetch(
        `https://api.themoviedb.org/3/movie/${e.target.parentElement.id}?api_key=c24f09a7589f9ef8b6dad6f0836116a0&language=en-US`
      )
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          descTitle.innerHTML = data.title;
          descPhoto.style.backgroundImage = `url(https://image.tmdb.org/t/p/w185${data.poster_path})`;
          descOverview.innerHTML = `<span>Overview:</span> ${data.overview}`;
          descRelDate.innerHTML = `<span>Release Date:</span> ${data.release_date}`;
          descRating.innerHTML = `<span>Rating:</span> ${data.vote_average}/10`;
          descDuration.innerHTML = `<span>Duration:</span> ${data.runtime}mins`;
          description.classList.add('active');
        })
        .catch(console.error);
    });
  });
}

// Close description window
descriptionClose.addEventListener('click', (e) => {
  e.preventDefault();
  description.classList.remove('active');
  descClear();
});

// Clear description window function
function descClear() {
  descTitle.innerHTML = '';
  descPhoto.style.backgroundImage = ``;
  descOverview.innerHTML = ``;
  descRelDate.innerHTML = ``;
  descRating.innerHTML = ``;
  descDuration.innerHTML = ``;
}

// Search engine
searchBTN.addEventListener('click', (e) => {
  const searchTitle = searchINPT.value;
  const searchVal = searchTitle.split(' ').join('+');
  gensHead.classList.remove('active');
  trendingMovies.classList.remove('active');
  searchINPT.value = '';
  fetch(
    `https://api.themoviedb.org/3/search/movie?api_key=c24f09a7589f9ef8b6dad6f0836116a0&query=${searchVal}`
  )
    .then((response) => response.json())
    .then((data) => {
      // Remove old movies
      const elements = document.getElementsByClassName('film');
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }

      if (data.results.length < 1) {
        subTitle.innerText = `No results...`;
      } else {
        subTitle.innerText = `Search: '${searchTitle}'`;
      }

      // Display movies
      displayMovies(data);

      // Add description function
      addDescFunction();
    });
});
