(function () {
  var toggle = document.querySelector('[data-menu-toggle]');
  var nav = document.querySelector('[data-mobile-nav]');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      nav.classList.toggle('open');
      document.body.classList.toggle('menu-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('.hero-slide'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var current = 0;
    var timer = null;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    }

    function startHero() {
      window.clearInterval(timer);
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        showSlide(Number(dot.getAttribute('data-hero-dot') || 0));
        startHero();
      });
    });

    if (slides.length > 1) {
      startHero();
    }
  }

  var results = document.querySelector('[data-search-results]');
  var status = document.querySelector('[data-search-status]');

  if (results && status && window.MOVIE_SEARCH_INDEX) {
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim();
    var input = document.querySelector('.big-search input[name="q"]');

    if (input) {
      input.value = query;
    }

    var normalizedQuery = query.toLowerCase();
    var source = window.MOVIE_SEARCH_INDEX.slice();
    var matched = normalizedQuery
      ? source.filter(function (item) {
          return [
            item.title,
            item.year,
            item.region,
            item.type,
            item.rawType,
            item.genre,
            item.oneLine,
            (item.tags || []).join(' ')
          ].join(' ').toLowerCase().indexOf(normalizedQuery) !== -1;
        })
      : source.sort(function (a, b) {
          return b.heat - a.heat;
        }).slice(0, 60);

    status.textContent = normalizedQuery ? '找到 ' + matched.length + ' 条与“' + query + '”相关的内容' : '热门内容';
    results.innerHTML = matched.slice(0, 120).map(function (item) {
      var tags = (item.tags || []).slice(0, 3).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');

      return [
        '<article class="movie-card">',
        '  <a href="' + item.url + '" class="poster-wrap" aria-label="观看' + escapeHtml(item.title) + '">',
        '    <img src="' + item.image + '" alt="' + escapeHtml(item.title) + '" loading="lazy">',
        '    <span class="play-float">▶</span>',
        '  </a>',
        '  <div class="card-body">',
        '    <div class="card-meta">',
        '      <span>' + escapeHtml(item.year) + '</span>',
        '      <span>' + escapeHtml(item.region) + '</span>',
        '      <span>' + escapeHtml(item.type) + '</span>',
        '    </div>',
        '    <h2><a href="' + item.url + '">' + escapeHtml(item.title) + '</a></h2>',
        '    <p>' + escapeHtml(item.oneLine) + '</p>',
        '    <div class="tag-row">' + tags + '</div>',
        '  </div>',
        '</article>'
      ].join('');
    }).join('');
  }

  function escapeHtml(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
})();
