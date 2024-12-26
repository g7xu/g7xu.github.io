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


<!-- For me, data science is the [sexiest](https://hbr.org/2012/10/data-scientist-the-sexiest-job-of-the-21st-century)
job not only because of its applicability in various subject but also due to process process of navigating through complex
data types and find the right answer. -->

# About me 👋
---
Hi, I am Guoxuan(徐国轩), or you can call me Jason. I am currently a third-year undergraduate student studying Data Science 
at University of California San Diego (UCSD). While I am exploring specific domain to focus on for long term, my interest
lie in bioinformatic and machine learning. These fields offer a rich combination challenges, transferable skills, and
impactful applications that resonate deeply with me.

Reflecting on my past career, I've worked as tutor for two different data science courses, tutoring 500+ first year students
using Python libraries like Pandas and NumPy for data manipulation and analysis. I was also privileged to be among the first
cohort of students working in [DSTL Lab](https://dstl.ucsd.edu/), supervised by [Sam Lau](https://lau.ucsd.edu/). In the lab,
I spent part of time contributing to the Pandas Tutor codebase, enhancing its capability to handle large datasets. Additionally,
I conduct a research study to explore effective strategies used by professional data scientists to understand complex data science
notebooks. Most recently, I just finished my first industrial internship at Tong Consulting Inc. Under the mentorship of Tom Dai,
I analyzed an encrpted flight dataset for a client. I propose five most profitable round-trip routes in the U.S. domestric market.

I am currently tutoring DSC 40A under Kyle. I also worked as a research intern at Scripps Research as a part of [the Wu Lab](https://wulab.io/).
In the lab, I'm working on integrating data resouces into the API system for [mygene.info](https://mygene.info/). Additionaly,
I am gaining industry experience as a data science intern at [LLM-strategy](https://www.llmstrategies.com/), under the mentorship of [Serge De Coster](https://www.llmstrategies.com/team/).