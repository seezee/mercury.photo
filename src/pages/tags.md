---
layout: _main.njk
eleventyComputed:
  title: "Posts tagged “{{ tag | safe }}”"
pagination:
  data: collections
  size: 1
  alias: tag
  filter: ["blog", "all"]
permalink: /blog/tags/{{ tag | slug}}/
override:tags: []
eleventyExcludeFromCollections: true
---
<!-- markdownlint-disable MD025 -->
# {{ title }}
<!-- markdownlint-enable MD025 -->

<ol class="taglist">
{% set taglist = collections[ tag ] %}
{% for post in taglist | reverse %}
  <li>
    <stack-l>
      <h2><a href="{{ post.url }}">{{ post.data.title | safe }}</a></h2>
      <small><time datetime="{{ post.date | safe}}">{{ post.date | safe}}</small>
      <p>{{ post.data.excerpt | safe }}</p>
      <hr />
    </stack-l>
  </li>
{% endfor %}
</ol>
