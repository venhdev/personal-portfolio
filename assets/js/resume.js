// Function to load resume data from JSON file
async function loadResumeData() {
  try {
    const response = await fetch('./assets/data/resume.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading resume data:', error);
    return null;
  }
}

// Function to render education section
function renderEducation(education) {
  const educationList = document.querySelector('.resume .timeline-list');
  educationList.innerHTML = education.map(item => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${item.school}</h4>
      <span>${item.period}</span>
      <p class="timeline-text">${item.description}</p>
    </li>
  `).join('');
}

// Function to render experience section
function renderExperience(experience) {
  const experienceList = document.querySelectorAll('.resume .timeline-list')[1];
  experienceList.innerHTML = experience.map(item => `
    <li class="timeline-item">
      <h4 class="h4 timeline-item-title">${item.position}</h4>
      <span>${item.period}</span>
      <p class="timeline-text">${item.description}</p>
    </li>
  `).join('');
}

// Function to render skills section
function renderSkills(skills) {
  const skillsList = document.querySelector('.resume .skills-list');
  skillsList.innerHTML = skills.map(item => `
    <li class="skills-item">
      <div class="title-wrapper">
        <h5 class="h5">${item.name}</h5>
        <data value="${item.percentage}">${item.percentage}%</data>
      </div>
      <div class="skill-progress-bg">
        <div class="skill-progress-fill" style="width: ${item.percentage}%;"></div>
      </div>
    </li>
  `).join('');
}

// Function to render resume content based on selected language
function renderResumeContent(resumeData, lang) {
  if (resumeData && resumeData[lang]) {
    renderEducation(resumeData[lang].education);
    renderExperience(resumeData[lang].experience);
    renderSkills(resumeData[lang].skills);
  }
}

// Initialize resume section
async function initResume() {
  const resumeData = await loadResumeData();
  if (resumeData) {
    // Get language buttons
    const langButtons = document.querySelectorAll('.language-btn');
    
    // Initial render with default language (English)
    renderResumeContent(resumeData, 'en');

    // Add click event listeners to language buttons
    langButtons.forEach(button => {
      button.addEventListener('click', () => {
        // Remove active class from all buttons
        langButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        button.classList.add('active');
        // Render resume content in selected language
        renderResumeContent(resumeData, button.dataset.lang);
      });
    });
  }
}

// Load resume data when the page loads
document.addEventListener('DOMContentLoaded', initResume);