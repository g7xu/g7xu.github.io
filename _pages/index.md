---
layout: single
permalink: /
author_profile: true # Show your bio
classes: wide
comments: true
---

<!-- Enhanced JavaScript for inline dropdown news widget -->
<script>
document.addEventListener('DOMContentLoaded', function() {
  const newsToggle = document.querySelector('.news-toggle');
  const newsDropdown = document.querySelector('.news-dropdown');
  const toggleIcon = document.querySelector('.toggle-icon');
  
  if (newsToggle && newsDropdown) {
    newsToggle.addEventListener('click', function(e) {
      e.preventDefault();
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      
      // Toggle aria attributes
      this.setAttribute('aria-expanded', !isExpanded);
      newsDropdown.setAttribute('aria-hidden', isExpanded);
      
      // Toggle dropdown visibility
      if (isExpanded) {
        newsDropdown.classList.remove('news-dropdown-active');
        toggleIcon.textContent = '▼';
      } else {
        newsDropdown.classList.add('news-dropdown-active');
        toggleIcon.textContent = '▲';
      }
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
      if (!newsToggle.contains(e.target) && !newsDropdown.contains(e.target)) {
        newsDropdown.classList.remove('news-dropdown-active');
        newsToggle.setAttribute('aria-expanded', 'false');
        newsDropdown.setAttribute('aria-hidden', 'true');
        toggleIcon.textContent = '▼';
      }
    });
    
    // Keyboard accessibility
    newsToggle.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
      }
    });
  }
});
</script>

<!-- Inline News Toggle Button and Dropdown -->
<div class="about-section-header">
  <h1>About me 👋</h1>
  <div class="news-toggle-container">
    <button class="news-toggle" aria-expanded="false" aria-controls="news-dropdown">
      <span class="news-icon">📢</span>
      <span class="news-title">Recent News</span>
      <span class="toggle-icon">▼</span>
    </button>
    <!-- Inline News Dropdown -->
    <div class="news-dropdown" id="news-dropdown" aria-hidden="true">
      <div class="news-dropdown-content">
        <div class="news-dropdown-list">
          {% for news_item in site.data.news.recent_news %}
          <article class="news-dropdown-item">
            <div class="news-dropdown-meta">
              <time datetime="{{ news_item.date }}" class="news-dropdown-date">{{ news_item.display_date }}</time>
              <h4 class="news-dropdown-title">{{ news_item.title }}</h4>
            </div>
            <p class="news-dropdown-excerpt">{{ news_item.excerpt }}</p>
          </article>
          {% endfor %}
        </div>
      </div>
    </div>
  </div>
</div>

---
Hi, I am Guoxuan (pronounced as Gwo-shwan), or you can go by Jason. As I am about to graduate from UC San Diego with a B.S. in Data Science, my experience spans academic research, industrial software development, and teaching. I have co-authored a published research paper on data science education at ACM SIGCSE. I designed automated pipelines and an 8-table database for millions of weekly patent and trademark records. I have applied data analysis to large-scale microbiome and airline datasets. I have taught over 500 students in the Data Science courses of my department, receiving perfect evaluations from all participants. 

Currently, I am enhancing the data pipeline I developed, expanding its capabilities to integrate complex, pre-existing datasets like copyright and patent images from legal cases. To bridge my technical skills with market expertise, I am also immersing myself in finance-related coursework, strategically preparing for a career at the intersection of data engineering and financial technology.

Starting in July, I am excited to join Cadre.AI, a San Diego-based AI consulting startup, as an AI Engineer Intern, where I will contribute to AI integrations and strategy development. This experience, combined with my pursuit of a Finance minor, is the next deliberate step toward my ultimate goal of becoming a Quantitative Developer, where I can leverage my passion for complex data systems to solve challenges in the financial markets.

<!-- Hi, I am Guoxuan(徐国轩), or you can call me Jason. I am currently a third-year undergraduate student studying Data Science 
at University of California San Diego (UCSD). While I am exploring specific domain to focus on for long term, my interest
lie in bioinformatic and machine learning. These fields offer a rich combination challenges, transferable skills, and
impactful applications that resonate deeply with me.

Reflecting on my past career, I've worked as tutor for two different data science courses, tutoring 500+ first year students
using Python libraries like Pandas and NumPy for data manipulation and analysis. I was also privileged to be among the first
cohort of students working in [DSTL Lab](https://dstl.ucsd.edu/), supervised by [Samuel Lau](https://lau.ucsd.edu/). In the lab,
I spent part of time contributing to the Pandas Tutor codebase, enhancing its capability to handle large datasets. Additionally,
I conduct a research study to explore effective strategies used by professional data scientists to understand complex data science
notebooks. Most recently, I just finished my first industrial internship at Tong Consulting Inc. Under the mentorship of Tom Dai,
I analyzed an encrpted flight dataset for a client. I propose five most profitable round-trip routes in the U.S. domestric market.

I am currently tutoring DSC 40A taught by [Kyle Shannon](https://www.kmshannon.com/about/). I also worked as a research intern at Scripps Research as a part of [the Wu Lab](https://wulab.io/).
In the lab, I'm working on integrating data resouces into the API system for [mygene.info](https://mygene.info/). Additionaly,
I am gaining industry experience as a data science intern at [LLM-strategy](https://www.llmstrategies.com/), under the mentorship of [Serge De Coster](https://www.linkedin.com/in/serge-de-coster-1370b22/?originalSubdomain=uk). -->