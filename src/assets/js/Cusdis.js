window.CUSDIS = {};
const makeIframeContent = (target) => {
  const host = target.dataset.host || 'https://cusdis.com';
  const iframeJsPath = target.dataset.iframe || `${host}/js/iframe.umd.js`;
  const cssPath = `${host}/js/style.css`;
  return `<!DOCTYPE html>
<html>
  <head>
    <link rel="stylesheet" href="${cssPath}">
    <link rel="stylesheet" href="/assets/css/index.css">
    <base target="_parent" />
    <link>
    <script>
      window.CUSDIS_LOCALE = ${JSON.stringify(window.CUSDIS_LOCALE)}
      window.__DATA__ = ${JSON.stringify(target.dataset)}
    </script>
    <style>

      html {
        /* For browsers that support scrollbar-* properties */
        @supports (scrollbar-color: auto) {
          scrollbar-color: var(--mpb-color-accent-reverse) transparent;
        }
      }

      /* Otherwise, use ::-webkit-scrollbar-* pseudo-elements */
      @supports selector(::-webkit-scrollbar) {
        *::-webkit-scrollbar-thumb {
          background-color: var(--mpb-color-accent-reverse);
        }
      }

      body {
        padding-inline: 1rem;
        padding-block: 0;
      }

      iframe {
        block-size: 100vh;
      }

      :root {
        color-scheme: light;
        color: var(--mpb-color-text-reverse);
        background-color: var(--mpb-color-text-primary);
      }
      :focus-visible {
        outline-color: var(--mpb-color-accent-reverse);
      }
      input, textarea {
        color: var(--mpb-color-text-reverse);
      }
      .grid {
        display: unset!important;
      }
      .bg-gray-200 {
        color: var(--mpb-color-text-primary);
        background-color: var(--mpb-color-text-reverse);
      }
      .text-gray-500 {
        color: var(--mpb-color-text-reverse);
      }
      .text-sm {
        font-size: var(--mpb-font-size--1);
        line-height: 1.1;
      }
      .px-4,
      .p-2 {
        padding-inline: var(--s0);
        padding-block: var(--s-2);
      }
      .px-1 {
        margin-block-end: var(--s1);
        padding: 0;
      }
      .w-full {
        inline-size: fit-content;
      }
      @supports (text-box: trim-both cap alphabetic) {
        .px-4,
        .p-2 {
          padding-block: var(--s0);
          text-box: trim-both cap alphabetic;
        }
      }
      .underline {
        display: none;
      }
      .my-8:empty,
      .mt-4:empty {
        margin: 0;
        padding: 0;
        inline-size: 0;
        block-size: 0;
      }
    </style>
  </head>
  <body>
    <div id="root"></div>
    <script src="${iframeJsPath}" type="module"></script>
  </body>
</html>`;
};
let singleTonIframe;
function createIframe(target) {
  if (!singleTonIframe) {
    singleTonIframe = document.createElement('iframe');
    listenEvent(singleTonIframe, target);
  }
  singleTonIframe.srcdoc = makeIframeContent(target);
  singleTonIframe.style.inlineSize = '100%';
  singleTonIframe.style.border = '0';
  return singleTonIframe;
}
function postMessage(event, data) {
  if (singleTonIframe) {
    singleTonIframe.contentWindow.postMessage(
      JSON.stringify({
        from: 'cusdis',
        event,
        data,
      }),
    );
  }
}
function listenEvent(iframe, target) {
  const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
  const onMessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.from === 'cusdis') {
        switch (msg.event) {
          case 'onload':
            {
              if (target.dataset.theme === 'auto') {
                postMessage(
                  'setTheme',
                  darkModeQuery.matches ? 'dark' : 'light',
                );
              }
            }
            break;
          case 'resize':
            {
              iframe.style.height = msg.data + 'px';
            }
            break;
        }
      }
    } catch (e2) {}
  };
  window.addEventListener('message', onMessage);
  function onChangeColorScheme(e) {
    const isDarkMode = e.matches;
    if (target.dataset.theme === 'auto') {
      postMessage('setTheme', isDarkMode ? 'dark' : 'light');
    }
  }
  darkModeQuery.addEventListener('change', onChangeColorScheme);
  return () => {
    darkModeQuery.removeEventListener('change', onChangeColorScheme);
    window.removeEventListener('message', onMessage);
  };
}
function render(target) {
  if (target) {
    target.innerHTML = '';
    const iframe = createIframe(target);
    target.appendChild(iframe);
  }
}
window.renderCusdis = render;
window.CUSDIS.renderTo = render;
window.CUSDIS.setTheme = (theme) => {
  postMessage('setTheme', theme);
};
function initial() {
  let target;
  if (window.cusdisElementId) {
    target = document.querySelector(`#${window.cusdisElementId}`);
  } else if (document.querySelector('#cusdis_thread')) {
    target = document.querySelector('#cusdis_thread');
  } else if (document.querySelector('#cusdis')) {
    console.warn(
      'id `cusdis` is deprecated. Please use `cusdis_thread` instead',
    );
    target = document.querySelector('#cusdis');
  }
  if (window.CUSDIS_PREVENT_INITIAL_RENDER === true);
  else {
    if (target) {
      render(target);
    }
  }
}
window.CUSDIS.initial = initial;
initial();
