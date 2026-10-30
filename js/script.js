/**
 * LUCCI MEDIA - Pure Vanilla JavaScript Engine
 * Handles navigation, animations, filters, accordion, lightbox, slider, swipe & form validation.
 * Zero external framework dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SCROLL PROGRESS BAR ---
  const scrollProgressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0 && scrollProgressBar) {
      const percentage = (totalScroll / windowHeight) * 100;
      scrollProgressBar.style.width = percentage + '%';
    }
  }, { passive: true });

  // --- 2. STICKY NAVIGATION BLUR & COMPACT ON SCROLL ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (!header) return;
    if (window.scrollY > 30) {
      header.classList.add('nav-glass', 'py-3.5', 'shadow-sm');
      header.classList.remove('py-5', 'bg-[#FAF8F5]/90');
    } else {
      header.classList.remove('nav-glass', 'py-3.5', 'shadow-sm');
      header.classList.add('py-5', 'bg-[#FAF8F5]/90');
    }
  }, { passive: true });

  // --- 3. MOBILE MENU TOGGLE & BODY LOCK ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  function toggleMobileMenu(open) {
    if (!mobileMenu || !mobileMenuBtn) return;
    const isOpen = open !== undefined ? open : mobileMenu.classList.contains('pointer-events-none');
    if (isOpen) {
      mobileMenu.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      mobileMenuBtn.classList.add('menu-active');
      document.body.classList.add('body-menu-locked');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      mobileMenuBtn.classList.remove('menu-active');
      document.body.classList.remove('body-menu-locked');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());
  }

  // Close mobile drawer when clicking anywhere outside
  document.addEventListener('click', (e) => {
    if (mobileMenu && !mobileMenu.classList.contains('pointer-events-none')) {
      if (!mobileMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        toggleMobileMenu(false);
      }
    }
  });

  // --- 4. SMOOTH SCROLLING NAVIGATION ---
  function smoothScrollTo(targetSelector, offset = 80) {
    const el = document.querySelector(targetSelector);
    if (!el) return;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href.length > 1) {
        e.preventDefault();
        toggleMobileMenu(false);
        smoothScrollTo(href);
      }
    });
  });

  // Back to top
  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- 5. SERVICES ACCORDION & CATEGORY FILTERING ---
  const serviceFilterBtns = document.querySelectorAll('.service-filter-btn');
  const serviceCards = document.querySelectorAll('.service-card');

  serviceFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-service-filter');

      // Update button active states
      serviceFilterBtns.forEach(b => {
        b.classList.remove('bg-[#1E1A17]', 'text-[#FAF8F5]', 'font-semibold');
        b.classList.add('bg-[#F5F1EA]', 'text-[#544B44]', 'font-normal');
      });
      btn.classList.add('bg-[#1E1A17]', 'text-[#FAF8F5]', 'font-semibold');
      btn.classList.remove('bg-[#F5F1EA]', 'text-[#544B44]', 'font-normal');

      // Filter cards
      serviceCards.forEach(card => {
        const cat = card.getAttribute('data-service-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // Service Card Accordion Toggle
  serviceCards.forEach(card => {
    const toggleHeader = card.querySelector('.service-toggle');
    const drawer = card.querySelector('.service-drawer');
    const plusIcon = card.querySelector('.service-plus-icon');
    const minusIcon = card.querySelector('.service-minus-icon');

    if (toggleHeader && drawer) {
      toggleHeader.addEventListener('click', () => {
        const isExpanded = !drawer.classList.contains('hidden');

        // Collapse all other services for clean editorial accordions
        serviceCards.forEach(c => {
          const d = c.querySelector('.service-drawer');
          const p = c.querySelector('.service-plus-icon');
          const m = c.querySelector('.service-minus-icon');
          if (d) d.classList.add('hidden');
          if (p) p.classList.remove('hidden');
          if (m) m.classList.add('hidden');
          c.classList.remove('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-lg');
          c.classList.add('bg-[#FAF8F5]', 'border-[#EAE4D9]');
        });

        // If it wasn't expanded before, expand this one
        if (!isExpanded) {
          drawer.classList.remove('hidden');
          if (plusIcon) plusIcon.classList.add('hidden');
          if (minusIcon) minusIcon.classList.remove('hidden');
          card.classList.add('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-lg');
          card.classList.remove('bg-[#FAF8F5]', 'border-[#EAE4D9]');
        }
      });
    }
  });

  // Hook for "Inquire about [Service]" buttons
  document.querySelectorAll('.inquire-service-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const serviceTitle = btn.getAttribute('data-inquire-service');
      const serviceSelect = document.getElementById('contact-service');
      if (serviceSelect && serviceTitle) {
        serviceSelect.value = serviceTitle;
      }
      smoothScrollTo('#contact');
    });
  });

  // --- 6. PORTFOLIO CATEGORY FILTERING ---
  const portfolioFilterBtns = document.querySelectorAll('.portfolio-filter-btn');
  const portfolioCards = document.querySelectorAll('.portfolio-card');

  portfolioFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-portfolio-filter');

      portfolioFilterBtns.forEach(b => {
        b.classList.remove('bg-[#1E1A17]', 'text-[#FAF8F5]', 'font-semibold');
        b.classList.add('bg-[#F5F1EA]', 'text-[#544B44]', 'font-light');
      });
      btn.classList.add('bg-[#1E1A17]', 'text-[#FAF8F5]', 'font-semibold');
      btn.classList.remove('bg-[#F5F1EA]', 'text-[#544B44]', 'font-light');

      portfolioCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // --- 7. IMAGE LIGHTBOX MODAL WITH ARROWS & SWIPE ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxPrevBtn = document.getElementById('lightbox-prev-btn');
  const lightboxNextBtn = document.getElementById('lightbox-next-btn');
  const lightboxCounter = document.getElementById('lightbox-counter');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClient = document.getElementById('lightbox-client');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxDeliverables = document.getElementById('lightbox-deliverables');
  const lightboxInquireBtn = document.getElementById('lightbox-inquire-btn');

  let lightboxItems = [];
  let currentLightboxIndex = -1;

  // Initialize lightbox items catalog from DOM
  const portfolioCardElements = Array.from(document.querySelectorAll('[data-portfolio-item]'));
  portfolioCardElements.forEach((card, idx) => {
    try {
      const item = JSON.parse(card.getAttribute('data-portfolio-item'));
      item.element = card;
      lightboxItems.push(item);
      card.setAttribute('data-lightbox-index', idx);
    } catch (err) {
      console.error('Error parsing item data:', err);
    }
  });

  function openLightboxByIndex(index) {
    if (!lightboxItems.length) return;
    if (index < 0) index = lightboxItems.length - 1;
    if (index >= lightboxItems.length) index = 0;
    currentLightboxIndex = index;
    const item = lightboxItems[index];

    // Smooth image reveal
    if (lightboxImg) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = item.image;
        lightboxImg.alt = item.title;
        lightboxImg.style.opacity = '1';
      }, 80);
    }

    if (lightboxCategory) lightboxCategory.textContent = item.categoryLabel || '';
    if (lightboxClient) lightboxClient.textContent = item.client || '';
    if (lightboxTitle) lightboxTitle.textContent = item.title || '';
    if (lightboxDescription) lightboxDescription.textContent = item.description || '';

    if (lightboxCounter) {
      const cur = String(currentLightboxIndex + 1).padStart(2, '0');
      const tot = String(lightboxItems.length).padStart(2, '0');
      lightboxCounter.textContent = `${cur} / ${tot}`;
    }

    // Deliverables tags
    if (lightboxDeliverables) {
      lightboxDeliverables.innerHTML = '';
      if (item.deliverables && item.deliverables.length) {
        item.deliverables.forEach(d => {
          const span = document.createElement('span');
          span.className = 'text-[9px] uppercase tracking-wider text-[#544B44] bg-[#F5F1EA] border border-[#DDD5C7] px-2.5 py-1';
          span.textContent = d;
          lightboxDeliverables.appendChild(span);
        });
      }
    }

    if (lightboxModal) {
      lightboxModal.classList.remove('opacity-0', 'pointer-events-none');
      lightboxModal.classList.add('opacity-100', 'pointer-events-auto');
    }
    document.body.classList.add('body-menu-locked');
  }

  function nextLightbox() {
    openLightboxByIndex(currentLightboxIndex + 1);
  }

  function prevLightbox() {
    openLightboxByIndex(currentLightboxIndex - 1);
  }

  function closeLightbox() {
    if (lightboxModal) {
      lightboxModal.classList.add('opacity-0', 'pointer-events-none');
      lightboxModal.classList.remove('opacity-100', 'pointer-events-auto');
    }
    document.body.classList.remove('body-menu-locked');
    currentLightboxIndex = -1;
  }

  if (lightboxOverlay) lightboxOverlay.addEventListener('click', closeLightbox);
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', (e) => { e.stopPropagation(); prevLightbox(); });
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', (e) => { e.stopPropagation(); nextLightbox(); });

  // Lightbox Keyboard Navigation (Escape, Left, Right)
  document.addEventListener('keydown', (e) => {
    if (!lightboxModal || lightboxModal.classList.contains('pointer-events-none')) return;
    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      nextLightbox();
    } else if (e.key === 'ArrowLeft') {
      prevLightbox();
    }
  });

  // Lightbox Touch Swipe
  let lbTouchStartX = 0;
  let lbTouchEndX = 0;
  if (lightboxModal) {
    lightboxModal.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightboxModal.addEventListener('touchend', (e) => {
      lbTouchEndX = e.changedTouches[0].screenX;
      const diff = lbTouchEndX - lbTouchStartX;
      if (Math.abs(diff) > 45) {
        if (diff < 0) {
          nextLightbox(); // swiped left -> next
        } else {
          prevLightbox(); // swiped right -> prev
        }
      }
    }, { passive: true });
  }

  // Click handler on portfolio & bts cards
  portfolioCardElements.forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.getAttribute('data-lightbox-index'), 10);
      if (!isNaN(idx)) {
        openLightboxByIndex(idx);
      }
    });
  });

  if (lightboxInquireBtn) {
    lightboxInquireBtn.addEventListener('click', () => {
      const serviceSelect = document.getElementById('contact-service');
      if (serviceSelect) {
        serviceSelect.value = 'Custom Multi-Service Scope';
      }
      closeLightbox();
      smoothScrollTo('#contact');
    });
  }

  // --- 8. TESTIMONIALS SLIDER & MOBILE TOUCH SWIPE ---
  const testimonials = [
    {
      highlight: "I booked 30 new clients in the matter of 2 weeks.",
      quote: "Working with you has been the best thing I ever did. It was so important to me to find someone to grow with and that aligned to my vision—you're that and more. From working a 9-5 and my busy schedule, you've helped my business become more consistent and grow in such a short time period. We've been working together for 3 weeks now and I've been able to surpass my goal with my waitlist for future classes. Also, my bookings have gone up: I booked 30 new clients in the matter of 2 weeks. So grateful to have you as part of my journey.",
      author: "Katherine",
      business: "Kat Beauty Co",
      serviceMentioned: "Social Media Management & Strategy"
    },
    {
      highlight: "Lex got the vision & has executed meticulously. Beyond my expectation actually.",
      quote: "For the last couple of months, I've been working on my rebrand with Lucci Media and I can't boast enough about how much of a pleasure it's been to work with her and the energy she brings. Lex got the vision and has executed meticulously. Beyond my expectation actually. Looking forward to our continued growth together!",
      author: "Sheranny",
      business: "Brown Sugar Skin",
      serviceMentioned: "Rebrand, Brand Kit & Shoot"
    },
    {
      highlight: "Lexi is a game-changer for anyone looking to take their business to the next level.",
      quote: "I've had the absolute pleasure of working with Lexi and Lucci Media on several occasions for content creation days and business branding photo shoots, and every experience has been nothing short of amazing. Lexi has an incredible eye for aesthetics and such a natural talent for capturing the essence of a brand. The photos and content she created were not only visually stunning but also perfectly aligned with my brand's aesthetic. Beyond her creative skills, Lexi is organized, patient, and full of fresh ideas.",
      author: "Matthew",
      business: "Matthew James Skin Spa",
      serviceMentioned: "Content Days & Branding Shoots"
    },
    {
      highlight: "I'm on my third project with Lucci Media, and the consistency speaks for itself!",
      quote: "She is the best!! She captures the right angles, picks the best tone, creates amazing reels, and the best part is she's efficient and gets things done! She's also such a sweet soul and a hard-working mama. I am so excited for our future projects together.",
      author: "Andrea",
      business: "Serenity Beauty Boston",
      serviceMentioned: "Trending Socials & Ongoing Content"
    },
    {
      highlight: "From the brand kit to my photoshoot and website, Lex brought my entire vision to life.",
      quote: "Working with Lucci Media was an absolute dream! From the brand kit to my photoshoot and website, Lex brought my entire vision to life so effortlessly. Her style is impeccable—she just knew exactly what I wanted without me having to say much. She was always communicative, keeping me updated throughout every step. Even when not 'on the clock,' she took the time to answer questions and ensure I felt confident and supported.",
      author: "Marisela",
      business: "OH LA GLAMY",
      serviceMentioned: "Full Brand Suite, Shoot & Website"
    },
    {
      highlight: "Obsessed is an understatement... the Lucci Media high-end touch that they're known for.",
      quote: "As a fellow female business owner who prioritizes the client experience, it goes a long way when I'm on the receiving end. After experiencing an exploration call and a CEO Mini shoot with incredible final edits, I decided to bring her on for a year's worth of content. It still feels like my voice—just with the Lucci Media high-end touch that they're known for. Love me some Lex and Lucci Media!",
      author: "Alyssa",
      business: "Dosed RX",
      serviceMentioned: "Inner Circle Annual Content & Shoots"
    },
    {
      highlight: "She captured 700+ pictures and gave me a lifetime of images for my business.",
      quote: "I can't say enough great things about Lex and the process of my brand photoshoot. From her gentle manner through messages to the awesome energy in person behind the camera. Not only did she help with posing and angles, but she made me feel so much more confident. I wanted to captivate this new era for myself and she exceeded all expectations.",
      author: "Raschel",
      business: "R Method",
      serviceMentioned: "Brand Photography & Direction"
    },
    {
      highlight: "The culture behind her brand is so welcoming and uplifting.",
      quote: "Working with Lex has pushed me to believe in my work and myself. The culture behind her brand is so welcoming and uplifting.",
      author: "Jessalyn",
      business: "NewSkn Aesthetics",
      serviceMentioned: "Social Media Strategy"
    },
    {
      highlight: "Lex cares as much about our brands as we do and goes above and beyond.",
      quote: "Lex cares as much about our brands as much as we do and literally goes above and beyond. I want her to be my SMM in this life and the next!",
      author: "Cecillia",
      business: "The Glam Factory",
      serviceMentioned: "Social Media Management"
    },
    {
      highlight: "Lex's passion to stand out and provide high attention to detail is unmatched.",
      quote: "Lucci Media brought my vision to life during my CEO mini shoot. I am so happy with the energy and quality of work with this team. Lex's passion to stand out and provide high attention to detail to our projects is what will keep me on board for all my social media needs!",
      author: "Shaneice",
      business: "Recovery Room",
      serviceMentioned: "CEO Mini Shoot & Social Content"
    }
  ];

  let currentTestimonialIndex = 0;
  const tHighlight = document.getElementById('t-highlight');
  const tQuote = document.getElementById('t-quote');
  const tAuthor = document.getElementById('t-author');
  const tBusiness = document.getElementById('t-business');
  const tService = document.getElementById('t-service');
  const tCounter = document.getElementById('t-counter');
  const tDots = document.querySelectorAll('[data-testimonial-dot]');
  const tPrevBtn = document.getElementById('t-prev-btn');
  const tNextBtn = document.getElementById('t-next-btn');
  const tCardInner = document.querySelector('.testimonial-card-inner');

  function renderTestimonial(idx) {
    currentTestimonialIndex = idx;
    const t = testimonials[idx];

    if (tCardInner) {
      tCardInner.style.opacity = '0';
      tCardInner.style.transform = 'translateY(6px)';
    }

    setTimeout(() => {
      if (tHighlight) tHighlight.innerHTML = `&ldquo;${t.highlight}&rdquo;`;
      if (tQuote) tQuote.textContent = t.quote;
      if (tAuthor) tAuthor.textContent = t.author;
      if (tBusiness) tBusiness.textContent = t.business;
      if (tService) tService.textContent = `Service: ${t.serviceMentioned}`;
      if (tCounter) tCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;

      tDots.forEach((d, i) => {
        if (i === idx) {
          d.className = 'h-1.5 transition-all duration-300 w-8 bg-[#1E1A17]';
        } else {
          d.className = 'h-1.5 transition-all duration-300 w-2 bg-[#DDD5C7] hover:bg-[#A99B87]';
        }
      });

      if (tCardInner) {
        tCardInner.style.opacity = '1';
        tCardInner.style.transform = 'translateY(0)';
      }
    }, 120);
  }

  if (tPrevBtn) {
    tPrevBtn.addEventListener('click', () => {
      const nextIdx = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
      renderTestimonial(nextIdx);
    });
  }

  if (tNextBtn) {
    tNextBtn.addEventListener('click', () => {
      const nextIdx = (currentTestimonialIndex + 1) % testimonials.length;
      renderTestimonial(nextIdx);
    });
  }

  tDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-testimonial-dot'), 10);
      renderTestimonial(idx);
    });
  });

  // Testimonials Mobile Touch Swipe
  const sliderView = document.getElementById('testimonials-slider-view');
  let tTouchStartX = 0;
  let tTouchEndX = 0;
  if (sliderView) {
    sliderView.addEventListener('touchstart', (e) => {
      tTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    sliderView.addEventListener('touchend', (e) => {
      tTouchEndX = e.changedTouches[0].screenX;
      const diff = tTouchEndX - tTouchStartX;
      if (Math.abs(diff) > 40) {
        if (diff < 0) {
          const nextIdx = (currentTestimonialIndex + 1) % testimonials.length;
          renderTestimonial(nextIdx);
        } else {
          const nextIdx = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
          renderTestimonial(nextIdx);
        }
      }
    }, { passive: true });
  }

  // Toggle Slider vs Grid View
  const toggleViewBtn = document.getElementById('toggle-testimonials-view');
  const gridView = document.getElementById('testimonials-grid-view');
  const viewText = document.getElementById('view-text');

  if (toggleViewBtn && gridView && sliderView) {
    toggleViewBtn.addEventListener('click', () => {
      const isShowingGrid = !gridView.classList.contains('hidden');
      if (isShowingGrid) {
        gridView.classList.add('hidden');
        sliderView.classList.remove('hidden');
        if (viewText) viewText.textContent = 'READ ALL 10 TESTIMONIALS';
      } else {
        sliderView.classList.add('hidden');
        gridView.classList.remove('hidden');
        if (viewText) viewText.textContent = 'SLIDESHOW VIEW';
      }
    });
  }

  // --- 9. FAQ ACCORDION & CATEGORY FILTERING ---
  const faqFilterBtns = document.querySelectorAll('.faq-filter-btn');
  const faqCards = document.querySelectorAll('.faq-card');

  faqFilterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.getAttribute('data-faq-filter');

      faqFilterBtns.forEach(b => {
        b.classList.remove('bg-[#1E1A17]', 'text-[#FAF8F5]', 'font-semibold');
        b.classList.add('bg-[#FAF8F5]', 'text-[#544B44]', 'font-normal');
      });
      btn.classList.add('bg-[#1E1A17]', 'text-[#FAF8F5]', 'font-semibold');
      btn.classList.remove('bg-[#FAF8F5]', 'text-[#544B44]', 'font-normal');

      faqCards.forEach(card => {
        const cat = card.getAttribute('data-faq-category');
        if (filter === 'all' || cat === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  faqCards.forEach(card => {
    const qBtn = card.querySelector('.faq-question-btn');
    const answerPanel = card.querySelector('.faq-answer-panel');
    const plusIcon = card.querySelector('.faq-plus-icon');
    const minusIcon = card.querySelector('.faq-minus-icon');

    if (qBtn && answerPanel) {
      qBtn.addEventListener('click', () => {
        const isOpen = !answerPanel.classList.contains('hidden');

        // Collapse other FAQs
        faqCards.forEach(c => {
          const a = c.querySelector('.faq-answer-panel');
          const p = c.querySelector('.faq-plus-icon');
          const m = c.querySelector('.faq-minus-icon');
          if (a) a.classList.add('hidden');
          if (p) p.classList.remove('hidden');
          if (m) m.classList.add('hidden');
          c.classList.remove('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-sm', 'is-expanded');
          c.classList.add('bg-[#FAF8F5]', 'border-[#EAE4D9]');
        });

        if (!isOpen) {
          answerPanel.classList.remove('hidden');
          if (plusIcon) plusIcon.classList.add('hidden');
          if (minusIcon) minusIcon.classList.remove('hidden');
          card.classList.add('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-sm', 'is-expanded');
          card.classList.remove('bg-[#FAF8F5]', 'border-[#EAE4D9]');
        }
      });
    }
  });

  // --- 10. CONTACT FORM VALIDATION & SUBMISSION ---
  const contactForm = document.getElementById('contact-form');
  const contactError = document.getElementById('contact-error');
  const contactSuccess = document.getElementById('contact-success');
  const successClientName = document.getElementById('success-client-name');
  const successClientDesc = document.getElementById('success-client-desc');
  const resetContactBtn = document.getElementById('reset-contact-btn');
  const submitBtnText = document.getElementById('submit-btn-text');
  const submitBtn = document.getElementById('contact-submit-btn');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const nameInput = document.getElementById('contact-name');
      const emailInput = document.getElementById('contact-email');
      const businessInput = document.getElementById('contact-business');
      const detailsInput = document.getElementById('contact-details');

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const business = businessInput ? businessInput.value.trim() : '';
      const details = detailsInput ? detailsInput.value.trim() : '';

      if (!name || !email || !details) {
        if (contactError) {
          contactError.textContent = 'Please fill in your name, email, and project details.';
          contactError.classList.remove('hidden');
        }
        return;
      }

      if (contactError) contactError.classList.add('hidden');
      if (submitBtnText) submitBtnText.textContent = 'PROCESSING APPLICATION...';
      if (submitBtn) submitBtn.disabled = true;

      setTimeout(() => {
        if (submitBtn) submitBtn.disabled = false;
        if (submitBtnText) submitBtnText.textContent = 'SUBMIT APPLICATION';

        if (successClientName) successClientName.textContent = `Thank you, ${name}.`;
        if (successClientDesc) successClientDesc.textContent = `We have received your project details for ${business || 'your business'}. Lex will review your aesthetic goals and reach out directly within 24-48 hours.`;

        contactForm.classList.add('hidden');
        if (contactSuccess) contactSuccess.classList.remove('hidden');
      }, 700);
    });

    if (resetContactBtn) {
      resetContactBtn.addEventListener('click', () => {
        contactForm.reset();
        if (contactSuccess) contactSuccess.classList.add('hidden');
        contactForm.classList.remove('hidden');
      });
    }
  }

  // --- 11. SCROLL REVEAL OBSERVER ---
  const revealElements = document.querySelectorAll('.reveal-on-scroll, .reveal-fade, .reveal-scale');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -40px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Immediate reveal if reduced motion or IntersectionObserver is unsupported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }

  
  // --- 12. BRANDED PRELOADER ANIMATION (POPULAR TASKS & THUMBSTOP) ---
  const siteLoader = document.getElementById('site-loader');
  const loaderBar = document.getElementById('loader-progress-bar');
  const loaderCounter = document.getElementById('loader-counter');

  if (siteLoader && loaderBar && loaderCounter) {
    let progress = 0;
    const duration = 950; // fast luxury loading
    const intervalTime = 20;
    const step = 100 / (duration / intervalTime);

    const loaderInterval = setInterval(() => {
      progress += step;
      if (progress >= 100) {
        progress = 100;
        clearInterval(loaderInterval);
        loaderBar.style.width = '100%';
        loaderCounter.textContent = '100%';

        setTimeout(() => {
          siteLoader.classList.add('loader-hidden');
          document.body.classList.add('site-loaded');
        }, 220);
      } else {
        loaderBar.style.width = `${Math.floor(progress)}%`;
        loaderCounter.textContent = `${Math.floor(progress)}%`;
      }
    }, intervalTime);
  } else {
    document.body.classList.add('site-loaded');
  }

  // --- 13. HERO FLOATING CARDS DESKTOP PARALLAX ---
  const heroSec = document.getElementById('home');
  const parallaxLayers = document.querySelectorAll('.parallax-layer');
  if (window.innerWidth > 1024 && heroSec && parallaxLayers.length) {
    heroSec.addEventListener('mousemove', (e) => {
      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;
      const deltaX = (e.clientX - centerX);
      const deltaY = (e.clientY - centerY);

      parallaxLayers.forEach(layer => {
        const factor = parseFloat(layer.getAttribute('data-parallax') || '0.04');
        const moveX = deltaX * factor;
        const moveY = deltaY * factor;
        layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
      });
    }, { passive: true });

    heroSec.addEventListener('mouseleave', () => {
      parallaxLayers.forEach(layer => {
        layer.style.transform = 'translate3d(0, 0, 0)';
      });
    });
  }

  // --- 14. DESKTOP MAGNETIC BUTTON INTERACTION ---
  if (window.innerWidth > 1024) {
    document.querySelectorAll('.btn-magnetic').forEach(btn => {
      btn.addEventListener('mousemove', (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.22}px, ${y * 0.22}px)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
      });
    });
  }

  // --- 15. LUXURY DESKTOP CUSTOM CURSOR ---
  const customCursor = document.getElementById('custom-cursor');
  const customCursorDot = document.getElementById('custom-cursor-dot');
  if (customCursor && customCursorDot && window.innerWidth > 1024 && !window.matchMedia('(pointer: coarse)').matches) {
    let mouseX = -100, mouseY = -100;
    let cursorX = -100, cursorY = -100;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      customCursorDot.style.transform = `translate(${mouseX}px, ${mouseY}px)`;
    }, { passive: true });

    function renderCursorFollower() {
      cursorX += (mouseX - cursorX) * 0.18;
      cursorY += (mouseY - cursorY) * 0.18;
      customCursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
      requestAnimationFrame(renderCursorFollower);
    }
    requestAnimationFrame(renderCursorFollower);

    // Hover expand state over interactive links and cards
    document.querySelectorAll('a, button, [data-portfolio-item], .service-card, .faq-question-btn').forEach(el => {
      el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
      el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
    });
  }

  // --- 16. ANIMATED NUMBER COUNTERS FOR REAL METRICS ---
  const counterEls = document.querySelectorAll('[data-counter-target]');
  if ('IntersectionObserver' in window && counterEls.length) {
    const counterObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.getAttribute('data-counter-target'), 10);
          if (!isNaN(target)) {
            const raw = el.textContent.trim();
            const suffix = raw.replace(/[0-9]/g, '');
            let count = 0;
            const duration = 1200;
            const step = Math.max(1, Math.ceil(target / (duration / 20)));
            const timer = setInterval(() => {
              count += step;
              if (count >= target) {
                count = target;
                clearInterval(timer);
              }
              el.textContent = `${count}${suffix}`;
            }, 20);
          }
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.2 });

    counterEls.forEach(el => counterObserver.observe(el));
  }

  console.log('LUCCI MEDIA pure static JavaScript engine initialized successfully.');
});
