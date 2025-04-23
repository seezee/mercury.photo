'use strict';

function moveFootnote() {

  const sidebar   = document.getElementById(`sidenotes`);
  const list      = document.getElementsByClassName(`app-footnotes-list`);
  const list2      = document.getElementsByClassName(`app-marginnotes-list`);

  // Does the browser support position-anchor?
  if (CSS.supports("position-anchor", "--foobar")) {

    const small   = document.createElement(`small`);
    if (list.length) {
      const footer  = list[0].closest(`footer`);
      const rules   = footer.getElementsByTagName(`hr`);
      const rule    = rules[0];

      sidebar.append(small);
      small.append(footer);
      rule.remove();
    };

    if (list2.length) {
      const footer2 = list2[0].closest(`footer`);
      sidebar.append(small);
      small.append(footer2);
    };

    const flexBoxQuery = `.flex_box_wrappable`;
    const boxWrappedClass = `flex_box-wrapped`;
    const boxFlexedClass = `flex_box-flexed`;
    const boxSwitchedClass = `flex_box-switched`;
    const itemWrappedClass = `flex_item-wrapped`;
    const newRule = document.createElement(`hr`);
    newRule.classList.add(`govuk-section-break`, `govuk-section-break--l`, `govuk-section-break--visible`);

    // Rounded for inline-flex sub-pixel discrepancies:
    const getTop = item => Math.round(item.getBoundingClientRect().top);

    const markFlexboxAndItemsWrapState = flexBox => {

      // Acts as a throttle,
      // Prevents hitting ResizeObserver loop limit,
      // Optimal timing for visual change:
      requestAnimationFrame(_ => {

        const flexItems = flexBox.children;

        // Needs to be in a row for the calculations to work
        flexBox.setAttribute(`style`, `flex-direction: row`);

        const firstItemTop = getTop(flexItems[0]);
        const lastItemTop = getTop(flexItems[flexItems.length - 1]);

        // Add / remove wrapped class to each wrapped item
        for (const flexItem of flexItems) {
          const isItemWrapped = firstItemTop < getTop(flexItem);
          const isSwitchedBoxWrapped = flexBox.classList.contains(boxSwitchedClass) && firstItemTop < lastItemTop;
          const links = document.querySelectorAll(`[id^="mnref:"]`);

          if (isItemWrapped || isSwitchedBoxWrapped) {
            flexItem.classList.add(itemWrappedClass);
              if(links.length) {
                for (link of links)
                  link.removeAttribute(`class`);
              };
          } else {
            flexItem.classList.remove(itemWrappedClass);
            if(links.length) {
              for (link of links)
                link.setAttribute(`class`, `sr-only`);
            };
          }
        }

        // Remove flex-direction:row used for calculations
        flexBox.removeAttribute(`style`);

        // Add / remove wrapped class to the flex container
        if (firstItemTop >= lastItemTop) {
          flexBox.classList.remove(boxWrappedClass);
          flexBox.classList.add(boxFlexedClass);
          newRule.remove();
        } else {
          flexBox.classList.add(boxWrappedClass);
          flexBox.classList.remove(boxFlexedClass);
          sidenotes.prepend(newRule);
        }
      });
    };


    // Each flex box with the class .flex_box:
    const flexBoxes = document.querySelectorAll(flexBoxQuery);
    for (const flexBox of flexBoxes) {

      markFlexboxAndItemsWrapState(flexBox);

      // Listen for dimension changes on the flexbox
      new ResizeObserver(entries =>
        entries.forEach(entry => markFlexboxAndItemsWrapState(entry.target))
      ).observe(flexBox);

    }
  } else {
    // position-anchor not supported; remove empty sidebar.
    sidebar.remove();
  }
}

window.onload = moveFootnote;
