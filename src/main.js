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
  const bindGalleryTriggers = (root = document) => {
    root.querySelectorAll('.open-gallery').forEach((element) => {
      if (element.dataset.galleryBound === 'true') {
        return;
      }

      element.dataset.galleryBound = 'true';
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
  };

  const buildCarousels = () => {
    document.querySelectorAll('.info-gallery-grid').forEach((galleryGrid, galleryIndex) => {
      if (galleryGrid.dataset.carouselReady === 'true') {
        return;
      }

      const images = Array.from(galleryGrid.querySelectorAll('img')).map((image, imageIndex) => ({
        src: image.getAttribute('src'),
        alt: image.getAttribute('alt') || `Accommodation image ${imageIndex + 1}`,
      }));

      if (images.length === 0) {
        return;
      }

      galleryGrid.dataset.carouselReady = 'true';
      galleryGrid.innerHTML = `
        <div class="info-carousel" tabindex="0" aria-label="Accommodation photo gallery">
          <button class="info-carousel-arrow prev" type="button" aria-label="Previous image">&#8249;</button>
          <div class="info-carousel-viewport">
            <div class="info-carousel-track">
              ${images
                .map(
                  (image, imageIndex) => `
                    <button
                      class="info-carousel-slide open-gallery"
                      type="button"
                      data-img-src="${image.src}"
                      data-img-alt="${image.alt.replace(/"/g, '&quot;')}"
                      aria-label="Open image ${imageIndex + 1} of ${images.length}"
                    >
                      <img src="${image.src}" alt="${image.alt.replace(/"/g, '&quot;')}">
                    </button>
                  `
                )
                .join('')}
            </div>
          </div>
          <button class="info-carousel-arrow next" type="button" aria-label="Next image">&#8250;</button>
          <div class="info-carousel-dots">
            ${images
              .map(
                (_, imageIndex) => `
                  <button
                    class="info-carousel-dot${imageIndex === 0 ? ' active' : ''}"
                    type="button"
                    aria-label="Go to image ${imageIndex + 1}"
                  ></button>
                `
              )
              .join('')}
          </div>
        </div>
      `;

      const carousel = galleryGrid.querySelector('.info-carousel');
      const track = carousel.querySelector('.info-carousel-track');
      const slides = Array.from(carousel.querySelectorAll('.info-carousel-slide'));
      const dots = Array.from(carousel.querySelectorAll('.info-carousel-dot'));
      const previousButton = carousel.querySelector('.info-carousel-arrow.prev');
      const nextButton = carousel.querySelector('.info-carousel-arrow.next');
      let currentIndex = 0;
      let autoAdvance;

      const goToSlide = (nextIndex) => {
        currentIndex = (nextIndex + slides.length) % slides.length;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle('active', dotIndex === currentIndex);
        });
      };

      const startAutoAdvance = () => {
        clearInterval(autoAdvance);
        autoAdvance = window.setInterval(() => {
          goToSlide(currentIndex + 1);
        }, 4200 + galleryIndex * 120);
      };

      const stopAutoAdvance = () => {
        clearInterval(autoAdvance);
      };

      previousButton.addEventListener('click', () => {
        goToSlide(currentIndex - 1);
        startAutoAdvance();
      });

      nextButton.addEventListener('click', () => {
        goToSlide(currentIndex + 1);
        startAutoAdvance();
      });

      dots.forEach((dot, dotIndex) => {
        dot.addEventListener('click', () => {
          goToSlide(dotIndex);
          startAutoAdvance();
        });
      });

      carousel.addEventListener('mouseenter', stopAutoAdvance);
      carousel.addEventListener('mouseleave', startAutoAdvance);
      carousel.addEventListener('focusin', stopAutoAdvance);
      carousel.addEventListener('focusout', startAutoAdvance);
      carousel.addEventListener('keydown', (event) => {
        if (event.key === 'ArrowLeft') {
          event.preventDefault();
          goToSlide(currentIndex - 1);
          startAutoAdvance();
        }

        if (event.key === 'ArrowRight') {
          event.preventDefault();
          goToSlide(currentIndex + 1);
          startAutoAdvance();
        }
      });

      startAutoAdvance();
      bindGalleryTriggers(galleryGrid);
    });
  };

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

  buildCarousels();
  bindGalleryTriggers();

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
