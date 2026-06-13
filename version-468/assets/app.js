(function () {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', function () {
      const open = links.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
    });
  }

  const carousel = document.querySelector('[data-hero-carousel]');

  if (carousel) {
    const slides = Array.from(carousel.querySelectorAll('.hero-slide'));
    const dots = Array.from(carousel.querySelectorAll('.hero-dot'));
    let current = 0;
    let timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      timer = window.setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    function resetTimer() {
      if (timer) {
        window.clearInterval(timer);
      }
      startTimer();
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        const index = Number(dot.getAttribute('data-slide'));
        showSlide(index);
        resetTimer();
      });
    });

    showSlide(0);
    startTimer();
  }

  const filterScopes = Array.from(document.querySelectorAll('[data-filter-scope]'));

  filterScopes.forEach(function (scope) {
    const input = scope.querySelector('[data-filter-input]');
    const yearButtons = Array.from(scope.querySelectorAll('[data-filter-year]'));
    const tagButtons = Array.from(scope.querySelectorAll('[data-filter-tag]'));
    const cards = Array.from(scope.querySelectorAll('.movie-card, .rank-card'));
    let selectedYear = 'all';
    let selectedTag = 'all';

    function normalize(value) {
      return String(value || '').toLowerCase().trim();
    }

    function cardText(card) {
      return [
        card.getAttribute('data-title'),
        card.getAttribute('data-genre'),
        card.getAttribute('data-tags'),
        card.getAttribute('data-year'),
        card.getAttribute('data-region'),
        card.getAttribute('data-type')
      ].join(' ').toLowerCase();
    }

    function applyFilter() {
      const keyword = normalize(input ? input.value : '');

      cards.forEach(function (card) {
        const text = cardText(card);
        const year = card.getAttribute('data-year') || '';
        const tags = card.getAttribute('data-tags') || '';
        const keywordMatched = !keyword || text.includes(keyword);
        const yearMatched = selectedYear === 'all' || year === selectedYear;
        const tagMatched = selectedTag === 'all' || tags.includes(selectedTag);
        card.classList.toggle('is-filter-hidden', !(keywordMatched && yearMatched && tagMatched));
      });
    }

    if (input) {
      const params = new URLSearchParams(window.location.search);
      const query = params.get('q');
      if (query) {
        input.value = query;
      }
      input.addEventListener('input', applyFilter);
    }

    yearButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectedYear = button.getAttribute('data-filter-year') || 'all';
        yearButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilter();
      });
    });

    tagButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        selectedTag = button.getAttribute('data-filter-tag') || 'all';
        tagButtons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });
        applyFilter();
      });
    });

    applyFilter();
  });
}());
