// /src/_includes/breadcrumbs.js

(function (document) {
  `use strict`;

  const home     = document.getElementById(`breadcrumb-home`);
  const path     = document.location.pathname;
  const blog     = path.startsWith(`/blog/`);
  const tag      = path.startsWith(`/blog/tags/`)
  const tagIndex = path.endsWith(`/tags/`);
  const legal    = path.startsWith(`/legal/`);
  let pathArray  = path.split('/');
  let child      = pathArray[2];

  if (path === `/`) {
    return;
  } else if ((blog) && (!tagIndex) && (!tag)) {
    if (child) {
      home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span>`);
    };
    home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span><span role="listitem"><a href="/blog/">blog</a></span>`);
  } else if ((blog) && (!tagIndex) && (tag)) {
    if (child) {
      home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span>{{ tag | safe }}`);
    };
    home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span><span role="listitem"><a href="/blog/">blog</a></span><span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span><span role="listitem"><a href="/blog/tags/">tags</a></span>`);
  } else if ((blog) && (tagIndex)) {
    home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span><span role="listitem"><a href="/blog/">blog</a></span><span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span><span role="listitem"><a href="/blog/tags/">tags</a></span>`);
  } else if (legal) {
    if (child) {
      home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span>`);
    };
    home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span><span role="listitem">legal</span>`);
  } else {
    home.insertAdjacentHTML(`afterend`, `<span class="breadcrumbs-separator" aria-hidden="true"> ❖ </span>`);
  };

})(document);
