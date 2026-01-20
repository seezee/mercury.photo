  const textarea      = document.getElementById(`message`);
  const max           = document.getElementById(`msg-max`);
  const counter       = document.getElementById(`msg-counter`);
  const textMax       = 4096;
  const text          = textarea.value;
  const textLength    = text.length;
  const textRemaining = (textMax - textLength);

  textarea.setAttribute(`maxLength`, textMax);
  max.innerText       = `${textMax}`;
  counter.innerText   = `${textRemaining}`;

  countCharacters();

  textarea.addEventListener(`keyup`, (event) => {
    countCharacters();
  });

  function countCharacters() {
    const text          = textarea.value;
    let textLength      = text.length;
    let textRemaining   = (textMax - textLength);
    counter.innerText   = `${textRemaining}`;
  };
