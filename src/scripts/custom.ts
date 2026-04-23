// Typing effect for homepage title
const pageTitle = document.querySelector('h1');
if (
  pageTitle &&
  pageTitle.textContent &&
  pageTitle.textContent.length > 0 &&
  (window.location.pathname === '/' ||
    window.location.pathname === '/index.html')
) {
  if (
    pageTitle.textContent.includes('About me') ||
    pageTitle.textContent.includes('Home')
  ) {
    const originalText = pageTitle.textContent;
    pageTitle.textContent = '';
    pageTitle.style.borderRight = '2px solid var(--accent)';

    let i = 0;
    const typeWriter = () => {
      if (i < originalText.length) {
        pageTitle.textContent += originalText.charAt(i);
        i++;
        setTimeout(typeWriter, 100);
      } else {
        pageTitle.style.borderRight = 'none';
      }
    };

    typeWriter();
  }
}
