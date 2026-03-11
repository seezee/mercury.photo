/**
 * @module mpb-dialog-img
 * @description A custom element for creating image modals
 * See https://www.raymondcamden.com/2023/12/13/an-image-dialog-web-component.
 */

export default class DialogImage extends HTMLElement {
  connectedCallback() {

    function generateUniqueId(length) {
        let result = ``;
        const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-_';

        // Loop to generate characters for the specified length
        for (let i = 0; i < length; i++) {
            const randomInd = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomInd);
        }
        return result;
    }

    // Get elements, should be one of each only.
    const image = this.querySelector(`img`);
    const altAttr = image.getAttribute(`alt`);

    const fig = image.parentNode.parentNode;
    const caption = this.querySelector(`figcaption`);
    let   captionText = ``;

    if (caption) {
      captionText = caption.innerText;
    };

    if (!image) {
      console.warn(`mpb-dialog-img: No image found. Exiting.`);
      return; // Bail early.
    }

    if (!altAttr) {
      alert(`Image is missing alt attribute!`);
    }

    // Create the dialog.
    const modal       = document.createElement(`dialog`);
    const uniqueID    = generateUniqueId(24);
    const formWrapper = document.createElement(`div`);
    const form        = document.createElement(`form`);

    modal.setAttribute(`class`, `image-modal`);
    modal.setAttribute(`closedby`, `any`);
    modal.setAttribute(`id`, `img-modal-${uniqueID}`)


    formWrapper.classList.add(`modal-wrapper`);
    formWrapper.setAttribute(`tabindex`, `0`);
    formWrapper.setAttribute(`role`, `region`);
    formWrapper.setAttribute(`aria-label`, captionText);

    // `method="dialog"` captures the button click and closes the dialog.
    form.setAttribute(`method`, `dialog`);

    modal.append(formWrapper);
    formWrapper.append(form);
    form.innerHTML = `
<figure>
  <figcaption></figcaption>
</figure>
    `;

    const closeButton   = document.createElement(`button`);
    const closeText     = document.createElement(`span`);
    const iconClose     = document.createElementNS(
      `http://www.w3.org/2000/svg`,
      `svg`,
    );
    const iconClosePath = document.createElementNS(
      `http://www.w3.org/2000/svg`,
      `path`,
    );

    iconClose.setAttributeNS(
      `http://www.w3.org/2000/xmlns/`,
      `xmlns`,
      `http://www.w3.org/2000/svg`,
    );
    iconClose.setAttribute(`viewBox`, `0 0 512 512`);
    iconClose.append(iconClosePath);

    iconClosePath.setAttribute(`fill`, `var(--mpb-color-text-primary)`);
    iconClosePath.setAttribute(
      `d`,
      `M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c9.4-9.4 24.6-9.4 33.9 0l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9z`
    );

    closeButton.setAttribute(`command`, `close`);
    closeButton.setAttribute(`commandfor`, `img-modal-${uniqueID}`);

    form.prepend(closeButton);

    closeButton.append(closeText);
    closeButton.append(iconClose);
    closeButton.classList.add(`modal-close`);
    closeButton.setAttribute(`autofocus`, ``);
    closeButton.setAttribute(`type`, `submit`);
    closeText.setAttribute(`class`, `sr-only`);
    closeText.append(`Close`);

    // Add the dialog outside of the figure tag (which is parent),
    // but immediately after.
    fig.parentNode.insertBefore(modal, fig.nextSibling);

    // Add attribute for accessibility
    image.setAttribute(`tabindex`, `0`);
    image.setAttribute(`aria-haspopup`, `dialog`);

    // Listen for click on image
    image.addEventListener(`click`, (e) => {
      e.preventDefault();
      // Prevent scrolling outside the modal; see
      // https://www.joshwcomeau.com/css/has/#global-detection-6.
      // This can be removed once overscroll-behavior:contain has full support
      modal.setAttribute(`data-disable-document-scroll`, true);

      const img             = e.target;
      const figure          = img.parentNode.parentNode;
      const figClone        = figure.cloneNode(true);
      const figCloneImg     = figClone.getElementsByTagName(`img`)[0];
      const currentFig      = modal.getElementsByTagName(`figure`)[0];

      figCloneImg.removeAttribute(`tabindex`);
      figCloneImg.removeAttribute(`aria-haspopup`);

      currentFig?.replaceWith(figClone);

      // Open the modal.
      modal.showModal();
    });

    // Listen for the enter key click.
    image.addEventListener(
      `keydown`,
      (e) => {
        const img        = e.target;
        const figure     = img.parentNode.parentNode;
        const figClone   = figure.cloneNode(true);
        const figCloneImg     = figClone.getElementsByTagName(`img`)[0];
        const currentFig = modal.getElementsByTagName(`figure`)[0];

        switch (e.key) {
          case `Enter`:
            e.preventDefault();
            // Prevent scrolling outside the modal.
            modal.setAttribute(`data-disable-document-scroll`, true);

            figCloneImg.removeAttribute(`tabindex`);
            figCloneImg.removeAttribute(`aria-haspopup`);

            currentFig?.replaceWith(figClone);

           // Open the modal.
            modal.showModal();
            break;
          default:
            return;
        }
      },
      true,
    );

    // Listen for button click
    closeButton.addEventListener(`click`, (e) => {
      // Stop preventDefault() on parent elements from propagating to the button.
      e.stopPropagation();
      // Allow scrolling outside the modal.
      modal.removeAttribute(`data-disable-document-scroll`);
      // modal.close() is not necessary; method=dialog takes care of this.
    });

    // Listen for the escape key click.
    window.addEventListener(
      `keydown`,
      (e) => {
        if (e.defaultPrevented) {
          return;
        }

        switch (e.key) {
          case `Escape`:
            // Allow scrolling outside the modal.
            modal.removeAttribute(`data-disable-document-scroll`);
            break;
          default:
            return;
        }
      },
      true,
    );

    // Allow scrolling when ::backdrop is clicked.
    document.addEventListener(`click`, (e) => {

      if (!modal.open) return;

      modal.removeAttribute(`data-disable-document-scroll`);

      if (e.target === document.documentElement) {
        // modal.close() is handled by `closedby` attribute on <dialog>
        // except in Safari.
        if ('closedBy' in HTMLDialogElement.prototype) {
          return;
        } else {
          modal?.close();
        }
      }
    });
  }
}

if (`customElements` in window) {
  customElements.define(`mpb-dialog-img`, DialogImage);
}
