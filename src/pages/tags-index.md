---
layout: _main.njk
title: Tags
filter: ["blog", "all"]
permalink: /blog/tags/
override:tags: []
eleventyExcludeFromCollections: true
---

<hgroup>
  <stack-l>

<!-- markdownlint-disable MD025 -->
# <icon-l class="bigger icon-before"><span class="with-icon"><svg id="icon-tags-duo" class="icon"  viewBox="0 0 640 512"><path fill="var(--mpb-color-accent)" d="M497.94 225.94L286.06 14.06A48 48 0 0 0 252.12 0H48A48 48 0 0 0 0 48v204.12a48 48 0 0 0 14.06 33.94l211.88 211.88a48 48 0 0 0 67.88 0l204.12-204.12a48 48 0 0 0 0-67.88zM112 160a48 48 0 1 1 48-48 48 48 0 0 1-48 48z"></path><path fill="var(--mpb-color-accent-reverse)" d="M625.94 293.82L421.82 497.94a48 48 0 0 1-67.88 0l-.36-.36 174.06-174.06a90 90 0 0 0 0-127.28L331.4 0h48.72a48 48 0 0 1 33.94 14.06l211.88 211.88a48 48 0 0 1 0 67.88z"></path></svg> {{ title }}</icon-l>
<!-- markdownlint-enable MD025 -->
Find Articles by Tag
  </stack-l>
</hgroup>

{% set sortedTags = collections.blog | taglist %}

<div class="col-3">
  <ul>
    {% for tag in sortedTags %}
      <li><a href="/blog/tags/{{ tag }}">{{ tag }}</a></li>
    {% endfor %}
  </ul>
</div>
