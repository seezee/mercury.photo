---
layout: _tag-index.njk
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

View [all tags](/blog/tags/) &rarr;{.no-drop-cap}

<ol class="taglist" data-pagefind-ignore>
{% set taglist = collections[ tag ] %}
{% for post in taglist | sortByPubDate | reverse | limit(1) %}
  <li>
    <stack-l>
      <h2 class="tag-header"><a href="{{ post.url }}">{{ post.data.title | safe }}</a></h2>
      <switcher-l limit="2">
        <a href="{{ post.url }}">
          {%
            getThumbnail post.data.image, {
              outputDir: post.url,
              alt: post.data.title,
              loading: "eager",
              fetchpriority: "high"
            }
          %}
        </a>
        <div class="tag-post-excerpt">
          <small>
            {% if post.data.pubdate %}
              <time datetime="{{ post.data.pubdate | toISOString | safe}}">{{ post.data.pubdate.toUTCString() | safe}}</time>
            {% endif %}
          </small>
          <p>{{ post.data.excerpt | safe }}</p>
        </div></switcher-l>
      <hr  class="hr-fancy"/>
    </stack-l>
  </li>
{% endfor %}
{% for post in taglist | sortByPubDate | reverse | startFrom(1) %}
  <li>
    <stack-l>
      <h2 class="tag-header"><a href="{{ post.url }}">{{ post.data.title | safe }}</a></h2>
      <switcher-l limit="2">
        <a href="{{ post.url }}">
          {%
            getThumbnail post.data.image, {
              outputDir: post.url,
              alt: post.data.title,
              loading: "lazy",
              fetchpriority: "auto"
            }
          %}
        </a>
        <div class="tag-post-excerpt">
          <small>
            {% if post.data.pubdate %}
              <time datetime="{{ post.data.pubdate | toISOString | safe}}">{{ post.data.pubdate.toUTCString() | safe}}</time>
            {% endif %}
          </small>
          <p>{{ post.data.excerpt | safe }}</p>
        </div></switcher-l>
      <hr  class="hr-fancy"/>
    </stack-l>
  </li>
{% endfor %}</ol>
