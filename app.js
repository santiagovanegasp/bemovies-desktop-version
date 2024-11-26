
    /////////  version 4  //////
    let swiper;
    let hasResults; 

    document.addEventListener("DOMContentLoaded", function () {
      initializeSwiper();
    });



    function initializeSwiper() {
      swiper = new Swiper('.swiper-container', {
        loop: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        },
        // autoplay: {
        //   delay: 3000,
        // },  ?? on/off
        slidesPerView: 4,
      });
    }; 


    // dom
    const inputSearchField = document.getElementsByClassName('inputRecherche')[0];
    const searchButton = document.getElementsByClassName('bouton-recherche')[0];

    // api
    const baseUrl = 'https://api.themoviedb.org/3';
    const apiKey = '2673db0aadd5c7ad249c3ea0ea3c787b';


    // functions to search 


    async function searchMovie(query) {
      const url = `${baseUrl}/search/movie?api_key=${apiKey}&query=${query}&language=en-US`;
      const response = await fetch(url);
      const data = await response.json();
      return data.results;

    };



    async function searchCast(movieId) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}/credits?api_key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();
      return data.cast;
    }

    console.log(searchCast(550));  ///test 


    // Enter search old version  

    inputSearchField.addEventListener('keydown', function(event) {
      const query = inputSearchField.value;
      const spanResults = document.getElementById('inputResult');
      const swiperContainer = document.getElementById('swiper-container1');
      
      if (event.key === 'Enter' && query) {
      
        searchMovie(query).then(function(results) {
          console.log('Resultados de búsqueda:', results);
          spanResults.textContent = `"${query}"`;
          swiperContainer.style.display = 'block';
          hasResults = results.length > 0; // Actualizar si hay resultados
          if (!hasResults) {
            console.warn('No se encontraron resultados.');
            document.getElementById('swiper-container-search').innerHTML = '<p class="text-section">No results found</p>';
            changeNavButtonsPosition ();
            return;
          }
          changeNavButtonsPosition ();
          // hoverCardPositon();
          // Destroy actual swiper
          if (swiper && typeof swiper.destroy === "function") {
            swiper.destroy();
          }
          
          setTimeout(() => {
          initializeSwiper();  
        }, 50); // delay to fix 
          
          showImages(results);

        });
      }
    });

    //_____________

    

    // test version 

    // click search    old  version
  
    searchButton.addEventListener('click', async function() {
      const query = inputSearchField.value;
      const spanResults = document.getElementById('inputResult');
      const swiperContainer = document.getElementById('swiper-container1');
    
      if (query) {
        const results = await searchMovie(query);
    
        hasResults = results.length > 0; // Actualizar si hay resultados
        console.log('Resultados de búsqueda:', results);
        spanResults.textContent = `"${query}"`;
        swiperContainer.style.display = 'block';
        changeNavButtonsPosition();
    
        // Si no hay resultados, limpiar el swiper
        if (!hasResults) {
          console.warn('No se encontraron resultados.');
          document.getElementById('swiper-container-search').innerHTML = '<p class="text-section">No results found</p>';
          return;
        }
    
        if (swiper && typeof swiper.destroy === "function") {
          swiper.destroy();
        }
    
        setTimeout(() => {
          initializeSwiper();
        }, 50); // Retraso
        showImages(results);
      }
    });
    

    // 



    //////////////// _______________ /////////////
    
    
  /// genres 

  // api url 
    const baseImageUrl = 'https://image.tmdb.org/t/p/';
    const posterSize = 'w500';  // best w

    const movieGenres = {
      genres: [
        { id: 28, name: "Action" },
        { id: 12, name: "Adventure" },
        { id: 16, name: "Animation" },
        { id: 35, name: "Comedy" },
        { id: 80, name: "Crime" },
        { id: 99, name: "Documentary" },
        { id: 18, name: "Drama" },
        { id: 10751, name: "Family" },
        { id: 14, name: "Fantasy" },
        { id: 36, name: "History" },
        { id: 27, name: "Horror" },
        { id: 10402, name: "Music" },
        { id: 9648, name: "Mystery" },
        { id: 10749, name: "Romance" },
        { id: 878, name: "Science Fiction" },
        { id: 10770, name: "TV Movie" },
        { id: 53, name: "Thriller" },
        { id: 10752, name: "War" },
        { id: 37, name: "Western" }
      ]
    };
    
    
      function getGenreNamesByIds(ids) {
        let genreNames = []; // Creamos un array vacío para almacenar los nombres
      
        // Recorremos cada ID en el array `ids`
        for (let i = 0; i < ids.length; i++) {
          let genreId = ids[i]; // Tomamos el ID actual
      
          // Buscamos en `movieGenres` el género que tiene este ID
          let genre = movieGenres.genres.find(function(g) {
            return g.id === genreId;
          });
      
          // Si encontramos el género, agregamos su nombre al array `genreNames`
          if (genre) {
            genreNames.push(genre.name);
          } else {
            genreNames.push("Unknown"); // Si no encontramos el ID, ponemos "Unknown"
          }
        }
      
        return genreNames; // Devolvemos el array de nombres de géneros
      };



  /// function create images  input search 


  const showImages = async (results) => {
    const swiperContainer = document.getElementById('swiper-container-search'); 
    swiperContainer.innerHTML = ''; // clean  container 

    for (const movie of results) {  // for of works better to async functions
      if (movie.poster_path) {
        const posterUrl = `${baseImageUrl}${posterSize}${movie.poster_path}`;
        const title = movie.original_title;
        const overview = movie.overview;
        const releaseDate = movie.release_date.split("-")[0];
        const movieIdGenres = getGenreNamesByIds(movie.genre_ids).join('/');
        
        const votesAverage = movie.vote_average.toFixed(1);
        const movieId = movie.id;


        // div 
        const swiperSlide = document.createElement('div');
        swiperSlide.classList.add("swiper-slide");

        // img
        const imageFromSearch = document.createElement('img');
        imageFromSearch.classList.add("movie-images-search");
        imageFromSearch.src = posterUrl;

        // CONTAINER HOVER CARDS
        const movieInfo = document.createElement('div');
        movieInfo.classList.add("movie-info");

        // title and info elements  
        const movieTitle = document.createElement('p');
        movieTitle.classList.add("movie-title");
        movieTitle.textContent = title;

        const releaseDateMovie = document.createElement('p');
        releaseDateMovie.classList.add("movie-release-date");
        releaseDateMovie.textContent = releaseDate;

        const genresText = document.createElement('p');
        genresText.classList.add('movies-genres');
        genresText.textContent = movieIdGenres;

        const starVote = document.createElement('p');
        starVote.classList.add('movies-votes');
        starVote.textContent = '★';

        const averageVote = document.createElement('p');
        averageVote.classList.add('movies-votes');
        averageVote.textContent = votesAverage;

        // adding infos 
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDateMovie);
        movieInfo.appendChild(genresText);
        movieInfo.appendChild(starVote);
        movieInfo.appendChild(averageVote);

        // Add to father container
        swiperSlide.appendChild(imageFromSearch);
        swiperSlide.appendChild(movieInfo);

        // open modal 
        swiperSlide.addEventListener("click", async function () {
          const myCast = await searchCast(movieId); // waits for cast promise
          openModalWithMovieInfo(title, releaseDate, votesAverage, movieIdGenres, overview, posterUrl, myCast);
        });

        // Agregar el slide al contenedor de Swiper
        swiperContainer.appendChild(swiperSlide);
      }

      closeModal();
    }
  };  

 // test version showImages___

// test version end 
  /// 

  function openModalWithMovieInfo(title, releaseDate, votesAverage, genres, overview, posterUrl, cast) {
    const myModalFilm = document.getElementsByClassName('modale-film-BGound')[0];
    myModalFilm.style.display = "block"; 

    // dom
    document.querySelector('.titre-film').textContent = title;
    document.querySelector('.annee-film').textContent = releaseDate;
    document.querySelector('.note-film').textContent = `★${votesAverage}`;
    document.querySelector('.genre-film').textContent = genres;
    document.querySelector('.synopsis-film p').textContent = overview;
    document.querySelector('.image-film img').src = posterUrl;

    // cast filter
    const castNames = cast.slice(0, 5).map(actor => actor.name).join(', ');
    document.querySelector('.cast-here').textContent = castNames; // shows only five
  };

  function closeModal() {
  
    const myModalFilm = document.getElementsByClassName('modale-film-BGound')[0];
    const closeModalX = document.getElementById('close-btn-film-Modal');
  
    // outside content
    myModalFilm.addEventListener("click", function (event) {
      if (event.target === myModalFilm) {
        myModalFilm.style.display = "none";
      }
    });

    // close btn X
    if (closeModalX) {
      closeModalX.addEventListener("click", function () {
        myModalFilm.style.display = "none";
      });
    }
  };  


  // _____________________________ //


  // dom elementes Latest

  const latestSwiperWrapper = document.getElementById("swiper-container-latest");

  const apiUrl = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`; 


  // Swiper  Latest Releases

  // function initializeSwiper() {
  //   swiper = new Swiper('.swiper-container', {
  //     loop: true,
  //     pagination: {
  //       el: '.swiper-pagination',
  //       clickable: true,
  //     },
  //     navigation: {
  //       nextEl: '.swiper-button-next',
  //       prevEl: '.swiper-button-prev',
  //     },
  //     // autoplay: {
  //     //   delay: 3000,
  //     // },  ?? on/off
  //     slidesPerView: 4,
  //   });
  // }


  /////


  const latestSwiper = new Swiper('.swiper-container2', {
      loop: true,
      pagination: {
          el: '.swiper-pagination',
          clickable: true,
      },
      navigation: {
          nextEl: '.swiper-button-next2',
          prevEl: '.swiper-button-prev2',
      },
      slidesPerView: 4,
      spaceBetween: 20,
  });


  // Función para cargar las películas

  async function loadLatestReleases() {
    try {
      
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Error fetching latest releases");
      const data = await response.json();
      const movies = data.results;

      latestSwiperWrapper.innerHTML = "";

      if (!movies || !movies.length) {
        console.warn("No movies found");
        return;
      }

      movies.forEach(movie => {
        if (movie.poster_path) {
          const posterUrl = `${baseImageUrl}${posterSize}${movie.poster_path}`;
          const title = movie.original_title;
          const overview = movie.overview;
          const releaseDate = movie.release_date.split("-")[0];
          const movieIdGenres = getGenreNamesByIds(movie.genre_ids).join('/');
          const votesAverage = movie.vote_average.toFixed(1);
          const movieId = movie.id;

        // Crear la imagen y asignarle la URL del póster
          const swiperSlide = document.createElement('div');
          swiperSlide.classList.add('swiper-slide');

          const image = document.createElement('img');
          image.src = posterUrl;
          image.alt = movie.title || "Movie Poster";

        // CONTAINER HOVER CARDS
        const movieInfo = document.createElement('div');
        movieInfo.classList.add("movie-info");

        // Elements
        const movieTitle = document.createElement('p');
        movieTitle.classList.add("movie-title");
        movieTitle.textContent = title;

        const releaseDateMovie = document.createElement('p');
        releaseDateMovie.classList.add("movie-release-date");
        releaseDateMovie.textContent = releaseDate;

        const genresText = document.createElement('p');
        genresText.classList.add('movies-genres');
        genresText.textContent = movieIdGenres;

        const starVote = document.createElement('p');
        starVote.classList.add('movies-votes');
        starVote.textContent = '★';

        const averageVote = document.createElement('p');
        averageVote.classList.add('movies-votes');
        averageVote.textContent = votesAverage;

        // adding
        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDateMovie);
        movieInfo.appendChild(genresText);
        movieInfo.appendChild(starVote);
        movieInfo.appendChild(averageVote);

        //father container
      
          swiperSlide.appendChild(movieInfo);


          /////____________////  
          

          swiperSlide.appendChild(image);
          latestSwiperWrapper.appendChild(swiperSlide);

          // open modal 
          swiperSlide.addEventListener("click", async () => {
            const myCast = await searchCast(movie.id);
            openModalWithMovieInfo(
              movie.original_title,
              movie.release_date.split("-")[0],
              movie.vote_average.toFixed(1),
              getGenreNamesByIds(movie.genre_ids).join('/'),
              movie.overview,
              posterUrl,
              myCast
            );
          });
          closeModal();
        }
        
      });

      // update swiper after content is created
      latestSwiper.update();
    } catch (error) {
      console.error("Error loading latest releases:", error);
    } 

    swiperbug ();
  };


  /// bug correction // 
  function swiperbug (){
    // Destruir la instancia de Swiper existente
if (latestSwiper) {
  latestSwiper.destroy(true, true);  // true, true asegura que también se destruyan los eventos y estilos.
}

// Re-inicializar Swiper
latestSwiper = new Swiper('.swiper-container2', {
  loop: true,
  navigation: {
    nextEl: '.swiper-button-next2',
    prevEl: '.swiper-button-prev2',
  },
  slidesPerView: 4,
  spaceBetween: 20,
});
  };
// ___________ // 

  loadLatestReleases()  




  ////////  dom movies by genre 


  const textShowing = document.getElementById('text-result-genre')
  const genreBtncomedy = document.getElementsByClassName('comedy')[0]
  const genreBtndrama = document.getElementsByClassName('drama')[0]
  const genreBtnaction = document.getElementsByClassName('action')[0]
  const genreBtnromance= document.getElementsByClassName('romance')[0]
  const genreBtnfantasy = document.getElementsByClassName('fantasy')[0]
  const genreBtnanimation = document.getElementsByClassName('animation')[0]

  // 



  //

  let genreIdSelected = 53 ;  // default value thriller

  //

  function updateGenreUrl() {
    urlByGenre = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIdSelected}&language=en&sort_by=popularity.desc&vote_average.gte=7&page=1&api_key=2673db0aadd5c7ad249c3ea0ea3c787b`;
  }



  genreBtncomedy.addEventListener('click', function () {
    genreIdSelected = 35; 
    textShowing.textContent= 'Comedy';
    updateGenreUrl();    
    loadMoviesByGenre(); 
  });
  genreBtndrama.addEventListener('click', function (){
    genreIdSelected = 18;
    textShowing.textContent= 'Drama';
    updateGenreUrl();    
    loadMoviesByGenre(); 
  })
  genreBtnaction.addEventListener('click', function (){
    genreIdSelected = 28;
    textShowing.textContent= 'Action';
    updateGenreUrl();    
    loadMoviesByGenre(); 
  })
  genreBtnromance.addEventListener('click', function (){
    genreIdSelected = 10749;
    textShowing.textContent= 'Romance';
    updateGenreUrl();   
    loadMoviesByGenre(); 
  })
  genreBtnfantasy.addEventListener('click', function (){
    genreIdSelected = 14;
    textShowing.textContent= 'Fantasy';
    updateGenreUrl();   
    loadMoviesByGenre(); 
  })
  genreBtnanimation.addEventListener('click', function (){
    genreIdSelected = 16;
    textShowing.textContent= 'Animation';
    updateGenreUrl();   
    loadMoviesByGenre(); 
  })


  // dom elementes Latest


  const genreSwiperWrapper = document.getElementById("swiper-container-genre");

  let urlByGenre = `https://api.themoviedb.org/3/discover/movie?with_genres=${genreIdSelected}&language=en&sort_by=popularity.desc&vote_average.gte=7&page=1&api_key=2673db0aadd5c7ad249c3ea0ea3c787b` ; 

  const genreSwiper = new Swiper('.swiper-container3', {
    loop: true,
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },  
    navigation: {
          nextEl: '.swiper-button-next3',
          prevEl: '.swiper-button-prev3',
      },
      slidesPerView: 4,
      // spaceBetween: 20,
  });



  async function loadMoviesByGenre() {
    try {
      
      const response = await fetch(urlByGenre);
      if (!response.ok) throw new Error("Error fetching latest releases");
      const data = await response.json();
      const movies = data.results;

      genreSwiperWrapper.innerHTML = "";

    
      if (!movies || !movies.length) {
        console.warn("No movies found");
        return;
      }

    
      movies.forEach(movie => {
        if (movie.poster_path) {
          const posterUrl = `${baseImageUrl}${posterSize}${movie.poster_path}`;
          const title = movie.original_title;
          const overview = movie.overview;
          const releaseDate = movie.release_date.split("-")[0];
          const movieIdGenres = getGenreNamesByIds(movie.genre_ids).join('/');
          const votesAverage = movie.vote_average.toFixed(1);
          const movieId = movie.id;

          const swiperSlide = document.createElement('div');
          swiperSlide.classList.add('swiper-slide');

          const image = document.createElement('img');
          image.src = posterUrl;
          image.alt = movie.title || "Movie Poster";

        // CONTAINER HOVER CARDS
        const movieInfo = document.createElement('div');
        movieInfo.classList.add("movie-info");

        // elements
        const movieTitle = document.createElement('p');
        movieTitle.classList.add("movie-title");
        movieTitle.textContent = title;

        const releaseDateMovie = document.createElement('p');
        releaseDateMovie.classList.add("movie-release-date");
        releaseDateMovie.textContent = releaseDate;

        const genresText = document.createElement('p');
        genresText.classList.add('movies-genres');
        genresText.textContent = movieIdGenres;

        const starVote = document.createElement('p');
        starVote.classList.add('movies-votes');
        starVote.textContent = '★';

        const averageVote = document.createElement('p');
        averageVote.classList.add('movies-votes');
        averageVote.textContent = votesAverage;

        movieInfo.appendChild(movieTitle);
        movieInfo.appendChild(releaseDateMovie);
        movieInfo.appendChild(genresText);
        movieInfo.appendChild(starVote);
        movieInfo.appendChild(averageVote);
      
          swiperSlide.appendChild(movieInfo);


          /////____________////  
          

          swiperSlide.appendChild(image);
          genreSwiperWrapper.appendChild(swiperSlide);

          // open modal 
          swiperSlide.addEventListener("click", async () => {
            const myCast = await searchCast(movie.id);
            openModalWithMovieInfo(
              movie.original_title,
              movie.release_date.split("-")[0],
              movie.vote_average.toFixed(1),
              getGenreNamesByIds(movie.genre_ids).join('/'),
              movie.overview,
              posterUrl,
              myCast
            );
          });
          closeModal();
        }
      });

      genreSwiper.update();
    } catch (error) {
      console.error("Error loading latest releases:", error);
    }
    swiperbug ();
  };

  loadMoviesByGenre() ; 


  /////// changing css styles 

  const buttons = document.querySelectorAll('.genre button');

  buttons.forEach(button => {
      button.addEventListener('click', () => {

          buttons.forEach(btn => btn.classList.remove('active'));
          
          button.classList.add('active');
      });
  });


  ///

  function changeNavButtonsPosition () {
    const swiperbuttonnext2 = document.getElementsByClassName('swiper-button-next2')[0];
    const swiperbuttonprev2 = document.getElementsByClassName('swiper-button-prev2')[0];
    const swiperbuttonnext3 = document.getElementsByClassName('swiper-button-next3')[0];
    const swiperbuttonprev3 = document.getElementsByClassName('swiper-button-prev3 ')[0];

    if (hasResults) {
      // Posiciones cuando hay resultados
      swiperbuttonnext2.style.transform = 'translateY(1000%)';
      swiperbuttonprev2.style.transform = 'translateY(1300%)';
      swiperbuttonnext3.style.transform = 'translateY(2700%)';
      swiperbuttonprev3.style.transform = 'translateY(2700%)';
    } else {
      console.log('nothing to transform')
      swiperbuttonnext2.style.transform = 'translateY(230%)';
      swiperbuttonprev2.style.transform = 'translateY(508%)';
      swiperbuttonnext3.style.transform = 'translateY(1900%)';
      swiperbuttonprev3.style.transform = 'translateY(1900%)';

      //swiper-button-next2 transform: translateY(230%); 

      //  transform: translateY(1900%);


    }

    console.log( `status hasResults in changeNavButtonsPosition  ${hasResults}`)
    /*
    swiperbuttonnext2.style.transform = 'translateY(1000%)';
    swiperbuttonprev2.style.transform = 'translateY(1300%)';
    swiperbuttonnext3.style.transform = 'translateY(2700%)';
    swiperbuttonprev3.style.transform = 'translateY(2700%)';

    */
    
  };

  console.log( `status hasResults in global  ${hasResults}`)




  //  modal sing in log in // 

  function modalConection (){
    const connectionsite1 = document.getElementsByClassName('connection-site1')[0] ;
    const connectionsite2 = document.getElementsByClassName('connection-site2')[0] ;
    const modal = document.getElementsByClassName('formulaire-connection-modale-BGround')[0];
    const closeModalX = document.getElementById('close-btn-conect-Modal');
    const registerBtnHeader= document.getElementById('registerBtnHeader');
    const registerBtnFooter= document.getElementById('registerBtnFooter');

    connectionsite1.addEventListener('click', ()=> {
      modal.style.display= 'block';
    })
    connectionsite2.addEventListener('click', ()=> {
      modal.style.display= 'block';
    })

    registerBtnHeader.addEventListener('click', ()=> {
      modal.style.display= 'block';
    })
    registerBtnFooter.addEventListener('click', ()=> {
      modal.style.display= 'block';
    })

    modal.addEventListener("click", function (event) {
      if (event.target === modal) {
        modal.style.display = "none";
      }
    });

    // close btn X
    if (closeModalX) {
      closeModalX.addEventListener("click", function () {
        modal.style.display = "none";
      });
    } 
  };


  modalConection();


