---
layout: single
permalink: /
author_profile: true # Show your bio
classes: wide
comments: true
---
<!-- Add JavaScript function for toggling visibility -->
<script>
  document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.querySelector('.toggle-news');
    const newsList = document.getElementById('news-list');

    toggleButton.addEventListener('click', function () {
      if (newsList.style.display === 'none' || newsList.style.display === '') {
        newsList.style.display = 'block'; // Show the list
        toggleButton.textContent = 'Hide'; // Change button text
      } else {
        newsList.style.display = 'none'; // Hide the list
        toggleButton.textContent = 'Recent News 📢'; // Change button text
      }
    });
  });
</script>

<!-- Latest News Section -->
<div class="latest-news-section" 
     style="position: relative; margin: 10px; max-width: 250px; padding: 4px; border: 1px solid #ddd; border-radius: 5px; background: #f9f9f9;">
  <h3 style="margin: 0 0 8px; font-size: 1.2rem; text-align: center;">
    <button class="toggle-news" style="background: none; border: none; cursor: pointer; color: #007acc; font-size: 0.9rem;">Recent News 📢</button>
  </h3>
  <ul id="news-list" style="display: none; list-style-type: none; padding: 8px; margin: 0;">
    <li style="margin-bottom: 8px;">
      <a style="color: black; font-weight: bold; font-size: 0.8rem;">Launching the Website</a>
      <small style="color: #555; font-size: 0.6rem;">Dec 23, 2024</small>
      <p style="margin: 5px 0; color: #333; font-size: 0.6rem;">Launching of my personal website!</p>
    </li>
  </ul>
</div>


# About me 👋
---
Content for the about section...

# Skills Stack 🧑‍💻
---
Content for the skills section...




<!-- comments:
  provider: disqus
  disqus:
    shortname: "your-disqus-shortname" -->
