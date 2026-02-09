(function () {
  'use strict';

  var nav = document.getElementById('nav');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Perfume filters on perfumes page
  var filterBar = document.querySelector('[data-perfume-filter]');
  if (filterBar) {
    var filterButtons = filterBar.querySelectorAll('.filter-pill');
    var perfumeCards = document.querySelectorAll('.oils-grid .oil-card');

    function applyFilter(tag) {
      perfumeCards.forEach(function (card) {
        var notes = (card.getAttribute('data-note-tags') || '').toLowerCase();
        if (tag === 'all' || notes.indexOf(tag) !== -1) {
          card.style.display = '';
        } else {
          card.style.display = 'none';
        }
      });
    }

    filterButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var tag = btn.getAttribute('data-filter');

        filterButtons.forEach(function (b) {
          b.classList.remove('is-active');
        });
        btn.classList.add('is-active');

        applyFilter(tag);
      });
    });
  }
})();
