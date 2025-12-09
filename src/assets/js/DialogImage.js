/**
 * @module mpb-dialog-img
 * @description A custom element for creating image modals
 * See https://www.raymondcamden.com/2023/12/13/an-image-dialog-web-component.
 */

export default class DialogImage extends HTMLElement {
  constructor() {
    super();
  }

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
    const modal = document.createElement(`dialog`);
    modal.setAttribute(`class`, `image-modal`);
    modal.setAttribute(`closedby`, `any`);
    // `method="dialog"` captures the button click and closes the dialog.
    modal.innerHTML = `
<form method="dialog">
  <stack-l>
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
    <div class="aligncenter">
      <button autofocus class="button button-primary" type="submit">Close</button>
    </div>
  </stack-l>
</form>
    `;

    // Add the dialog outside of the figure tag (which is parent),
    // but immediately after.
    fig.parentNode.insertBefore(modal, fig.nextSibling);

    const closeButton = this.querySelector(`button`);

    const wrapInner = this.getElementsByClassName(`modal-wrapper-inner`)[0];
    const src1      = wrapInner.getElementsByTagName(`source`)[0];
    const src2      = wrapInner.getElementsByTagName(`source`)[1];
    const imgTag    = wrapInner.getElementsByTagName(`img`)[0];
    const modalCap  = wrapInner.getElementsByTagName(`figcaption`)[0];

    src1.setAttribute(`srcset`, `${imageUrlTrimmed}.webp`);
    src2.setAttribute(`srcset`, `${imageUrlTrimmed}.jpg`);
    imgTag.setAttribute(`src`, imageUrl);
    imgTag.setAttribute(`alt`, altAttr);
    modalCap.innerHTML = captionText;

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
      // Close the modal.
      modal.close();
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
    modal.addEventListener(`click`, (e) => {
      // Get the dialog boundaries
      const rect = modal.getBoundingClientRect();
      // Define dialog inner boundary.
      const isInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;

      // If the click is not inside the boundary, close the dialog.
      if (!isInDialog) {
        modal.removeAttribute(`data-disable-document-scroll`);

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
