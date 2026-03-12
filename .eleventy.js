`use strict`;

const browserslist = require('browserslist');
const console = require('console');
const eleventyAutoCacheBuster = require('eleventy-auto-cache-buster');
const esbuild = require('esbuild');
const { feedPlugin } = require('@11ty/eleventy-plugin-rss');
const htmlmin = require('html-minifier-next');
const Image = require('@11ty/eleventy-img');
const { imageSize } = require('image-size');
const { JSDOM } = require('jsdom');
const markdownIt = require('markdown-it');
const mdAnchor = require('markdown-it-anchor');
const mdAttrs = require('markdown-it-attrs');
const mdDL = require('markdown-it-deflist');
const mdFN = require('markdown-it-footnote');
const { minify } = require('terser');
const outdent = require('outdent');
const path = require('path');
const pluginSEO = require('eleventy-plugin-seo')
const { promisify } = require('util');
const { readFile } = require('fs');
const { resolveToEsbuildTarget } = require('esbuild-plugin-browserslist');

const is_production =
  typeof process.env.ELEVENTY_ENV === 'string' &&
  process.env.ELEVENTY_ENV === 'production';

// For Markdown attributes
const mdOpts = {
  html: true,
  breaks: true,
  linkify: true
};

const mdAnchorOpts = {
  permalink: mdAnchor.permalink.headerLink({ safariReaderFix: true }),
  level: 2,
};

// Markdown library with options
const markdownLib = (mdLib) =>
  mdLib.use(mdAttrs).use(mdAnchor, mdAnchorOpts).use(mdDL).use(mdFN);

module.exports = async (eleventyConfig) => {

  /**
   * Miscellaneous
   */

  const { EleventyRenderPlugin } = await import(`@11ty/eleventy`);

  // Require layout file extensions; see
  // https://www.11ty.dev/docs/layouts/#omitting-the-layouts-file-extension
  eleventyConfig.setLayoutResolution(false);

  // Needed for paired shortcodes
  eleventyConfig.addPlugin(EleventyRenderPlugin);

  /**
   * End miscellaneous
   */

  /**
   * Global data
   */

  const siteURL = `https://mercury.photo`;
  const siteAuthor = `Chris J. Zähller`;
  const siteName = `Mercury Photo Bureau`;
  const siteDesc = `Rangefinder + Mirrorless Digital + Large Format Film Photography + Music, Arts, & News`;

  const arr = [
    `_SITEURL_: siteURL`,
    `_AUTHOR_: siteAuthor`,
    `_SITENAME_: siteName`,
    `_SITEDESC_: siteDesc`,
  ];

  arr.forEach((globalKey, globalVal) =>
    eleventyConfig.addGlobalData(globalKey, globalVal),
  );

  arr.forEach((globalKey, globalVal) =>
    eleventyConfig.addNunjucksGlobal(globalKey, globalVal),
  );

  /**
   * END global data
   */

  /**
   * Browserslist
   */

  let browerslistArr;

  if (is_production) {
    browerslistArr = `
      '> 0.2%',
      'Firefox ESR',
      'not dead',
      'not op_mini all'`;
  } else {
    browerslistArr = `
      'last 1 chrome version',
      'last 1 edge version',
      'last 1 firefox version',
      'last 1 safari version'`;
  }

  const target = resolveToEsbuildTarget(
    browserslist('browserlist'[browerslistArr]),
    {
      printUnknownTargets: false,
    },
  );

  /**
   * END browserslist
   */

  /**
   * MarkdownIt configuration
   */

  // Enable the markdown-it plugin with options from above
  eleventyConfig.setLibrary(`md`, markdownIt(mdOpts));
  // Extend markdown-it via plugins; see https://www.11ty.dev/docs/languages/markdown/#optional-set-your-own-library-instance
  // Most tutorials are written for Eleventy 1.0.0 and use the wrong syntax for v2.0.0 and later
  eleventyConfig.amendLibrary(`md`, markdownLib);

  /**
   * END MarkdownIt configuration
   */

  /**
   * SEO & RSS
   */

  // SEO
  eleventyConfig.addPlugin(pluginSEO, {
    title: siteName,
    description: siteDesc,
    url: siteURL,
    author: siteAuthor,
    twitter: `czahller`,
    options: {
      titleDivider: `|`,
      image: `/assets/images/site/mpb-logo.webp`,
      imageWithBaseUrl: true,
      twitterCardType: `summary_large_image`,
      showPageNumbers: false,
    },
  });

  // RSS Feed
  eleventyConfig.addPlugin(feedPlugin, {
    type: `rss`,
    outputPath: `/feed.xml`,
    collection: {
      name: `blog`, // iterate over `collections.blog`
      limit: 0, // 0 means no limit
    },
    metadata: {
      language: `en-US`,
      title: siteName,
      subtitle: siteDesc,
      base: siteURL + `/`,
      author: {
        name: siteAuthor,
        // email: ``, // Optional
      },
    },
  });

  /**
   * END SEO & RSS
   */

  /**
   * Minification & bundling
   */

  // JS  & CSS bundling, tree-shaking, & minification

  eleventyConfig.on(`eleventy.before`, async () => {
    if (is_production) {
      await esbuild.build({
        entryPoints: [`src/assets/css/index.css`, `src/assets/js/index.js` ],
        loader: {
          // Don't use backticks for keys.
          '.svg' : `file`
        },
        bundle: true,
        treeShaking: true,
        assetNames: `[dir]/[name]-[hash]`,
        outdir: `_site/assets/`,
        sourcemap: true,
        minify: true,
        target, // From our constant, set at top of file.
      });
    } else {
      await esbuild.build({
        entryPoints: [`src/assets/css/index.css`, `src/assets/js/index.js` ],
        loader: {
          '.svg' : `file`
        },
        bundle: true,
        treeShaking: true,
        assetNames: `[dir]/[name]-[hash]`,
        outdir: `_site/assets/`,
        target,
      });
    }
  });

  // JS inline minification
  eleventyConfig.addNunjucksAsyncFilter(`jsmin`, async (code, callback) => {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error(`Terser error: `, err);
      // Fail gracefully.
      callback(null, code);
    }
  });

  // HTML minification
  eleventyConfig.addTransform(`htmlmin`, async function(content) {
    if (this.page.outputPath && this.page.outputPath.endsWith(`.html`)) {
      let minified = await htmlmin.minify(content, {
        // Options: https://github.com/j9t/html-minifier-next?tab=readme-ov-file#options-quick-reference
        collapseBooleanAttributes: true,
        collapseWhitespace: true,
        caseSensitive: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        minifySVG: true,
        preventAttributesEscaping: true,
        removeComments: true,
        removeEmptyElements: true,
        removeEmptyElementsExcept: [
          '<div class="search" id="search"></div>',
          '<button id="theme-toggle"></button>',
          '<div id="space-occupier"></div>',
          '<div class="pagination-spacer"></div>',
          '<div class="cf-turnstile" data-sitekey="0x4AAAAAACNtFDIpDzvzMXIR" data-callback="enableSubmit"></div>'//,
          // '<snow-fall></snow-fall>'
        ],
        removeOptionalTags: true,
        removeRedundantAttributes: true,
        sortAttributes: true,
        sortClassNames: true
      });
      return minified;
    }
    return content;
  });

  // Cache busting
  if (is_production) {
    eleventyConfig.addPlugin(eleventyAutoCacheBuster, {
      globstring: `**/*.{css,js,png,jpg,jpeg,gif,webp,svg,mp4,m4a,mp3,ogg,ico}`,
    });
  }

  // Image shortcode

  const imageShortcode = async function (
    src,
    className = undefined,
    alt,
    caption,
    loading,
    fetchpriority,
    // Widths and sizes calculated by RespImageLint
    // See https://ausi.github.io/respimagelint/
    sizes,
    widths = [`auto`, 128, 256, 512, 1024],
    formats = [`webp`, `jpeg`]
  ) {
    // Disallow empty alt attribute
    try {
      if ((alt === ``) || (!alt)) throw `alt attribute for ${src} on ${this.page.fileSlug} is empty`;

      // Featured image attribute
      if (src === `featured`) {
        if (!this.ctx.image) {
          throw `Featured image not set for ${this.page.fileSlug}!`;
        } else {
          src = `./src${this.ctx.image}`;
          fetchpriority = `high`;
        }
      };

      if (loading === `eager`) {
        sizes = `(min-width: 1280px) 886px, (min-width: 420px) calc(82.14vw - 149px), calc(99vw - 17px)`
      } else if (loading === `large`) {
        sizes = `auto, ( min-width: 1280px) 886px, (min-width: 420px) calc(82.14vw - 149px), calc(99vw - 17px)`
      } else {
        sizes = `auto, (min-width: 1300px) 265px, (min-width: 1040px) 20.42vw, (min-width: 660px) calc(42.22vw - 95px), (min-width: 440px) calc(86vw - 165px), (min-width: 360px) calc(66.67vw - 85px), calc(100vw - 20px)`
      };

    } catch(err) {
      console.log(err);
    };

    const imageMetadata = await Image(src, {
      widths: [...widths, null],
      formats: [...formats, null],
			outputDir: path.dirname(this.page.outputPath),
			urlPath: this.page.url,
      transform: (sharp) => {
        sharp.keepExif();
      }
    });

    /** Maps a config of attribute-value pairs to an HTML string
     * representing those same attribute-value pairs.
     */
    const stringifyAttributes = (attributeMap) => {
      return Object.entries(attributeMap)
        .map(([attribute, value]) => {
          if ((typeof value === `undefined`) || (value === ``)) return ``;
          return `${attribute}="${value}"`;
        })
        .join(` `);
    };

    const sourceHtmlString = Object.values(imageMetadata)
      // Map each format to the source HTML markup
      .map((images) => {
        // The first entry is representative of all the others
        // since they each have the same shape
        const { sourceType } = images[0];

        // Use our util from earlier to make our lives easier
        const sourceAttributes = stringifyAttributes({
          type: sourceType,
          // srcset needs to be a comma-separated attribute
          srcset: images.map((image) => image.srcset).join(`, `),
          sizes,
        });

        // Return one <source> per format
        return `<source ${sourceAttributes}>`;
      })
      .join(`\n`);

    const getLargestImage = (format) => {
      const images = imageMetadata[format];
      return images[images.length - 1];
    };

    const largestUnoptimizedImg = getLargestImage(formats[0]);
    if (loading === `eager`) {
      loading;
    } else {
      loading = `lazy`;
    };

    const imgAttributes = stringifyAttributes({
      src: largestUnoptimizedImg.url,
      width: largestUnoptimizedImg.width,
      height: largestUnoptimizedImg.height,
      alt,
      loading,
      fetchpriority,
      decoding: `async`,
    });

    const imgHtmlString = `<img ${imgAttributes}>`;

    const pictureAttributes = stringifyAttributes({
      class: className,
    });
    let picture;
    if (caption === undefined) {
      picture = `<picture ${pictureAttributes}>
        ${sourceHtmlString}
        ${imgHtmlString}
      </picture>`;
    } else {
      picture = `<figure>
        <picture ${pictureAttributes}>
          ${sourceHtmlString}
          ${imgHtmlString}
        </picture>
        <figcaption>${caption}</figcaption>
      </figure>`;
    }

    // "outdent" prevents Markdown from interpreting indented strings as
    // Markdown
    return outdent`${picture}`;
  };

  // Register image shortcode
  eleventyConfig.addNunjucksAsyncShortcode(`image`, imageShortcode);

  // For inline SVG; see https://medium.com/@brettdewoody/inlining-svgs-in-eleventy-cffb1114e7b
  eleventyConfig.addNunjucksAsyncShortcode(`svgIcon`, async (src) => {
    const metadata = await Image(src, {
      formats: [`svg`],
      dryRun: true,
    });
    return metadata.svg[0].buffer.toString();
  });

  /**
   * Eleventy transform to add width and height to <img> tags
   * See https://www.cantoni.org/2025/08/18/
   * solving-my-image-dimension-problem-with-an-eleventy-transform/
   *
   * Must run *after* bundling & minification or it will mess up inline SVGs
   */
  if (is_production) {
    eleventyConfig.addTransform(
      `img-dimensions`,
      async (content, outputPath) => {
        if (!outputPath || !outputPath.endsWith(`.html`)) return content;

        const dom = new JSDOM(content);
        const imgs = dom.window.document.querySelectorAll(
          `img[src]:not([width]):not([height])`,
        );

        // If no images, return the original content
        if (imgs.length === 0) return content;

        for (const img of imgs) {
          try {
            let src = img.getAttribute(`src`);
            if ((src.startsWith(`http`)) || (img.namespaceURI === `http://www.w3.org/2000/svg`)) continue; // Skip remote images & SVGs

            // Remove leading slash if present
            let imgPath = src.replace(/^\//, ``);
            let filePath = `./_site/${imgPath}`;
            let buffer = await promisify(readFile)(filePath);
            let dimensions = imageSize(buffer);

            if (dimensions.width && dimensions.height) {
              img.setAttribute(`width`, dimensions.width);
              img.setAttribute(`height`, dimensions.height);
            }
          } catch (e) {
            console.log(
              `Error processing image ${img.getAttribute(`src`)}: ${e.message}`,
            );
          }
        }

        return dom.serialize();
      },
    );
  };

  const thumbnailShortcode = async (src, options = {}) => {
    let {
      outputDir,
      className = ``,
      alt = ``,
      sizes,
      widths = [`auto`, 128, 256, 512, 1024],
      srcDir = `./src`,
      loading,
      fetchpriority
    } = options;

    // `auto` attribute can only be used with loading="lazy".
    if (loading === `eager`) {
      sizes = `(min-width: 1880px) 320px, (min-width: 1360px) calc(3.8vw + 249px), (min-width: 1020px) calc(32.19vw - 24px), (min-width: 680px) calc(48.75vw - 25px), calc(100.28vw - 41px)`
    } else {
      sizes = `auto, (min-width: 1880px) 320px, (min-width: 1360px) calc(3.8vw + 249px), (min-width: 1020px) calc(32.19vw - 24px), (min-width: 680px) calc(48.75vw - 25px), calc(100.28vw - 41px)`
    };

    const sourceImagePath = `${srcDir}${src}`;

    const metadata = await Image(sourceImagePath, {
      widths: widths,
      formats: [`webp`, `jpeg`],
      outputDir: `_site/${outputDir}`,
      urlPath: outputDir,
      dryRun: true // Don't process images twice.
    })

    // Get the last (largest) JPEG.
    const data = metadata.jpeg[metadata.jpeg.length - 1];

    /** Maps a config of attribute-value pairs to an HTML string
     * representing those same attribute-value pairs.
     */
    const stringifyAttributes = (attributeMap) => {
      return Object.entries(attributeMap)
        .map(([attribute, value]) => {
          if ((typeof value === `undefined`) || (value === ``)) return ``;
          return `${attribute}="${value}"`;
        })
        .join(` `);
    };

		const sourceHtmlString = Object.values(metadata)
		// Map each format to the source HTML markup
		.map((images) => {
			// The first entry is representative of all the others
			// since they each have the same shape
			const { sourceType } = images[0];

			// Use our util from earlier to make our lives easier
			const sourceAttributes = stringifyAttributes({
				type: sourceType,
				// srcset needs to be a comma-separated attribute
				srcset: images.map((image) => image.srcset).join(`, `),
				sizes,
			});

			// Return one <source> per format
			return `<source ${sourceAttributes}>`;
		})
		.join(`\n`);

    const picture = `<picture>
  ${sourceHtmlString}
  <img src="${data.url}" class="${className}" width="${data.width}" height="${data.height}" alt="Read “${alt}”" loading="${loading}" fetchpriority="${fetchpriority}" decoding="async">
</picture>`

	  return picture;
	};

  // Register getThumbnail image shortcode
  eleventyConfig.addNunjucksAsyncShortcode(`getThumbnail`, thumbnailShortcode);

  /**
   * END image manipulation
   */

  /**
   * Search
   */

  // Pagefind config; runs AFTER build
  eleventyConfig.on(`eleventy.after`, async ({ dir }) => {
    const inputPath = dir.output;
    const outputPath = path.join(dir.output, `pagefind`);
    console.time(`pageFindBuild`);
    console.info(`Creating Pagefind index of %s`, inputPath);

    const pagefind = await import(`pagefind`);
    const { index } = await pagefind.createIndex();
    const { page_count } = await index.addDirectory({ path: inputPath });
    await index.writeFiles({ outputPath });
    console.timeEnd(`pageFindBuild`);
    console.info(
      `Created Pagefind index of %i pages in %s`,
      page_count,
      outputPath,
    );
  });

  /**
   * END search
   */

  /**
   * Filters
   */

  // Convert date to U.K. format, e.g., Thursday, 18 February 2021
  eleventyConfig.addFilter(`dateUK`, (dateObj) => {
    return dateObj.toLocaleString(`en-GB`, {
      timezone: `US/Central`,
      dateStyle: `full`,
    });
  });

  // Convert date to U.K. format with time,
  // e.g., Thursday, 18 February 2021 at 22:32:11 CDT
  eleventyConfig.addFilter(`dateTimeUK`, (dateObj) => {
    return dateObj.toLocaleString(`en-GB`, {
      timezone: `US/Central`,
      dateStyle: `full`,
      timeStyle: `long`,
    });
  });

  // Converts the given date string to ISO8601 format.
  // Example usage: <time datetime="{{ post.date | toISOString | safe}}">
  const toISOString = (dateString) => new Date(dateString).toISOString();
  eleventyConfig.addFilter(`toISOString`, toISOString);

  // Convert length to bytes
  eleventyConfig.addAsyncFilter(`getImgSizeInBytes`, async (value) => {
    const fileImg = await fetch(siteURL + value).then((r) => r.blob());

    return fileImg.size;
  });

  // Sort blog entries
  function sortByPubDate(values) {
    const vals = [...values]; // this *seems* to prevent collection mutation...
    return vals.sort((a, b) => Math.sign(a.data.pubdate - b.data.pubdate));
  }

  eleventyConfig.addFilter(`sortByPubDate`, sortByPubDate);

  // Tags index
  eleventyConfig.addFilter(`taglist`, (collection) => {
    const ignoredTags = [`blog`, `all`, `ignore`];
    const tags = [];
    collection.forEach((post) => {
      tags.push(...post.data.tags);
    });
    const sorted = [...new Set(tags)]
      .filter((tag) => !ignoredTags.includes(tag))
      .sort((a, b) => a.localeCompare(b));
    return sorted;
  });

  eleventyConfig.addFilter(`limit`, (arr, limit) => arr.slice(0, limit));

  eleventyConfig.addFilter(`startFrom`, (arr, start) => arr.slice(start));

  /**
   * END Filters
   */

  /**
   * File watch & copy
   */

  // Copy assets to build directory
  [
    // Snowfall. Comment next line out after the winter holidays.
    //`src/assets/css/snow-fall.css`,
    // `src/assets/css/themeSwitcher.css`,
    `src/assets/files/`,
    `src/assets/fonts/`,
    `src/assets/images/icons`,
    `src/assets/images/okie-x`,
    `src/assets/images/site/slideshow`,
    `src/assets/images/site/mpb-logo.png`,
    `src/assets/images/site/mpb-logo.webp`,
  ].forEach((path) => eleventyConfig.addPassthroughCopy(path));

  eleventyConfig.addPassthroughCopy({
    // Copy files from site root to `_site/` (Don't use backticks around key)
    'src/assets/images/site/favicon/*': `/`,
    _redirects: `/`,
    'dislike404-verification.txt': `/`,
    '_headers': `/`,
    // Snowfall. Comment next 2 lines out after the winter holidays.
    //'node_modules/@11ty/is-land/is-land.js': `assets/js/is-land.js`,
    //'node_modules/@zachleat/snow-fall/snow-fall.js': `assets/js/snow-fall.js`,
  });

  // Watch directories for changes
  eleventyConfig.addWatchTarget(`./src/assets/css/`);

  eleventyConfig.addWatchTarget(`./src/assets/js/`);
  // Set custom directory for input; otherwise use defaults
  return {
    // Site URL
    url: siteURL,
    // When a passthrough file is modified, rebuild the pages:
    passthroughFileCopy: true,
    // Copy any file in these formats:
    templateFormats: [`html`, `njk`, `md`, `js`, `woff2`],
    markdownTemplateEngine: `njk`,
    htmlTemplateEngine: `njk`,
    dataTemplateEngine: `njk`,
    // Set up directory structure:
    dir: {
      input: `src`,
    },
  };

  /**
   * END file watch & copy
   */
};
