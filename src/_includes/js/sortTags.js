`use strict`;

const list = document.querySelector(`#tags-inner`);

[...list.children]
  .sort((a, b) => a.innerText > b.innerText ? 1 : -1)
  .forEach(node => list.appendChild(node));
