// /src/_includes/currentNav.js

(function (window, document) {
  `use strict`;

  const navLinks = document.querySelectorAll('nav.header-footer a');

  let current = 0;
  let ariaCurrent = 0;

  for (let i = 0; i < navLinks.length; i++) {
    const str = navLinks[i].href;
    if (document.URL.startsWith(str)) {
      current = i;
    };
    if (navLinks[i].href === document.URL) {
      ariaCurrent = i;
    };
  }

  navLinks[current].classList.add(`current`);
  navLinks[ariaCurrent].ariaCurrent = `page`;

})(window, document);
