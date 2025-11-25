---
layout: _main.njk
eleventyComputed:
  title: "Posts tagged “{{ tag | safe }}”"
pagination:
  data: collections
  size: 1
  alias: tag
  filter:
    - blog
    - all
    - posts
    - tags
    - "404"
    - ignore
    - navigation
    - home
    - about
    - baby-photography
    - comment-policy
    - contact
    - feed
    - newsletter
    - okie-x-artists-survey
    - okie-x-faq
    - photo-copyright
    - privacy
    - sitemap
    - terms-of-use
    - wedding-photography
    - whats-in-my-bag
permalink: /blog/tags/{{ tag | slugify}}/
override:tags: []
eleventyExcludeFromCollections: true
image: /assets/images/site/mpb-logo.webp
---
<!-- markdownlint-disable MD025 -->
# {{ title }}
<!-- markdownlint-enable MD025 -->

<ol class="taglist" data-pagefind-ignore>
{% set taglist = collections[ tag ] %}
{% for post in taglist | reverse %}
  <li>
    <stack-l>
      <h2><a href="{{ post.url }}">{{ post.data.title | safe }}</a></h2>
      <switcher-l limit="2">
        <a href="{{ post.url }}"><img class="tag-thumbnail" src="{{ post.data.image | safe }}" alt="Read “{{ post.data.title | safe }}”" loading="lazy" /></a>
        <div>
          <small>
            {% if post.data.pubdate %}
              <time datetime="{{ post.data.pubdate | toISOString | safe}}">{{ post.data.pubdate.toUTCString() | safe}}</time>
            {% endif %}
          </small>
          <p>{{ post.data.excerpt | safe }}</p>
        </div>
      </switcher-l>
      <hr />
    </stack-l>
  </li>
{% endfor %}
</ol>
