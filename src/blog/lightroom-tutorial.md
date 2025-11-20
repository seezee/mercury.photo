---
layout: _main-blog.njk
title: "Adobe Lightroom 4 Tutorial: A Workflow Example"
tags: 
  - blog
  - Lightroom
  - tutorial
  - photography
  - photography, digital
  - photography, black & white
date: Last Modified
pubdate: 2012-09-05T01:14:52+00:00
image: /assets/images/blog/2012-09-04-lr-tut/czahller-20120715-01-55-12-final.jpg
excerpt: Adobe Lightroom is a powerful tool for managing and processing digital photos.
---
<!-- markdownlint-disable MD025 -->
# {{ title }}

<!-- markdownlint-enable MD025 --><mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120715-01-55-12-final.jpg", "img-constrained", "A gaunt, elderly man with long hair, a long beard, and piercing eyes sits in the dark, his face illuminated by a torch.", "Greybeard (Richard)", "eager" %}</mpb-dialog-img>

Adobe Lightroom is a powerful tool for managing and processing digital photos. It can catalogue and organize your photos, automate online publishing, batch process, manage metadata (<abbr title="Exchangeable image file format: A standard specifying the formats for Metadata in digital image and sound files.">EXIF</abbr> and <abbr title="Metadata standard developed by the The International Press Telecommunications Council.">IPTC</abbr>), and watermark your images on export. It can also apply essential basic image adjustments non-destructively: All changes are written to a database, leaving your original image untouched, so you can always revert.

In the **Develop** panel we generally start with the top controls and work our way down, applying adjustments as needed: **Crop** and apply local adjustments, adjust **color balance**, then adjust overall **exposure** and **contrast**. Finally, adjust **highlights**, **shadows**, and **white** and **black** clipping.

Here’s how we got from an image “as shot” to a final image ready for export and publication. Your mileage may vary.

## Crop the Image

We started by cropping the image. We based the crop area on the Rule of Thirds;[^1] this is not a hard-and-fast rule, but it worked nicely for this image. Notice how cropping also removed the distracting elements on the right edge.

[^1]: The rule of thirds is a guideline which applies to composing visual images. According to the rule, an image is imagined as divided into nine equal parts by two equally spaced horizontal lines and two equally spaced vertical lines. The important compositional elements are placed along these lines or at their intersections. The Lightroom crop overlay can show a grid to facilitate cropping to the rule of thirds.

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-45_01-crop.jpg", "img-constrained", "Cropping the image", "Step 1: Crop" %}</mpb-dialog-img>

## Exposure Adjustments

We set white balance in camera with a [WhiBal G7](https://bhpho.to/4q2PxnH){target=_blank rel="external noopener"} pocket grey card, so we did not change this setting in Lightroom. Instead, we moved on to adjusting contrast, shadows, and black clipping for the entire image. After that, we adjusted clarity, which changes local contrast.

* **Contrast** +10
* **Shadows** -10
* **Black Clipping** -30
* **Clarity** +10

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-46_02-contrast.jpg", "img-constrained", "Adjusting contrast", "Step 2: Contrast" %}</mpb-dialog-img>

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-47_03-shadows.jpg", "img-constrained", "Adjusting shadows", "Step 3: Shadows" %}</mpb-dialog-img>

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-48_04-blacks.jpg", "img-constrained", "Adjusting black levels", "Step 4: Blacks" %}</mpb-dialog-img>

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-48_05-clarity.jpg", "img-constrained", "Adjusting clarity", "Step 5: Clarity" %}</mpb-dialog-img>

* Convert to B+W
* **B+W Auto-mix** (after trying various filters for B+W & rejecting them)

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-49_06-monochrome.jpg", "img-constrained", "Converting to black & white", "B+W Conversion" %}</mpb-dialog-img>

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-50_07-mix.jpg", "img-constrained", "Adjusting black & white mix", "Step 7: B+W Mix" %}</mpb-dialog-img>

## Local Adjustments

Next, I employed the **Adjustment Brush** (Size = 6.2; Feather, Flow and Density = 100). In reality, I increased the exposure on the subject’s face before changing the **B+W Mix**, as you can see in the screen capture immediately preceding.

* Increased **Exposure** on subject face +2.25
* On the torch, decreased **Exposure** -1.34

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-51_08-brush-exposure+.jpg", "img-constrained", "Locally increasing exposure: The subject’s face", "Step 8: Adjustment Brush (Increase Exposure)" %}</mpb-dialog-img>

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-52_09-brush-exposure-.jpg", "img-constrained", "Locally decreasing exposure: The torch", "Step 9: Adjustment Brush (Decrease Exposure)" %}</mpb-dialog-img>

## Noise Reduction

The image was shot in low light using a tripod and a long exposure. It’s pretty noisy. Converting to B+W got rid of a lot of the noise, but it could still use some improvement. The trick is to achieve balance between noise reduction and loss of detail.

* Zoomed in to a lighter area so we could see the noise (in the screen cap we show the torch, but we actually looked at the subject’s face when we made the adjustment in order to get the aforementioned balance correct)
* **Luminance** +50
* **Detail** +50 (default)

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-53_10-zoom-noise.jpg", "img-constrained", "Zooming in to inspect noise before applying noise reduction", "Step 10: Zoom in to See Noise" %}</mpb-dialog-img>

<mpb-dialog-img>

{% image "./src/assets/images/blog/2012-09-04-lr-tut/czahller-20120904-18-35-54_11-noise-reduction.jpg", "img-constrained", "Applying noise reduction (luminance only)", "Step 11: Noise Reduction (Luminance)" %}</mpb-dialog-img>

That’s it; other tools we frequently use are the Graduated Filter and the Lens Correction tools; the latter is particularly handy for removing the squirrely chromatic aberration and magenta/green fringes that plague Leica digital cameras under certain conditions.

## Before & After Comparison

<figure>
  <mpb-picslider aspect="3 / 2" color="var(--mpb-color-textReverse)" bg-color="var(--mpb-color-accent)">
    <stack-l>

  ![Cropped image before other adjustments. A small group of people gathered for Band Camp at the Okemah Fairgrounds during the Woody Guthrie Folk Festival. The image is in color, shot in low light, and is very noisy.](/assets/images/blog/2012-09-04-lr-tut/czahller-20120715-01-55-12-crop.jpg)![The same image after adjustments. It has been converted to black & white and has been edited to emphasize a single person’s face: A man named Richard. He is gaunt, elderly man with long hair, a long beard, and piercing eyes sitting in the dark, his face illuminated by a torch.](/assets/images/blog/2012-09-04-lr-tut/czahller-20120715-01-55-12-final.jpg)
    </stack-l>
  </mpb-picslider>
  <figcaption>

    Cropped image before & after adjustments
  </figcaption>
</figure>

## Further Reading

We learned Adobe Lightroom basics from [Focus Photo School](https://www.focusphotoschool.com/){target=_blank rel="external noopener"}, formerly known as Lightroom Lab.
