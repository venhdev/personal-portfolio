'use strict';

// Language switcher functionality
let currentLanguage = 'en';
let languageData = {};

// Load language data from JSON file
async function loadLanguageData() {
  try {
    const response = await fetch('./assets/data/languages.json');
    languageData = await response.json();
    applyLanguage(currentLanguage);
  } catch (error) {
    console.error('Error loading language data:', error);
  }
}

// Apply selected language to the UI
function applyLanguage(lang) {
  if (!languageData[lang]) return;
  
  const data = languageData[lang];
  
  // Store current active page before updating navbar
  const currentActivePage = document.querySelector('article.active');
  const currentPageId = currentActivePage ? currentActivePage.getAttribute('data-page') : 'about';
  
  // Update navbar items and maintain active state
  document.querySelectorAll('.navbar-link').forEach((link, index) => {
    const navKeys = Object.keys(data.navbar);
    if (index < navKeys.length) {
      const pageId = navKeys[index];
      link.textContent = data.navbar[pageId];
      
      // Remove old event listeners
      const newLink = link.cloneNode(true);
      link.parentNode.replaceChild(newLink, link);
      
      // Add new event listener
      newLink.addEventListener('click', function() {
        // Remove active class from all links and pages
        document.querySelectorAll('.navbar-link').forEach(l => l.classList.remove('active'));
        document.querySelectorAll('article[data-page]').forEach(p => {
          p.classList.remove('active');
          p.style.display = 'none';
        });
        
        // Activate clicked link and corresponding page
        newLink.classList.add('active');
        const targetPage = document.querySelector(`article[data-page="${pageId}"]`);
        if (targetPage) {
          targetPage.classList.add('active');
          targetPage.style.display = 'block';
          window.scrollTo(0, 0);
        }
      });
      
      // Set initial active state
      if (pageId === currentPageId) {
        newLink.classList.add('active');
      }
    }
  });
  
  // Update language buttons active state
  document.querySelectorAll('.language-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Make sure the correct page content is active
  document.querySelectorAll('article[data-page]').forEach(page => {
    const pageId = page.getAttribute('data-page');
    if (pageId === currentPageId) {
      page.classList.add('active');
      page.style.display = 'block';
      // Find and activate corresponding nav link
      document.querySelectorAll('.navbar-link').forEach((link, index) => {
        const navKeys = Object.keys(data.navbar);
        if (index < navKeys.length && navKeys[index] === pageId) {
          link.classList.add('active');
        }
      });
    } else {
      page.classList.remove('active');
      page.style.display = 'none';
    }
  });
  
  // Update sidebar info
  document.querySelector('.info-content .title').textContent = data.sidebar.title;
  document.querySelector('.info_more-btn span').textContent = data.sidebar.showContacts;
  
  // Update contact titles
  const contactTitles = document.querySelectorAll('.contact-title');
  contactTitles.forEach(title => {
    const key = title.textContent.toLowerCase().trim();
    if (key === 'email') title.textContent = data.sidebar.email;
    if (key === 'phone') title.textContent = data.sidebar.phone;
    if (key === 'birthday') title.textContent = data.sidebar.birthday;
    if (key === 'location') title.textContent = data.sidebar.location;
  });
  
  // Update article titles
  document.querySelectorAll('.article-title').forEach(title => {
    const pageId = title.closest('article').getAttribute('data-page');
    if (data[pageId] && data[pageId].title) {
      title.textContent = data[pageId].title;
    }
  });
  
  // Update service section
  const serviceTitle = document.querySelector('.service-title');
  if (serviceTitle && data.about.service) {
    serviceTitle.textContent = data.about.service;
  }
  
  // Update testimonials section
  const testimonialsTitle = document.querySelector('.testimonials-title');
  if (testimonialsTitle && data.about.testimonials) {
    testimonialsTitle.textContent = data.about.testimonials;
  }
  
  // Update clients section
  const clientsTitle = document.querySelector('.clients-title');
  if (clientsTitle && data.about.clients) {
    clientsTitle.textContent = data.about.clients;
  }
  
  // Update portfolio filter buttons
  const filterButtons = document.querySelectorAll('[data-filter-btn]');
  if (filterButtons.length > 0 && data.portfolio) {
    filterButtons[0].textContent = data.portfolio.all;
    if (filterButtons[1]) filterButtons[1].textContent = data.portfolio.webDesign;
    if (filterButtons[2]) filterButtons[2].textContent = data.portfolio.applications;
    if (filterButtons[3]) filterButtons[3].textContent = data.portfolio.webDevelopment;
  }
  
  // Update language buttons active state
  document.querySelectorAll('.language-btn').forEach(btn => {
    if (btn.getAttribute('data-lang') === lang) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  
  // Save current language preference
  localStorage.setItem('preferredLanguage', lang);
  currentLanguage = lang;
}

// Initialize language switcher
function initLanguageSwitcher() {
  // Load saved language preference or default to 'en'
  const savedLanguage = localStorage.getItem('preferredLanguage') || 'en';
  
  // Add click event listeners to language buttons
  document.querySelectorAll('.language-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent default action
      const lang = btn.getAttribute('data-lang');
      applyLanguage(lang);
    });
  });
  
  // Load language data and apply saved preference
  loadLanguageData().then(() => {
    applyLanguage(savedLanguage);
  });
}

// Initialize when DOM is loaded
window.addEventListener('DOMContentLoaded', initLanguageSwitcher);