const canvas = document.getElementById('stars-canvas');
const ctx = canvas?.getContext('2d');
let stars = [];

function resizeCanvas() {
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  initStars();
}

function initStars() {
  if (!canvas) return;
  const starCount = Math.min(400, Math.floor(window.innerWidth * window.innerHeight / 5000));
  stars = [];
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      twinkleSpeed: 0.005 + Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function drawStars() {
  if (!ctx || !canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#03050b');
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const now = Date.now() / 1000;
  stars.forEach((star) => {
    const twinkle = 0.5 + 0.5 * Math.sin(now * star.twinkleSpeed * 2 + star.phase);
    const opacity = Math.min(0.9, Math.max(0.2, star.alpha * (0.6 + twinkle * 0.6)));
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255, 240, 200, ${opacity})`;
    ctx.fill();
    if (twinkle > 0.7) {
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius * 1.3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(100, 180, 255, 0.15)';
      ctx.fill();
    }
  });

  requestAnimationFrame(drawStars);
}

function setActiveNavLink() {
  const page = window.location.pathname.split('/').pop();
  document.querySelectorAll('.nav-link').forEach((link) => {
    if (link.getAttribute('href') === page || (page === '' && link.getAttribute('href') === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

function renderProjects() {
  const projectsData = [
    { title: 'SocialSphere', desc: 'Facebook-like social media with real-time posts, likes, comments, and profiles.', tech: ['React', 'Node.js', 'MongoDB', 'Socket.io'], github: '#', demo: '#' },
    { title: 'StreamFlix', desc: 'Movie streaming & upload platform, user rating, admin dashboard.', tech: ['Express', 'MongoDB', 'JWT', 'React'], github: '#', demo: '#' },
    { title: 'SkyFly Booking', desc: 'Flight booking system with filters, seat selection & Stripe payment.', tech: ['React', 'Node.js', 'MongoDB', 'Stripe'], github: '#', demo: '#' },
    { title: 'TechMart', desc: 'Full-stack computer shopping website: cart, authentication, orders.', tech: ['React', 'Express', 'MongoDB', 'CSS'], github: '#', demo: '#' },
    { title: 'DevSecOps Lab', desc: 'Ethical hacking dashboard & vulnerability scanner demo (security project).', tech: ['Python', 'Flask', 'APIs', 'Security'], github: '#', demo: '#' }
  ];

  const container = document.getElementById('projects-container');
  if (!container) return;

  container.innerHTML = '';
  projectsData.forEach((proj) => {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.innerHTML = `
      <div class="project-title">${proj.title}</div>
      <div class="project-desc">${proj.desc}</div>
      <div class="project-tech">${proj.tech.map((tech) => `<span class="tech-tag">${tech}</span>`).join('')}</div>
      <div class="project-links">
        <a href="${proj.github}" target="_blank"><i class="fab fa-github"></i> GitHub</a>
        <a href="${proj.demo}" target="_blank"><i class="fas fa-external-link-alt"></i> Live Demo</a>
      </div>
    `;
    container.appendChild(card);
  });
}

function setupPhotoPostArea() {
  const photoForm = document.getElementById('photoPostForm');
  const fileInput = document.getElementById('photoFile');
  const captionInput = document.getElementById('photoCaption');
  const previewContainer = document.getElementById('photoPreview');
  const previewImg = previewContainer?.querySelector('img');
  const gallery = document.getElementById('photoGallery');

  if (!photoForm || !fileInput || !captionInput || !gallery) return;

  const initialPosts = [
    { src: 'emile.jpg', caption: 'Capturing the coding energy in Kigali.' }
  ];

  let posts = [...initialPosts];

  const renderGallery = () => {
    gallery.innerHTML = '';
    posts.forEach((post) => {
      const card = document.createElement('div');
      card.className = 'photo-card';
      card.innerHTML = `
        <img src="${post.src}" alt="Photo post">
        <div class="photo-caption"><strong>Photo post</strong>${post.caption}</div>
      `;
      gallery.appendChild(card);
    });
  };

  fileInput.addEventListener('change', () => {
    const file = fileInput.files?.[0];
    if (!file || !previewImg || !previewContainer) return;
    const url = URL.createObjectURL(file);
    previewImg.src = url;
    previewContainer.hidden = false;
  });

  photoForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const file = fileInput.files?.[0];
    const caption = captionInput.value.trim();

    if (!file) {
      alert('Please choose an image to post.');
      return;
    }

    const url = URL.createObjectURL(file);
    posts.unshift({ src: url, caption: caption || 'A fresh photo update.' });
    renderGallery();
    photoForm.reset();
    if (previewContainer) previewContainer.hidden = true;
  });

  renderGallery();
}

function attachContactHandler() {
  const contactForm = document.getElementById('contactForm');
  const feedbackSpan = document.getElementById('formFeedback');
  if (!contactForm || !feedbackSpan) return;

  contactForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name')?.value.trim();
    const email = document.getElementById('email')?.value.trim();
    const message = document.getElementById('message')?.value.trim();

    if (!name || !email || !message) {
      feedbackSpan.innerHTML = '<span style="color:#f87171;">Please fill all fields, stargazer.</span>';
      setTimeout(() => { feedbackSpan.innerHTML = ''; }, 2500);
      return;
    }

    feedbackSpan.innerHTML = '<span style="color:#60a5fa;">⏳ Sending message...</span>';

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      const data = await response.json();

      if (response.ok && data.success) {
        feedbackSpan.innerHTML = '<span style="color:#4ade80;">✨ Message launched to Cyuzuzo! He will reply soon.</span>';
        contactForm.reset();
      } else {
        feedbackSpan.innerHTML = `<span style="color:#f87171;">${data.message || 'Error sending message.'}</span>`;
      }
    } catch (error) {
      console.error('Contact error:', error);
      feedbackSpan.innerHTML = '<span style="color:#f87171;">Connection error. Is the server running?</span>';
    }

    setTimeout(() => { feedbackSpan.innerHTML = ''; }, 4000);
  });
}

function setupMobileMenu() {
  const menuToggle = document.getElementById('mobile-menu');
  const navLinksList = document.getElementById('nav-links');
  if (!menuToggle || !navLinksList) return;

  menuToggle.addEventListener('click', () => {
    navLinksList.classList.toggle('active');
    const icon = menuToggle.querySelector('i');
    if (navLinksList.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  document.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      if (navLinksList.classList.contains('active')) {
        navLinksList.classList.remove('active');
        const icon = menuToggle.querySelector('i');
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
      }
    });
  });
}

function animateFadeElements() {
  const elements = document.querySelectorAll('.fade-in-element');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  elements.forEach((el) => observer.observe(el));
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', () => {
  resizeCanvas();
  drawStars();
  setActiveNavLink();
  renderProjects();
  attachContactHandler();
  setupPhotoPostArea();
  setupMobileMenu();
  animateFadeElements();
});