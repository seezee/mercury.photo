---
layout: layout-blog-index.njk
title: Blog
index: true
excerpt: Index of tropical, tiki, and historic rum cocktail recipes, adapted to use the Smuggler's Cove rum taxonomy
eleventyExcludeFromCollections: true
---

<!-- markdownlint-disable MD025 -->
# <icon-l class="bigger icon-before"><span class="with-icon"><svg id="icon-typewriter-duo" class="icon"  viewBox="0 0 512 512"><path fill="var(--mpb-color-accent-reverse)" d="M368 96a16 16 0 0 1-16-16V0H88a23.94 23.94 0 0 0-24 23.88V192h82.75a32 32 0 0 1 22.62 9.37l13.26 13.26a32 32 0 0 0 22.62 9.37h101.5a32 32 0 0 0 22.62-9.37l13.26-13.26a32 32 0 0 1 22.62-9.37H448V96z"></path><path class="fa-primary" fill="var(--mpb-color-accent)" d="M368 96h80v-4.58a17.92 17.92 0 0 0-5.25-12.67l-73.43-73.5A18 18 0 0 0 356.57 0H352v80a16 16 0 0 0 16 16zm112 96H365.25a32 32 0 0 0-22.62 9.37l-13.26 13.26a32 32 0 0 1-22.62 9.37h-101.5a32 32 0 0 1-22.62-9.37l-13.26-13.26a32 32 0 0 0-22.62-9.37H32a32 32 0 0 0-32 32v32a32 32 0 0 0 32 32v160a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V288a32 32 0 0 0 32-32v-32a32 32 0 0 0-32-32zM336 296a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8zm-24 56h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8zm-40-56a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8zm-24 56h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8zm-40-56a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8zm-24 56h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8zm-40-56a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8zm-40 24H88a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8zm32 64h-16a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8v16a8 8 0 0 1-8 8zm232 56a8 8 0 0 1-8 8H152a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h208a8 8 0 0 1 8 8zm32-64a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8zm32-64a8 8 0 0 1-8 8h-16a8 8 0 0 1-8-8v-16a8 8 0 0 1 8-8h16a8 8 0 0 1 8 8z"></path></svg></span> {{ title }}</icon-l>
<!-- markdownlint-enable MD025 -->
<ul class="blog-index" role="list">
{%- for post in collections.blog | reverse -%}
  <li role="listitem">
    <stack-l>
      <h2><a href="{{ post.url }}">{{ post.data.title | safe }}</a></h2>
      <a href="{{ post.url }}">{% first_image post %}</a>
      <small><time datetime="{{ post.date | safe}}">{{ post.date.toUTCString() | safe}}</small>
      <p>{{ post.data.excerpt | safe }}</p>
      <hr />
    </stack-l>
  </li>
{%- endfor -%}
</ul>
