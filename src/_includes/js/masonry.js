// /src/_includes/masonry.js

/**
 * Masonry polyfill
 * See https://css-tricks.com/a-lightweight-masonry-solution/
 */

document.addEventListener(`DOMContentLoaded`, () => {

  let grids = [...document.querySelectorAll(`.masonry`)];
  const delay = ms => new Promise(res => setTimeout(res, ms));

  if (grids.length) {
    // Check for support using both of the proposed syntaxes;
    // see https://github.com/w3c/csswg-drafts/issues/9041
    if ((getComputedStyle(grids[0]).gridTemplateRows === `masonry`) || (getComputedStyle(grids[0]).display === `masonry`)) {
      console.log(`Masonry supported, doing nothing`);
    } else {
      console.log(`Masonry not supported, running script`);

      grids = grids.map(grid => ({
        _el: grid,
        gap: parseFloat(getComputedStyle(grid).rowGap),
        items: [...grid.childNodes].filter(c => c.nodeType === 1),
        ncol: 0 }));

      function layout() {
        grids.forEach(grid => {
          /* get the post layout number of columns */
          let ncol = getComputedStyle(grid._el).gridTemplateColumns.split(` `).length;

          /* if the number of columns has changed */
          if (grid.ncol !== ncol) {
            /* update number of columns */
            grid.ncol = ncol;

            /* revert to initial positioning, no margin */
            grid.items.forEach(c => c.style.removeProperty(`margin-top`));

            /* if we have more than one column */
            if (grid.ncol > 1) {
              grid.items.slice(ncol).forEach((c, i) => {
                let prev_fin = grid.items[i].getBoundingClientRect().bottom /* bottom edge of item above */,
                curr_ini = c.getBoundingClientRect().top /* top edge of current item */;

                c.style.marginTop = `${prev_fin + grid.gap - curr_ini}px`;
              });
            }
          }
        });
      }
    }

    addEventListener(`load`, e => {
      layout(); /* initial load */
      addEventListener(`resize`, layout, false); /* on resize */
    }, false);
  } else {
    console.log(`Masonry class not found; doing nothing`);
  };
});
