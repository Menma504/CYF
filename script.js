/**
 * Father's Day Church Fundraiser Website - Interactive Script
 * Don Bosco Church CYF
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     MOBILE NAVIGATION MENU
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileToggle.classList.toggle('active');
      navMenu.classList.toggle('active');
    });

    // Close menu when clicking on any navigation link
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      });
    });

    // Close menu when clicking outside of header
    document.addEventListener('click', (e) => {
      if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
        mobileToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  }

  /* ==========================================================================
     STICKY CONTACT BAR LOGIC
     ========================================================================== */
  const stickyBar = document.getElementById('sticky-contact-bar');
  if (stickyBar) {
    window.addEventListener('scroll', () => {
      // Hide sticky contact bar when at the very top of the page (within first 150px)
      if (window.scrollY < 150) {
        stickyBar.style.transform = 'translateY(100%)';
        stickyBar.style.transition = 'transform 0.3s ease';
      } else {
        stickyBar.style.transform = 'translateY(0)';
      }
    });
    
    // Initial check on load
    if (window.scrollY < 150) {
      stickyBar.style.transform = 'translateY(100%)';
    }
  }

  /* ==========================================================================
     INTERSECTION OBSERVER FOR ON-SCROLL REVEALS
     ========================================================================== */
  const revealElements = document.querySelectorAll('.scroll-reveal');
  const heroReveal = document.querySelector('.hero-content');
  
  // Instantly reveal hero content
  if (heroReveal) {
    setTimeout(() => {
      heroReveal.classList.add('revealed');
    }, 150);
  }

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.15, // trigger when 15% of element is visible
      rootMargin: '0px 0px -50px 0px' // offset bottom slightly
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal all elements directly if observer is not supported
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ==========================================================================
     LIGHTBOX GALLERY WITH SWIPE INTERACTION
     ========================================================================== */
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDesc = document.getElementById('lightbox-desc');
  const lightboxClose = document.getElementById('lightbox-close');
  const lightboxPrev = document.getElementById('lightbox-prev');
  const lightboxNext = document.getElementById('lightbox-next');

  let currentGalleryIndex = 0;
  const galleryData = [];

  // Parse images and metadata from gallery grid
  galleryItems.forEach((item, index) => {
    galleryData.push({
      src: item.getAttribute('data-image'),
      title: item.getAttribute('data-title') || '',
      desc: item.getAttribute('data-desc') || ''
    });

    item.addEventListener('click', () => {
      openLightbox(index);
    });
  });

  function openLightbox(index) {
    currentGalleryIndex = index;
    updateLightboxContent();
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden'; // prevent scrolling main page
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showNextImage() {
    currentGalleryIndex = (currentGalleryIndex + 1) % galleryData.length;
    updateLightboxContent();
  }

  function showPrevImage() {
    currentGalleryIndex = (currentGalleryIndex - 1 + galleryData.length) % galleryData.length;
    updateLightboxContent();
  }

  function updateLightboxContent() {
    const currentItem = galleryData[currentGalleryIndex];
    lightboxImg.style.opacity = 0;
    
    // Smooth transition between slides
    setTimeout(() => {
      lightboxImg.src = currentItem.src;
      lightboxImg.alt = currentItem.title;
      lightboxTitle.textContent = currentItem.title;
      lightboxDesc.textContent = currentItem.desc;
      lightboxImg.style.opacity = 1;
      lightboxImg.style.transition = 'opacity 0.25s ease-in-out';
    }, 150);
  }

  if (lightbox) {
    lightboxClose.addEventListener('click', closeLightbox);
    lightboxNext.addEventListener('click', showNextImage);
    lightboxPrev.addEventListener('click', showPrevImage);

    // Close lightbox on clicking dark overlay background (excluding content/navigation buttons)
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) {
        closeLightbox();
      }
    });

    // Keyboard navigation support
    document.addEventListener('keydown', (e) => {
      if (lightbox.classList.contains('active')) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') showNextImage();
        if (e.key === 'ArrowLeft') showPrevImage();
      }
    });

    /* Touch/Swipe Handling for Mobile devices */
    let touchStartX = 0;
    let touchEndX = 0;
    const swipeThreshold = 55; // minimum px distance for swipe detection

    lightbox.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > swipeThreshold) {
        if (swipeDistance > 0) {
          showPrevImage(); // swipe right -> previous image
        } else {
          showNextImage(); // swipe left -> next image
        }
      }
    }
  }

  /* ==========================================================================
     FLOATING CANVAS PARTICLE SYSTEM (HOLY GLOW EFFECTS)
     ========================================================================== */
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    const maxParticles = window.innerWidth < 768 ? 30 : 60; // scale down on mobile

    // Resize canvas
    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Particle representation
    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * canvas.width;
        // Start from below the screen or randomly distributed at load
        this.y = Math.random() * canvas.height + 20;
        this.size = Math.random() * 3 + 1; // 1px to 4px
        this.speedY = -(Math.random() * 0.5 + 0.2); // drift up slowly
        this.speedX = Math.random() * 0.4 - 0.2; // slight side sway
        // Soft warm gold/orange and pure white light colors
        const colors = [
          'rgba(197, 160, 89, ', // Gold
          'rgba(255, 255, 255, ', // White
          'rgba(74, 144, 226, '   // Soft Sky Blue
        ];
        this.colorBase = colors[Math.floor(Math.random() * colors.length)];
        this.maxOpacity = Math.random() * 0.4 + 0.1; // low opacity (0.1 to 0.5)
        this.opacity = 0;
        this.fadeInSpeed = Math.random() * 0.02 + 0.005;
        this.fadeOutY = Math.random() * 150; // Fade out near top limits
      }

      update() {
        this.y += this.speedY;
        this.x += this.speedX;
        
        // Sway animation using sine wave
        this.x += Math.sin(this.y * 0.01) * 0.15;

        // Fade in gradually
        if (this.opacity < this.maxOpacity) {
          this.opacity += this.fadeInSpeed;
        }

        // Reset if goes off-screen or fades out
        if (this.y < -10 || this.x < -10 || this.x > canvas.width + 10) {
          this.reset();
          this.y = canvas.height + 10;
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `${this.colorBase}${this.opacity})`;
        ctx.shadowBlur = this.size * 2;
        ctx.shadowColor = 'rgba(197, 160, 89, 0.4)';
        ctx.fill();
        ctx.shadowColor = 'transparent'; // reset shadow for performance
      }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
      const p = new Particle();
      // distribute them vertically at initialization so they aren't all at the bottom
      p.y = Math.random() * canvas.height;
      particles.push(p);
    }

    // Animation Loop
    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      
      requestAnimationFrame(animate);
    }
    animate();
  }

});
