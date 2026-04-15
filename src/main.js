import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  // Navbar scroll effect
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
      if(navbar.classList.contains('text-white-on-top')) {
        navbar.style.color = 'var(--color-charcoal)';
      }
    } else {
      navbar.classList.remove('scrolled');
      if(navbar.classList.contains('text-white-on-top')) {
        navbar.style.color = '#fff';
      }
    }
  });

  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  if (menuToggle) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // Modal Gallery System
  const modal = document.createElement('div');
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close">&times;</button>
      <img src="" alt="Gallery Image" id="modal-img">
    </div>
  `;
  document.body.appendChild(modal);

  const modalImg = modal.querySelector('#modal-img');
  const closeBtn = modal.querySelector('.modal-close');

  const openModal = (src) => {
    modalImg.src = src;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  };

  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  };

  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) closeModal();
  });

  // Attach modal to gallery triggers
  document.querySelectorAll('.open-gallery').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      // Use data attribute if available, else first image inside
      const src = el.getAttribute('data-img-src') || el.querySelector('img').src;
      openModal(src);
    });
  });

  // Hero Slideshow System
  const slideshow = document.getElementById('wedding-slideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length > 0) {
      let currentSlide = 0;
      
      // Rotate seamlessly every 6 seconds
      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 6000); 
    }
  }
});
