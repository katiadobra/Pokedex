'use strict';

(function() {
  var pokemonsContainer = document.querySelector('.pokemons-list');
  var templateElement = document.querySelector('#pokemon-template');
  var detailsContainer = document.querySelector('#details');
  var elementToClone;
  var pokemonsList = [];
  var loadedData;
  var id = 0;

  var POKEMONS_LOAD_URL = 'https://pokeapi.co/api/v2/pokemon/?limit=10';
  var POKEMON_IMAGE_BASE_URL = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/';

  if ('content' in templateElement) {
    elementToClone = templateElement.content.querySelector('.pokemon');
  } else {
    elementToClone = templateElement.querySelector('.pokemon');
  }

  /**
   * Create Pokemon card
   *
   * @param data {Array}
   * @param container {Element}
   * @param id {Number}
   * @return {Node}
   */
  var getPokemonElement = function(data, container, id) {
    var element = elementToClone.cloneNode(true);
    element.querySelector('.pokemon__name').textContent = data.name;
    element.querySelector('.pokemon__idx').innerHTML = id;
    container.appendChild(element);

    element.addEventListener('click', function() {
      getPokemonData(data.url, showDetails);
    });

    var image = new Image();
    image.onload = function(evt) {
      element.querySelector('.pokemon__img img').setAttribute('src', evt.target.src);
    };
    image.onerror = function() {
      element.classList.add('no-photo');
    };
    image.src = POKEMON_IMAGE_BASE_URL + id + '.png';

    return element;
  };

  /**
   * Show detailed info of chosen pokemon
   *
   * @param data {Object}
   */
  var showDetails = function(data) {
    detailsContainer.querySelector('.descr__img img').setAttribute('src', data.sprites.front_default);
    detailsContainer.querySelector('.descr__name').textContent = data.name + ' #' + data.id;

    detailsContainer.querySelector('.descr__speed').textContent = data.stats[0].base_stat;
    detailsContainer.querySelector('.descr__sp-defense').textContent = data.stats[1].base_stat;
    detailsContainer.querySelector('.descr__sp-attack').textContent = data.stats[2].base_stat;
    detailsContainer.querySelector('.descr__defense').textContent = data.stats[3].base_stat;
    detailsContainer.querySelector('.descr__attack').textContent = data.stats[4].base_stat;
    detailsContainer.querySelector('.descr__hp').textContent = data.stats[5].base_stat;

    detailsContainer.querySelector('.descr__weight').textContent = data.weight;
    detailsContainer.querySelector('.descr__total-moves').textContent = data.moves.length;

    detailsContainer.querySelector('.descr__type').textContent = '';

    data.types.forEach(function(it) {
      var li = document.createElement('li');
      li.textContent = it.type.name;
      detailsContainer.querySelector('.descr__type').appendChild(li);
    });

    detailsContainer.removeAttribute('hidden');
    setScrollEnabled();
  };

  var hideDetails = function() {
    detailsContainer.setAttribute('hidden');
  };

  /**
   * Get pokemons list
   *
   * @param url {string}
   * @param callback {function}
   */
  var getPokemons = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(evt) {
      var loadedData = JSON.parse(evt.target.response);
      callback(loadedData);
    };

    xhr.open('GET', url);
    xhr.send();
  };

  /**
   * Get pokemon details data
   *
   * @param url {string}
   * @param callback {function}
   */
  var getPokemonData = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.onload = function(evt) {
      var loadedPokemon = JSON.parse(evt.target.response);
      callback(loadedPokemon)
    };
    xhr.open('GET', url);
    xhr.send();
  };

  /**
   * Render pokemon's list
   *
   * @param pokemons {Array.<Object>} pokemons
   */
  function renderPokemons(pokemons) {
    var fragment = document.createDocumentFragment();

    pokemons.forEach(function(pokemon) {
      id++;
      getPokemonElement(pokemon, fragment, id);
    });

    pokemonsContainer.appendChild(fragment);
  }

  /**
   *
   * @param loadedPokemons {Object}
   */
  function cb(loadedPokemons) {
    loadedData = loadedPokemons;
    pokemonsList = loadedData['results'];
    renderPokemons(pokemonsList);
    setBtnEnabled();
  }

  /**
   * Should be multiplied by 10 to load next page
   *
   * @type {number}
   */
  var limit = 0;

  function renderNextPages() {
    getPokemons(POKEMONS_LOAD_URL + '&offset=' + (++limit * 10), cb);
  }

  function setBtnEnabled() {
    var btn = document.querySelector('#load-more');
    btn.addEventListener('click', renderNextPages);
  }

  getPokemons(POKEMONS_LOAD_URL, cb);


  /**
   * Sticky Details block
   */
  var setScrollEnabled = function() {
    window.addEventListener('scroll', function() {
      var GAP = 300;

      if (document.body.scrollTop + document.documentElement.scrollTop > GAP) {
        detailsContainer.classList.add('descr--sticky');
      } else {
        detailsContainer.classList.remove('descr--sticky');
      }
    });
  };

})();
