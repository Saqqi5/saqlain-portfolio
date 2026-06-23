const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = document.querySelector('.theme-icon');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const backToTop = document.querySelector('.back-to-top');
const copyEmailButton = document.querySelector('.copy-email');
const copyStatus = document.querySelector('.copy-status');
const leadForm = document.querySelector('.lead-form');
const formStatus = document.querySelector('.form-status');
const savedTheme = localStorage.getItem('saqlyn-theme');
const preferredTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem('saqlyn-theme', theme);
  themeIcon.textContent = theme === 'dark' ? '☾' : '☀';
}

function closeNavigation() {
  navMenu.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}

setTheme(savedTheme || preferredTheme);

themeToggle.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark');
});

navToggle.addEventListener('click', () => {
  const isOpen = navMenu.classList.toggle('open');
  navToggle.classList.toggle('active', isOpen);
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeNavigation);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeNavigation();
});

document.getElementById('year').textContent = new Date().getFullYear();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 500);
}, { passive: true });

copyEmailButton.addEventListener('click', async () => {
  const email = copyEmailButton.dataset.email;
  copyStatus.classList.remove('error');
  try {
    await navigator.clipboard.writeText(email);
    copyStatus.textContent = 'Email copied: ' + email;
  } catch (error) {
    copyStatus.textContent = 'Copy failed. Please use: ' + email;
    copyStatus.classList.add('error');
  }
});

leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const fields = leadForm.querySelectorAll('input[required], textarea[required], select[required]');
  const submitButton = leadForm.querySelector('.form-submit');
  const formData = new FormData(leadForm);
  let isValid = true;
  formStatus.textContent = '';
  formStatus.classList.remove('error');

  fields.forEach((field) => {
    const valid = field.checkValidity();
    field.classList.toggle('invalid', !valid);
    if (!valid) isValid = false;
  });

  if (!isValid) {
    formStatus.textContent = 'Please complete all required fields with valid information.';
    formStatus.classList.add('error');
    return;
  }

  if (formData.get('_honey')) {
    formStatus.textContent = 'Spam protection blocked this submission.';
    formStatus.classList.add('error');
    return;
  }

  submitButton.disabled = true;
  submitButton.textContent = 'Sending...';
  formStatus.textContent = 'Sending your inquiry securely...';

  try {
    const response = await fetch(leadForm.action, {
      method: 'POST',
      body: formData,
      headers: { Accept: 'application/json' },
    });

    if (!response.ok) throw new Error('Form submission failed');

    leadForm.reset();
    fields.forEach((field) => field.classList.remove('invalid'));
    formStatus.textContent = 'Thank you. Your inquiry has been sent successfully.';
  } catch (error) {
    formStatus.textContent = 'Something went wrong. Please email saqlainmushtaq555@gmail.com directly.';
    formStatus.classList.add('error');
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = 'Send Project Inquiry';
  }
});
