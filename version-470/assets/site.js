(function () {
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      var opened = mobileNav.classList.toggle('is-open');
      menuButton.setAttribute('aria-expanded', opened ? 'true' : 'false');
    });
  }

  var slider = document.querySelector('[data-hero-slider]');

  if (slider) {
    var slides = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(slider.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    var showSlide = function (index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, position) {
        slide.classList.toggle('is-active', position === current);
      });
      dots.forEach(function (dot, position) {
        dot.classList.toggle('is-active', position === current);
      });
    };

    var startTimer = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    };

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        showSlide(index);
        startTimer();
      });
    });

    if (slides.length > 1) {
      startTimer();
    }
  }

  Array.prototype.slice.call(document.querySelectorAll('[data-filter-root]')).forEach(function (root) {
    var input = root.querySelector('[data-card-search]');
    var select = root.querySelector('[data-card-type]');
    var cards = Array.prototype.slice.call(root.querySelectorAll('[data-filter-card]'));

    var applyFilter = function () {
      var keyword = input ? input.value.trim().toLowerCase() : '';
      var typeValue = select ? select.value.trim().toLowerCase() : '';

      cards.forEach(function (card) {
        var haystack = [
          card.getAttribute('data-title'),
          card.getAttribute('data-region'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-genre')
        ].join(' ').toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesType = !typeValue || (card.getAttribute('data-type') || '').toLowerCase() === typeValue;
        card.classList.toggle('is-filter-hidden', !(matchesKeyword && matchesType));
      });
    };

    if (input) {
      input.addEventListener('input', applyFilter);
    }
    if (select) {
      select.addEventListener('change', applyFilter);
    }
  });

  var searchInput = document.querySelector('[data-search-input]');
  var searchButton = document.querySelector('[data-search-button]');
  var searchResults = document.querySelector('[data-search-results]');
  var searchTitle = document.querySelector('[data-search-title]');
  var searchData = window.movieSearchIndex || [];

  var buildSearchCard = function (movie) {
    return [
      '<a class="movie-card movie-card-normal" href="' + movie.url + '">',
      '  <span class="card-cover">',
      '    <img src="' + movie.image + '" alt="' + escapeHtml(movie.title) + '" loading="lazy">',
      '    <span class="cover-shade"></span>',
      '    <span class="year-badge">' + escapeHtml(movie.year) + '</span>',
      '    <span class="type-badge">' + escapeHtml(movie.type) + '</span>',
      '  </span>',
      '  <span class="card-content">',
      '    <strong>' + escapeHtml(movie.title) + '</strong>',
      '    <em>' + escapeHtml(movie.region + ' · ' + movie.genre) + '</em>',
      '    <span class="card-line">' + escapeHtml(movie.line) + '</span>',
      '  </span>',
      '</a>'
    ].join('');
  };

  var runSearch = function (value) {
    if (!searchInput || !searchResults || !searchData.length) {
      return;
    }

    var keyword = (value || searchInput.value || '').trim().toLowerCase();
    var result = searchData.filter(function (movie) {
      var haystack = [movie.title, movie.region, movie.type, movie.year, movie.genre, movie.tags, movie.line].join(' ').toLowerCase();
      return !keyword || haystack.indexOf(keyword) !== -1;
    }).slice(0, 60);

    if (searchTitle) {
      searchTitle.textContent = keyword ? '相关影片' : '热门推荐';
    }

    searchResults.innerHTML = result.map(buildSearchCard).join('');
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  if (searchInput && searchResults) {
    searchInput.addEventListener('input', function () {
      runSearch(searchInput.value);
    });
    if (searchButton) {
      searchButton.addEventListener('click', function () {
        runSearch(searchInput.value);
      });
    }
    Array.prototype.slice.call(document.querySelectorAll('[data-hot-term]')).forEach(function (button) {
      button.addEventListener('click', function () {
        searchInput.value = button.getAttribute('data-hot-term') || '';
        runSearch(searchInput.value);
      });
    });
  }
}());
