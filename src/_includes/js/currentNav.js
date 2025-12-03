// /src/_includes/currentNav.js

((window, document) => {
  `use strict`;

  const navLinks = document.querySelectorAll(`nav.header-footer a`);

  let current = 0;
  let ariaCurrent = 0;

  for (let i = 0; i < navLinks.length; i++) {
    const str = navLinks[i].href;
    const url = document.URL;
    if (url.startsWith(str)) {
      current = i;
    }
    if (str === url) {
      ariaCurrent = i;
    }
  }

  navLinks[current].classList.add(`current`);
  navLinks[ariaCurrent].ariaCurrent = `page`;
})(window, document);
