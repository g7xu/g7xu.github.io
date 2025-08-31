---
layout: single
permalink: /Project&Research/
title: "Project & Research"
classes: full_wide
---
I care about application! I believe that a key aspect of learning is understanding how to apply knowledge to real-life 
scenarios. This page is dedicated to showcasing the projects and research I've done with other talented individuals, 
documenting journey of applying what I've learned. It serves as both a demonstration of my work and a space of 
self-reflection.

# Projects
---
<div class="projects-grid">
  {% for project in site.data.projects.featured_projects %}
    <div class="project-item" {% if project.external %}onclick="window.open('{{ project.url }}', '_blank')"{% endif %} style="cursor: pointer;">
      <img src="{{ project.image }}" alt="{{ project.title }}" style="width: 100%; height: auto;">
      <h3>{{ project.title }}</h3>
      <p class="description">{{ project.description }}</p>
      <p class="description"><strong>Tags:</strong> {{ project.tags | join: ", " }}</p>
    </div>
  {% endfor %}
</div>

# Research
---
<div class="research-grid">
  {% for research in site.data.projects.research_projects %}
    <div class="research-item" onclick="window.open('{{ research.study_url }}', '_blank')" style="cursor: pointer;">
      <img src="{{ research.image }}" alt="{{ research.title }}" style="width: 100%; height: auto;">
      <h3>{{ research.title }}</h3>
      <p style="font-size: 0.9em; line-height: 1.2em; margin: 5px 0;">
        <a href="{{ research.paper_url }}" style="text-decoration: none; font-weight: bold;">Paper</a> | 
        <a href="{{ research.study_url }}" style="text-decoration: none; font-weight: bold;">Study Material</a>
      </p>
      <p class="description">{{ research.description }}</p>
      <p class="description"><strong>Tags:</strong> {{ research.tags | join: ", " }}</p>
    </div>
  {% endfor %}
</div>
