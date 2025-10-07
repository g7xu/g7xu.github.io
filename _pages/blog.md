---
layout: blog-home
title: Blog
permalink: /blog/
author_profile: false
---

<div class="blog-header">
  <h1 class="archive__item-title">Blog</h1>
  <div class="blog-search">
    <input type="text" id="blog-search-input" placeholder="Search blog posts...">
  </div>
</div>

<div class="blog-tabs">
  <button class="blog-tab active" data-filter="all">All</button>
  <button class="blog-tab" data-filter="engineering">Engineering</button>
  <button class="blog-tab" data-filter="design">Design</button>
  <button class="blog-tab" data-filter="notes">Notes</button>
</div>

<div class="blog-grid" id="blog-posts-grid">
  {% assign blog_posts = site.blog | sort: "date" | reverse %}
  {% for post in blog_posts %}
    {% include blog-card.html post=post %}
  {% endfor %}
</div>

<div class="blog-load-more">
  <button id="load-more-button">Load More</button>
</div>

<div class="blog-empty-state" style="display: none;">
  <p>No posts found matching your criteria. Try adjusting your filters!</p>
</div>
