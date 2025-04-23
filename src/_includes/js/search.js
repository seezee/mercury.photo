// /src/_includes/search.js

(function (document) {
  `use strict`;

  const form         = document.querySelector(`.pagefind-ui__form`);
  const label        = document.createElement(`label`);
  const searchField  = document.querySelector(`.pagefind-ui__search-input`);
  const hint         = document.createElement(`div`);
  // const results      = document.querySelector(`.pagefind-ui__drawer`);
  const clearButton  = document.querySelector(`.pagefind-ui__search-clear`);
  const resLink      = document.getElementById(`results-link`);

  form.setAttribute(`class`, `field`);
  form.insertBefore(label, form.children[0]);
  form.appendChild(hint);

  searchField.setAttribute(`id`, `searchField`);
  searchField.removeAttribute(`placeholder`);
  searchField.setAttribute(`inputMode`, `search`);

  label.setAttribute(`class`, `sr-only`);
  label.setAttribute(`for`, `searchField`);
  label.textContent = `Search`;

  clearButton.classList.add(`button`);
  clearButton.setAttribute(`aria-label`, `Clear search results`);
  clearButton.setAttribute(`value`, `×`);
  clearButton.textContent = `×`;

  hint.setAttribute(`id`, `search-hint__wrapper`);
  hint.innerHTML = `<kbd>⌘</kbd><kbd>K</kbd>`;

  clearButton.addEventListener(`click`, function() {

    clearButton.classList.add(`hide`);
    clearButton.setAttribute(`aria-hidden`, `true`);

    hint.classList.remove(`hide`);
    hint.removeAttribute(`aria-hidden`);

    resLink.setAttribute(`tabindex`, `-1`);
  });

  document.addEventListener(
    `keydown`,
    (e) => {
      const key = e.key;
      if (e.defaultPrevented) {
        return; // Do nothing if the event was already processed
      };

      if ((e.metaKey) && (key == `k`)) {
        e.preventDefault();
        searchField.focus();
      } else {
        return;
      };

      // Cancel the default action to avoid it being handled twice
      e.preventDefault();
    },
    true,
  );

  searchField.addEventListener(
    `focusin`,
    (e) => {
    hint.classList.add(`hide`);
    hint.setAttribute(`aria-hidden`, `true`);
    clearButton.classList.remove(`hide`);
    clearButton.removeAttribute(`aria-hidden`);
  });

  searchField.addEventListener(
    `focusout`,
    (e) => {
    let clearButtonIsFocused = false;
    clearButton.addEventListener(`focusin`, (e) => {
      clearButtonIsFocused = true;
      if ((searchField.value !== ``) || (clearButtonIsFocused === true)) {
        return;
      } else {
        hint.classList.remove(`hide`);
        hint.removeAttribute(`aria-hidden`);
      };
    });
  });
})(document);
