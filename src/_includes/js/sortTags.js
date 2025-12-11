`use strict`;

const list = document.querySelector(`#tags-inner`);
const collator = new Intl.Collator(`en`);

if (list && list.children) {
[...list.children]
  // Case-insensitive sort; see https://stackoverflow.com/questions/8996963/how-to-perform-case-insensitive-sorting-array-of-string-in-javascript
  .sort(collator.compare)
  .forEach(
    node => list.appendChild(node));
};
