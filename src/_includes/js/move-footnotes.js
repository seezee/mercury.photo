function moveFootnote() {
  const sidebar = document.getElementById(`sidenotes`);
  const list = document.getElementsByClassName(`footnotes-list`);
  const list2 = document.getElementsByClassName(`marginnotes-list`);

  // Does the browser support position-anchor?
  // Commented out because we are using a the css-anchor-positioning polyfill
  // if (CSS.supports("position-anchor", "--foobar")) {

  const small = document.createElement(`small`);
  if (list.length || list2.length) {
    sidebar.append(small);
    small.setAttribute(`id`, `footnotes-wrapper`);
  }

  if (list.length) {
    const section = document.getElementsByClassName(`footnotes`)[0];
    const rule = document.getElementsByClassName(`footnotes-sep`)[0];

    small.append(section);
    rule.remove();
  }

  if (list2.length) {
    const footer = document.getElementsByClassName(`marginnotes`)[0];
    const rule = document.getElementsByClassName(`marginnotes-sep`)[0];

    small.append(footer);
    rule.remove();
  }

  const flexBoxQuery = `.flex_box_wrappable`;
  const boxWrappedClass = `flex_box-wrapped`;
  const boxFlexedClass = `flex_box-flexed`;
  const boxSwitchedClass = `flex_box-switched`;
  const itemWrappedClass = `flex_item-wrapped`;

  const newRule = document.createElement(`hr`);
  newRule.classList.add(`hr-fancy`);

  // Rounded for inline-flex sub-pixel discrepancies:
  const getTop = (item) => Math.round(item.getBoundingClientRect().top);

  const markFlexboxAndItemsWrapState = (flexBox) => {
    // Acts as a throttle,
    // Prevents hitting ResizeObserver loop limit,
    // Optimal timing for visual change:
    requestAnimationFrame((_) => {
      const flexItems = flexBox.children;

      // Needs to be in a row for the calculations to work
      flexBox.setAttribute(`style`, `flex-direction: row`);

      const firstItemTop = getTop(flexItems[0]);
      const lastItemTop = getTop(flexItems[flexItems.length - 1]);

      // Add / remove wrapped class to each wrapped item
      for (const flexItem of flexItems) {
        const isItemWrapped = firstItemTop < getTop(flexItem);
        const isSwitchedBoxWrapped =
          flexBox.classList.contains(boxSwitchedClass) &&
          firstItemTop < lastItemTop;
        const links = document.querySelectorAll(`[id^="mnref:"]`);

        if (isItemWrapped || isSwitchedBoxWrapped) {
          flexItem.classList.add(itemWrappedClass);
          if (links.length) {
            for (link of links) link.removeAttribute(`class`);
          }
        } else {
          flexItem.classList.remove(itemWrappedClass);
          if (links.length) {
            for (link of links) link.classList.add(`sr-only`);
          }
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

        if ((list.length) || (list2.length)) {
          sidenotes.prepend(newRule);
        }
      }
    });
  };

  // Each flex box with the class .flex_box:
  const flexBoxes = document.querySelectorAll(flexBoxQuery);
  for (const flexBox of flexBoxes) {
    markFlexboxAndItemsWrapState(flexBox);

    // Listen for dimension changes on the flexbox
    new ResizeObserver((entries) =>
      entries.forEach((entry) => markFlexboxAndItemsWrapState(entry.target)),
    ).observe(flexBox);
  }
  /* } else {
    // position-anchor not supported; remove empty sidebar.
    sidebar.remove();
  } */
}

window.onload = moveFootnote;
