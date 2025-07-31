`use strict`;

const browserslist                     = require('browserslist');
const dotenv                           = require('dotenv').config();
const eleventyAutoCacheBuster          = require('eleventy-auto-cache-buster');
const eleventyPluginFilesMinifier      = require('@sherby/eleventy-plugin-files-minifier');
const esbuild                          = require('esbuild');
const { execSync }                     = require('child_process')
const { feedPlugin }                   = require('@11ty/eleventy-plugin-rss');
const format                           = require('date-fns/format');
const { govukEleventyPlugin }          = require('@x-govuk/govuk-eleventy-plugin');
const Image                            = require('@11ty/eleventy-img');
// const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');
const markdownIt                       = require('markdown-it');
const markdownItAnchor                 = require('markdown-it-anchor');
const markdownItAttrs                  = require('markdown-it-attrs');
const { minify }                       = require('terser');
const outdent                          = require('outdent');
const path                             = require('path');
const pluginSEO                        = require('eleventy-plugin-seo');
// Next 2 constants for JS bundling browser targets
const {resolveToEsbuildTarget}         = require('esbuild-plugin-browserslist');
const target                           = resolveToEsbuildTarget(browserslist(
    'production' [
      '>0.2%',
      'Firefox ESR',
      'not dead',
      'not op_mini all'
    ],
      'development' [
      'last 1 chrome version',
      'last 1 firefox version',
      'last 1 safari version'
    ]
  ), {
  printUnknownTargets: false,
});

const siteURL = `https://mercury.photo`

module.exports = async function(eleventyConfig) {

  const {EleventyRenderPlugin} = await import(`@11ty/eleventy`);

  // Global data
  eleventyConfig.addGlobalData(`site`, {
    url: `https://mercury.photo`
  });

  // Pagefind config; runs AFTER build
  eleventyConfig.on(`eleventy.after`, async function ({ dir }) {
    const inputPath = dir.output;
    const outputPath = path.join(dir.output, `pagefind`);

    console.log(`Creating Pagefind index of %s`, inputPath);

    const pagefind = await import(`pagefind`);
    const { index } = await pagefind.createIndex();
    const { page_count } = await index.addDirectory({ path: inputPath });
    await index.writeFiles({ outputPath });

    console.log(
      `Created Pagefind index of %i pages in %s`,
      page_count,
      outputPath
    );
  });

  // Require layout file extensions; see
  // https://www.11ty.dev/docs/layouts/#omitting-the-layouts-file-extension
  eleventyConfig.setLayoutResolution(false);

  // Copy assets to build directory
  eleventyConfig.addPassthroughCopy(`src/assets/files`);
  eleventyConfig.addPassthroughCopy(`src/assets/fonts`);
  eleventyConfig.addPassthroughCopy(`src/assets/images`);
  eleventyConfig.addPassthroughCopy(`src/assets/media`);

  // Transform images
/*   eleventyConfig.addPlugin(eleventyImageTransformPlugin), {
    failOnError: false,
		// output image formats
		formats: [`webp`, `jpeg`],
		// output image widths
		widths: [400, 800, 1200, `auto`],

		// optional, attributes assigned on <img> nodes override these values
		htmlOptions: {
			imgAttributes: {
        alt: ``,
        sizes: `(min-width: 24rem) 90vw, 100vw`,
				loading: `lazy`,
				decoding: `async`,
			}
		},
    pictureAttributes: {},
    outputDir: '_site/assets/images',
    urlPath: '/assets/images',
    transform: (sharp) => {
      sharp.keepExif();
    }
	}; */

  // Image shortcode
  const imageShortcode = async (
    src,
    className = undefined,
    alt,
    caption,
    widths = [400, 800, 1200, `auto`],
    formats = [`webp`, `jpeg`],
    sizes = `(min-width: 24rem) 90vw, 100vw`
  ) => {

    const imageMetadata = await Image(src, {
      widths: [...widths, null],
      formats: [...formats, null],
      outputDir: `_site/assets/images`,
      urlPath: `/assets/images`,
    });

    /** Maps a config of attribute-value pairs to an HTML string
     * representing those same attribute-value pairs.
     */
    const stringifyAttributes = (attributeMap) => {
      return Object.entries(attributeMap)
        .map(([attribute, value]) => {
          if (typeof value === `undefined`) return ``;
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
          sizes
        });

        // Return one <source> per format
        return `<source ${sourceAttributes}>`;
      })
      .join(`\n`);

    const getLargestImage = (format) => {
      const images = imageMetadata[format];
      return images[images.length - 1];
    }

    const largestUnoptimizedImg = getLargestImage(formats[0]);
    const imgAttributes = stringifyAttributes({
      src: largestUnoptimizedImg.url,
      width: largestUnoptimizedImg.width,
      height: largestUnoptimizedImg.height,
      alt,
      loading: `lazy`,
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
      picture = `<figure><picture ${pictureAttributes}>
        ${sourceHtmlString}
        ${imgHtmlString}
      </picture><figcaption>${caption}</figcaption></figure>`;
    };

    return outdent`${picture}`;
  };

  // SEO
  eleventyConfig.addPlugin(pluginSEO, {
    title: `Mercury Photo Bureau`,
    description: `Rangefinder + Mirrorless Digital + Large Format Film Photography + Music, Arts, & News`,
    url: siteURL,
    author: `Chris J. Zähller`,
    twitter: `czahller`,
    options: {
      titleDivider: `|`,
      imageWithBaseUrl: true,
      twitterCardType: `summary_large_image`,
      showPageNumbers: false
    }
  });
  // RSS Feed
	eleventyConfig.addPlugin(feedPlugin, {
    type: `atom`,
		outputPath: `/feed.xml`,
		collection: {
			name: `posts`, // iterate over `collections.posts`
			limit: 0,     // 0 means no limit
		},
    metadata: {
			language: `en-US`,
			title: `Mercury Photo Bureau`,
			subtitle: `Rangefinder + Mirrorless Digital + Large Format Film Photography + Music, Arts, &amp; News`,
			base: siteURL + `/`,
			author: {
				name: `Chris J. Zähller`
				// email: ``, // Optional
			}
		}});

  /**
   * Converts the given date string to ISO8601 format.
   * Example usage: <time datetime="{{ post.date | toISOString | safe}}">
  */
  const toISOString = (dateString) => new Date(dateString).toISOString();
  eleventyConfig.addFilter(`toISOString`, toISOString);
  // Convert length to bytes
  eleventyConfig.addAsyncFilter(`getImgSizeInBytes`, async function (value) {
    const fileImg = await fetch(siteURL + value).then(r => r.blob());

    return fileImg.size;
  });
  // Sort blog entries
  function sortByPubDate(values) {
    let vals = [...values];     // this *seems* to prevent collection mutation...
    return vals.sort((a, b) => Math.sign(a.data.pubdate - b.data.pubdate));
  }
  eleventyConfig.addFilter(`sortByPubDate`, sortByPubDate);
  // Tags index
  eleventyConfig.addFilter(`taglist`, function(collection) {
    const ignoredTags = [`blog`, `all`, `ignore`];
    const tags = [];
    collection.forEach(post => {
        tags.push(...post.data.tags);
    });
    const sorted = [...new Set(tags)]
      .filter((tag) => !ignoredTags.includes(tag))
      .sort((a, b) => a.localeCompare(b));
    return sorted;
  });
  // Needed for paired shortcodes
  eleventyConfig.addPlugin(EleventyRenderPlugin);
  // For inline SVG; see https://medium.com/@brettdewoody/inlining-svgs-in-eleventy-cffb1114e7b
  eleventyConfig.addNunjucksAsyncShortcode(`svgIcon`, async (src) => {
    let metadata = await Image(src, {
      formats: [`svg`],
      dryRun: true,
    })
    return metadata.svg[0].buffer.toString()
  });
  // JS inline minfication
  eleventyConfig.addNunjucksAsyncFilter(`jsmin`, async function (
    code,
    callback
  ) {
    try {
      const minified = await minify(code);
      callback(null, minified.code);
    } catch (err) {
      console.error(`Terser error: `, err);
      // Fail gracefully.
      callback(null, code);
    }
  });
  // Register image shortcode
  eleventyConfig.addNunjucksAsyncShortcode(`image`, imageShortcode);
  // Extended Markdown

  // For Markdown attributes
  const markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true
  };

  const markdownLib = markdownIt(markdownItOptions).use(markdownItAttrs).use(markdownItAnchor)

  eleventyConfig.setLibrary(`md`, markdownLib);

  // Cache busting
  eleventyConfig.addPlugin(eleventyAutoCacheBuster, {
    globstring: `**/*.{css,js,png,jpg,jpeg,gif,webp,svg,mp4,ico}`
  });

  eleventyConfig.addPlugin(govukEleventyPlugin, {
    headingPermalinks: true,
  });

  // HTML minification
  eleventyConfig.addPlugin(eleventyPluginFilesMinifier);

  // JS  & CSS bundling, tree-shaking, & minification
  eleventyConfig.on(`eleventy.before`, async () => {
    await esbuild.build({
      entryPoints: [`src/assets/js/index.js`, `src/assets/css/index.css`],
      bundle: true,
      treeShaking: true,
      outdir: `_site/assets/`,
      sourcemap: true,
      minify: true,
      target // From our constant, set at top of file
    });
  });

  // Watch directories for changes
  eleventyConfig.addWatchTarget(`./src/assets/css/`);

  eleventyConfig.addWatchTarget(`./src/assets/js/`);

  // add `date` filter
  eleventyConfig.addFilter(`date`, function (date, dateFormat) {
    return format(date, dateFormat)
  })

  eleventyConfig.addPassthroughCopy({
    // Copy `/favicon/` to `_site/` (Don't use template string around key)
    'favicon': `/`
  });
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
};
