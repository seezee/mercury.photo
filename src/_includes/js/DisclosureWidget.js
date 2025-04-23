// Based on https://www.makethingsaccessible.com/guides/responsive-and-accessible-tabbed-interfaces/

const widgetWrapper = document.querySelector(`.widget__wrapper`);
let baseHTML = ``,
  open = 0;
const mq = window.matchMedia(`(max-width: 767px)`);
const navKeys = [
  `ArrowUp`,
  `ArrowRight`,
  `ArrowDown`,
  `ArrowLeft`,
  `Home`,
  `End`,
];

if (widgetWrapper) {
  widgetWrapper.querySelectorAll(`details`).forEach((el, idx) => {
    baseHTML += `<h3 class="widget__heading">
      <button class="widget__btn" id="btn-${
        idx + 1
      }" data-btn-idx="${idx}" aria-controls="panel-${idx + 1}">${
      el.firstElementChild.textContent
    }</button></h3>
      <stack-l class="widget__panel" id="panel-${
        idx + 1
      }" data-panel-idx="${idx}" aria-labelledby="btn-${idx + 1}">${
      el.lastElementChild.innerHTML
    }</stack-l>`;
  });
  baseHTML = `<div class="widget__controls-wrapper">${baseHTML}</div>`;

  widgetWrapper.innerHTML = ``;
  widgetWrapper.insertAdjacentHTML(`afterbegin`, baseHTML);
  const widgetControlsWrapper = widgetWrapper.querySelector(
    `.widget__controls-wrapper`
  );
  const widgetBtns = Array.from(widgetWrapper.querySelectorAll(`.widget__btn`));
  const widgetPanels = Array.from(
    widgetWrapper.querySelectorAll(`.widget__panel`)
  );

  const createAccordions = () => {
    widgetControlsWrapper.removeAttribute(`role`);
    widgetBtns.forEach((btn, idx) => {
      idx === open
        ? btn.setAttribute(`aria-expanded`, `true`)
        : btn.setAttribute(`aria-expanded`, `false`);
      idx === open
        ? btn.parentElement.setAttribute(`data-expanded`, `true`)
        : btn.parentElement.setAttribute(`data-expanded`, `false`);
      btn.parentElement.removeAttribute(`role`);
      btn.removeAttribute(`tabindex`);
      btn.removeAttribute(`role`);
      btn.removeAttribute(`aria-setsize`);
      btn.removeAttribute(`aria-posinset`);
      btn.removeAttribute(`aria-selected`);
      btn.parentElement.after(
        widgetWrapper.querySelector(`[aria-labelledby="${btn.id}"]`)
      );
    });

    widgetPanels.forEach(panel => {
      panel.setAttribute(`role`, `region`);
      panel.removeAttribute(`tabindex`);
      panel.removeAttribute(`hidden`);
    });
  };

  const createTabs = () => {
    widgetControlsWrapper.setAttribute(`role`, `tablist`);
    widgetBtns.forEach((btn, idx) => {
      btn.parentElement.setAttribute(`role`, `presentation`);
      btn.setAttribute(`role`, `tab`);
      btn.setAttribute(`aria-setsize`, widgetBtns.length);
      btn.setAttribute(`aria-posinset`, idx + 1);
      idx === open
        ? btn.setAttribute(`aria-selected`, `true`)
        : btn.setAttribute(`aria-selected`, `false`);
      if (idx !== open) btn.setAttribute(`tabindex`, `-1`);
      btn.removeAttribute(`aria-expanded`);
      btn.parentElement.removeAttribute(`data-expanded`);
    });

    widgetPanels.forEach((panel, idx) => {
      panel.setAttribute(`role`, `tabpanel`);
      idx === open
        ? panel.setAttribute(`tabindex`, `0`)
        : panel.setAttribute(`hidden`, ``);
    });
    widgetPanels.reverse().forEach(el => widgetControlsWrapper.after(el));
  };

  function handleClickOnBtns(evt) {
    if (evt.target.classList.contains(`widget__btn`)) {
      if (evt.target.getAttribute(`aria-expanded`) === `false`) {
        evt.target.setAttribute(`aria-expanded`, `true`);
        evt.target.parentElement.setAttribute(`data-expanded`, `true`);
      } else if (evt.target.getAttribute(`aria-expanded`) === `true`) {
        evt.target.setAttribute(`aria-expanded`, `false`);
        evt.target.parentElement.setAttribute(`data-expanded`, `false`);
      }
      if (evt.target.hasAttribute(`role`)) setActiveTab(evt.target);
    }
  }

  setActiveTab = activeTab => {
    widgetBtns.forEach(tab => {
      if (tab === activeTab) {
        tab.setAttribute(`aria-selected`, `true`);
        tab.removeAttribute(`tabindex`);
        widgetWrapper
          .querySelector(`[aria-labelledby="${tab.id}"]`)
          .setAttribute(`tabindex`, `0`);
        widgetWrapper
          .querySelector(`[aria-labelledby="${tab.id}"]`)
          .removeAttribute(`hidden`);
      } else {
        tab.setAttribute(`aria-selected`, `false`);
        tab.setAttribute(`tabindex`, `-1`);
        document
          .getElementById(tab.getAttribute(`aria-controls`))
          .removeAttribute(`tabindex`);
        document
          .getElementById(tab.getAttribute(`aria-controls`))
          .setAttribute(`hidden`, ``);
      }
    });
  };

  function handleKeyboardInteraction(evt) {
    if (
      navKeys.includes(evt.key) &&
      evt.target.classList.contains(`widget__btn`)
    ) {
      evt.preventDefault();
      const currentIdx = Number(evt.target.getAttribute(`data-btn-idx`));
      evt.target.hasAttribute(`role`)
        ? (next = `ArrowRight`)
        : (next = `ArrowDown`);
      evt.target.hasAttribute(`role`) ? (prev = `ArrowLeft`) : (prev = `ArrowUp`);

      if (evt.key === next && currentIdx < widgetBtns.length - 1) {
        evt.target.hasAttribute(`role`)
          ? setActiveTab(widgetBtns[currentIdx + 1])
          : widgetBtns[currentIdx + 1].focus();
        if (evt.target.hasAttribute(`role`)) widgetBtns[currentIdx + 1].focus();
      } else if (evt.key === prev && currentIdx > 0) {
        evt.target.hasAttribute(`role`)
          ? setActiveTab(widgetBtns[currentIdx - 1])
          : widgetBtns[currentIdx - 1].focus();
        if (evt.target.hasAttribute(`role`)) widgetBtns[currentIdx - 1].focus();
      }

      if (evt.key === `Home` && evt.target.hasAttribute(`role`))
        setActiveTab(widgetBtns[0]);
      if (evt.key === `Home`) widgetBtns[0].focus();
      if (evt.key === `End` && evt.target.hasAttribute(`role`))
        setActiveTab(widgetBtns[widgetBtns.length - 1]);
      if (evt.key === `End`) widgetBtns[widgetBtns.length - 1].focus();
    }
  }

  window.addEventListener(`DOMContentLoaded`, evt => {
    mq.matches ? createAccordions() : createTabs();
  });

  mq.addEventListener(`change`, evt => {
    let currentFocus = document.activeElement;

    if (currentFocus.closest(`.widget__wrapper`)) {
      if (currentFocus.classList.contains(`widget__btn`)) {
        open = Number(currentFocus.getAttribute(`data-btn-idx`));
      } else if (currentFocus.classList.contains(`widget__panel`)) {
        open = Number(currentFocus.getAttribute(`data-panel-idx`));
        currentFocus = widgetWrapper.querySelector(`[data-btn-idx="${open}"]`);
      } else if (currentFocus.closest(`.widget__panel`)) {
        open = Number(
          currentFocus.closest(`.widget__panel`).getAttribute(`data-panel-idx`)
        );
      }
    }
    mq.matches ? createAccordions() : createTabs();
    currentFocus.focus();
  });

  widgetWrapper.addEventListener(`click`, handleClickOnBtns);
  widgetWrapper.addEventListener(`keydown`, handleKeyboardInteraction);
}
