`use strict`;

const browserslist                     = require('browserslist');
const eleventyAutoCacheBuster          = require('eleventy-auto-cache-buster');
const eleventyPluginFilesMinifier      = require('@codestitchofficial/eleventy-plugin-minify');
const esbuild                          = require('esbuild');
const { execSync }                     = require('child_process')
const { feedPlugin }                   = require('@11ty/eleventy-plugin-rss');
const { format }                       = require('date-fns/format');
const { govukEleventyPlugin }          = require('@x-govuk/govuk-eleventy-plugin');
const Image                            = require('@11ty/eleventy-img');
const is_production                    = typeof process.env.ELEVENTY_ENV === "string" && process.env.ELEVENTY_ENV === "production";
// const { eleventyImageTransformPlugin } = require('@11ty/eleventy-img');
const markdownIt                          = require('markdown-it');
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

const siteURL    = `https://mercury.photo`;
const siteAuthor = `Chris J. Zähller`;
const siteName   = `Mercury Photo Bureau`;
const siteDesc   = `Rangefinder + Mirrorless Digital + Large Format Film Photography + Music, Arts, & News`;
``

// For Markdown attributes
const markdownItOptions = {
  html: true,
  breaks: true,
  linkify: true
};

// Markdown library with options
const markdownLib = (markdownIt) => markdownIt.use(markdownItAttrs).use(markdownItAnchor);

module.exports = async function(eleventyConfig) {

  const {EleventyRenderPlugin} = await import(`@11ty/eleventy`);

  // Enable the markdown-it plugin with options from above
  eleventyConfig.setLibrary(`md`, markdownItOptions);
  // Extend markdown-it via plugins; see https://www.11ty.dev/docs/languages/markdown/#optional-set-your-own-library-instance
  // Most tutorials are written for Eleventy 1.0.0 and use the wrong syntax for v2.0.0 and later
  eleventyConfig.amendLibrary(`md`, markdownLib);

  // Global data
  eleventyConfig.addGlobalData(`siteURL`, {
    "_SITEURL_" : siteURL
  });
  eleventyConfig.addGlobalData(`siteAuthor`, {
    "_AUTHOR_" : siteAuthor
  });
  eleventyConfig.addGlobalData(`siteName`, {
   "_SITENAME_": siteName
  });
  eleventyConfig.addGlobalData(`siteDesc`, {
   "_SITEDESC_": siteDesc
  });
  eleventyConfig.addNunjucksGlobal(`_SITEURL_`, siteURL);
  eleventyConfig.addNunjucksGlobal(`_AUTHOR_`, siteAuthor);
  eleventyConfig.addNunjucksGlobal(`_SITENAME_`, siteName);
  eleventyConfig.addNunjucksGlobal(`_SITEDESC`, siteDesc);

  // Pagefind config; runs AFTER build
  if ( is_production ) {
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
    })
    console.log(`ENV=DEV; not creating Pagefind index.`);
  };

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

  // Register image shortcode
  eleventyConfig.addNunjucksAsyncShortcode(`image`, imageShortcode);

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
			title: siteName,
			subtitle: siteDesc,
			base: siteURL + `/`,
			author: {
				name: siteAuthor
				// email: ``, // Optional
			}
		}
  });

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

  // JS inline minification
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

  // Cache busting
  eleventyConfig.addPlugin(eleventyAutoCacheBuster, {
    globstring: `**/*.{css,js,png,jpg,jpeg,gif,webp,svg,mp4,ico}`,
    globOptions: {nodir: true, ignore: [`rss.xml`, `feed.xml`, `test.xml`]}
  });

  eleventyConfig.addPlugin(govukEleventyPlugin, {
    markdown: {
      headingPermalinks: true,
    }
  });

  // HTML minification
  if( is_production ) {
    eleventyConfig.addPlugin(eleventyPluginFilesMinifier);
  };

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

  // add `date` filter https://date-fns.org/docs/format
  // Usage: {% for item in collections.all %}<lastmod>{{ item.data.lastmod or item.date | date("yyyy-MM-dd'T'hh:mm:ss XXX")}}</lastmod>{% endfor %}
  eleventyConfig.addFilter(`date`, function (date, dateFormat) {
    return format(date, dateFormat)
  })

  eleventyConfig.addPassthroughCopy({
    // Copy files from site root to `_site/` (Don't use backticks around key)
    'favicon': `/`,
    '_redirects': `/`,
    'dislike404-verification.txt': `/`
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
