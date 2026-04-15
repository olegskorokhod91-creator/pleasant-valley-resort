import './style.css';

document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.navbar');
  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');
  const infoModals = document.querySelectorAll('.info-modal');

  const syncBodyScroll = () => {
    const hasOpenOverlay =
      document.querySelector('.modal-overlay.active') ||
      document.querySelector('.info-modal.active');

    document.body.style.overflow = hasOpenOverlay ? 'hidden' : '';
  };

  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
        if (navbar.classList.contains('text-white-on-top')) {
          navbar.style.color = 'var(--color-charcoal)';
        }
      } else {
        navbar.classList.remove('scrolled');
        if (navbar.classList.contains('text-white-on-top')) {
          navbar.style.color = '#fff';
        }
      }
    });
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  const galleryModal = document.createElement('div');
  galleryModal.className = 'modal-overlay';
  galleryModal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" type="button" aria-label="Close image viewer">&times;</button>
      <img src="" alt="Gallery Image" id="modal-img">
    </div>
  `;
  document.body.appendChild(galleryModal);

  const galleryImage = galleryModal.querySelector('#modal-img');
  const galleryCloseButton = galleryModal.querySelector('.modal-close');

  const openGalleryModal = (src, alt = 'Gallery Image') => {
    galleryImage.src = src;
    galleryImage.alt = alt;
    galleryModal.classList.add('active');
    syncBodyScroll();
  };

  const closeGalleryModal = () => {
    galleryModal.classList.remove('active');
    syncBodyScroll();
  };

  const openInfoModal = (targetId) => {
    const targetModal = document.getElementById(targetId);
    if (!targetModal) {
      return;
    }

    targetModal.classList.add('active');
    syncBodyScroll();
  };

  const closeInfoModal = (modalElement) => {
    if (!modalElement) {
      return;
    }

    modalElement.classList.remove('active');
    syncBodyScroll();
  };

  galleryCloseButton.addEventListener('click', closeGalleryModal);

  galleryModal.addEventListener('click', (event) => {
    if (event.target === galleryModal) {
      closeGalleryModal();
    }
  });

  document.querySelectorAll('.open-gallery').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      const src =
        element.getAttribute('data-img-src') ||
        (element.tagName === 'IMG' ? element.src : element.querySelector('img')?.src);
      const alt =
        element.getAttribute('data-img-alt') ||
        (element.tagName === 'IMG' ? element.alt : element.querySelector('img')?.alt) ||
        'Gallery Image';

      if (src) {
        openGalleryModal(src, alt);
      }
    });
  });

  document.querySelectorAll('.open-info-modal').forEach((element) => {
    element.addEventListener('click', (event) => {
      event.preventDefault();
      const targetId = element.getAttribute('data-target');

      if (targetId) {
        openInfoModal(targetId);
      }
    });
  });

  document.querySelectorAll('.info-modal-close').forEach((button) => {
    button.addEventListener('click', (event) => {
      closeInfoModal(event.currentTarget.closest('.info-modal'));
    });
  });

  infoModals.forEach((modalElement) => {
    modalElement.addEventListener('click', (event) => {
      if (event.target === modalElement) {
        closeInfoModal(modalElement);
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') {
      return;
    }

    if (galleryModal.classList.contains('active')) {
      closeGalleryModal();
      return;
    }

    document.querySelectorAll('.info-modal.active').forEach((modalElement) => {
      modalElement.classList.remove('active');
    });
    syncBodyScroll();
  });

  const slideshow = document.getElementById('wedding-slideshow');
  if (slideshow) {
    const slides = slideshow.querySelectorAll('.slide');
    if (slides.length > 0) {
      let currentSlide = 0;

      setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
      }, 6000);
    }
  }
});
