/* ==========================================
   CIBUM GROUP - Shared JavaScript
   ========================================== */

document.addEventListener('DOMContentLoaded', () => {

  // --- Page Loader ---
  const loader = document.querySelector('.page-loader');
  if (loader) {
    window.addEventListener('load', () => {
      setTimeout(() => loader.classList.add('hidden'), 800);
    });
  }

  // --- Navbar Scroll Effect ---
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    const onScroll = () => {
      navbar.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // --- Active Nav Link ---
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__link, .navbar__mobile-link').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.navbar__hamburger');
  const mobileMenu = document.querySelector('.navbar__mobile');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Close on link click
    mobileMenu.querySelectorAll('.navbar__mobile-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });

    // Close on outside click
    document.addEventListener('click', e => {
      if (!navbar.contains(e.target) && !mobileMenu.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  // --- Hero Parallax ---
  const heroBg = document.querySelector('.hero__bg');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.25}px)`;
      }
    }, { passive: true });
  }

  // --- Scroll Reveal ---
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));
  }

  // --- Gallery Lightbox ---
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox__img');

  if (galleryItems.length && lightbox && lightboxImg) {
    let currentIndex = 0;
    const images = Array.from(galleryItems).map(item => item.querySelector('img')?.src).filter(Boolean);

    const openLightbox = (index) => {
      currentIndex = index;
      lightboxImg.src = images[index];
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    const navigate = (dir) => {
      currentIndex = (currentIndex + dir + images.length) % images.length;
      lightboxImg.src = images[currentIndex];
    };

    galleryItems.forEach((item, i) => {
      item.addEventListener('click', () => openLightbox(i));
    });

    document.querySelector('.lightbox__close')?.addEventListener('click', closeLightbox);
    document.querySelector('.lightbox__prev')?.addEventListener('click', () => navigate(-1));
    document.querySelector('.lightbox__next')?.addEventListener('click', () => navigate(1));
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate(-1);
      if (e.key === 'ArrowRight') navigate(1);
    });
  }

  // --- Tabs ---
  const tabs = document.querySelectorAll('.tab');
  const tabPanels = document.querySelectorAll('.tab-panel');

  if (tabs.length) {
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const target = tab.dataset.tab;

        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        tabPanels.forEach(panel => {
          panel.style.display = panel.dataset.panel === target ? 'block' : 'none';
        });
      });
    });
  }

  // --- Cookie Banner ---
  const cookieBanner = document.querySelector('.cookie-banner');
  const cookieAccept = document.querySelector('.cookie-accept');
  const cookieReject = document.querySelector('.cookie-reject');

  if (cookieBanner) {
    const cookieConsent = localStorage.getItem('cibum-cookies');
    if (cookieConsent) {
      cookieBanner.classList.add('hidden');
    } else {
      setTimeout(() => cookieBanner.style.display = 'flex', 1500);
    }

    const accept = () => {
      localStorage.setItem('cibum-cookies', 'accepted');
      cookieBanner.classList.add('hidden');
    };

    const reject = () => {
      localStorage.setItem('cibum-cookies', 'rejected');
      cookieBanner.classList.add('hidden');
    };

    cookieAccept?.addEventListener('click', accept);
    cookieReject?.addEventListener('click', reject);
  }

  // --- Hero Slider (if exists) ---
  const heroSlides = document.querySelectorAll('.hero__slide');
  const heroDots = document.querySelectorAll('.hero__dot');

  if (heroSlides.length > 1) {
    let currentSlide = 0;
    let sliderInterval;

    const goToSlide = (index) => {
      heroSlides[currentSlide].classList.remove('active');
      heroDots[currentSlide]?.classList.remove('active');
      currentSlide = (index + heroSlides.length) % heroSlides.length;
      heroSlides[currentSlide].classList.add('active');
      heroDots[currentSlide]?.classList.add('active');
    };

    const startSlider = () => {
      sliderInterval = setInterval(() => goToSlide(currentSlide + 1), 5000);
    };

    heroSlides[0].classList.add('active');
    heroDots[0]?.classList.add('active');

    heroDots.forEach((dot, i) => {
      dot.addEventListener('click', () => {
        clearInterval(sliderInterval);
        goToSlide(i);
        startSlider();
      });
    });

    startSlider();
  }

  // --- Smooth counter animation ---
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length) {
    const countObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.count);
          const duration = 1800;
          const step = target / (duration / 16);
          let current = 0;

          const update = () => {
            current = Math.min(current + step, target);
            el.textContent = Math.floor(current) + (el.dataset.suffix || '');
            if (current < target) requestAnimationFrame(update);
          };

          requestAnimationFrame(update);
          countObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    counters.forEach(el => countObserver.observe(el));
  }

});
