/**
 * @module mpb-dialog-img
 * @description A custom element for creating image modals
 * See https://www.raymondcamden.com/2023/12/13/an-image-dialog-web-component.
 */

export default class DialogImage extends HTMLElement {
  connectedCallback() {
    // Get elements, should be one of each only.
    const image = this.querySelector(`img`);
    const altAttr = image.getAttribute(`alt`);
    const imageUrl = image.getAttribute(`src`);
    const split = imageUrl.split('.');

    split.pop();

    const imageUrlTrimmed = split.join('.');
    const fig = image.parentNode.parentNode;
    const caption = this.querySelector(`figcaption`);
    const captionText = caption.innerText;

    if (!image) {
      console.warn(`mpb-dialog-img: No image found. Exiting.`);
      return; // Bail early.
    }

    if (!altAttr) {
      alert(`Image is missing alt attribute!`);
    }

    // Create the dialog.
    const modal       = document.createElement(`dialog`);
    const formWrapper = document.createElement(`div`);
    const form        = document.createElement(`form`);

    modal.setAttribute(`class`, `image-modal`);
    modal.setAttribute(`closedby`, `any`);

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
  <picture>
    <stack-l class="modal-wrapper-inner">
      <source type="image/webp"/>
      <source type="image/jpeg"/>
      <img loading="lazy" decoding="async" />
      <figcaption></figcaption>
    </stack-l>
  </picture>
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

    iconClosePath.setAttribute(`fill`, `var(--mpb-color-textPrimary)`);
    iconClosePath.setAttribute(
      `d`,
      `M256 512a256 256 0 1 0 0-512 256 256 0 1 0 0 512zM167 167c9.4-9.4 24.6-9.4 33.9 0l55 55 55-55c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-55 55 55 55c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0l-55-55-55 55c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l55-55-55-55c-9.4-9.4-9.4-24.6 0-33.9z`
    );

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

    const wrapInner = this.getElementsByClassName(`modal-wrapper-inner`)[0];
    const src1 = wrapInner.getElementsByTagName(`source`)[0];
    const src2 = wrapInner.getElementsByTagName(`source`)[1];
    const imgTag = wrapInner.getElementsByTagName(`img`)[0];
    const modalCap = wrapInner.getElementsByTagName(`figcaption`)[0];

    src1.setAttribute(`srcset`, `${imageUrlTrimmed}.webp`);
    src2.setAttribute(`srcset`, `${imageUrlTrimmed}.jpeg`);
    imgTag.setAttribute(`src`, imageUrl);
    imgTag.setAttribute(`alt`, altAttr);
    modalCap.innerText = captionText;

    // Add attribute for accessibility
    image.setAttribute(`tabindex`, `0`);
    image.setAttribute(`aria-haspopup`, `dialog`);

    // Listen for click on image
    image.addEventListener(`click`, (e) => {
      e.preventDefault();
      // Prevent scrolling outside the modal; see
      // https://www.joshwcomeau.com/css/has/#global-detection-6.
      modal.setAttribute(`data-disable-document-scroll`, true);
      // Open the modal.
      modal.showModal();
    });

    // Listen for the enter key click.
    image.addEventListener(
      `keydown`,
      (e) => {
        switch (e.key) {
          case `Enter`:
            e.preventDefault();
            // Prevent scrolling outside the modal.
            modal.setAttribute(`data-disable-document-scroll`, true);
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
