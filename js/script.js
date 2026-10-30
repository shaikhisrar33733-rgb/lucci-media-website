/**
 * LUCCI MEDIA - Pure Vanilla JavaScript Engine
 * Handles all navigation, animations, filters, accordion, lightbox, slider & form validation.
 * Zero external framework dependencies.
 */

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. SCROLL PROGRESS BAR ---
  const scrollProgressBar = document.getElementById('scroll-progress');
  window.addEventListener('scroll', () => {
    const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
    const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    if (windowHeight > 0) {
      const percentage = (totalScroll / windowHeight) * 100;
      scrollProgressBar.style.width = percentage + '%';
    }
  }, { passive: true });

  // --- 2. STICKY NAVIGATION BLUR ---
  const header = document.getElementById('site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 30) {
      header.classList.add('nav-glass', 'py-3.5', 'shadow-sm');
      header.classList.remove('py-5', 'bg-[#FAF8F5]/90');
    } else {
      header.classList.remove('nav-glass', 'py-3.5', 'shadow-sm');
      header.classList.add('py-5', 'bg-[#FAF8F5]/90');
    }
  }, { passive: true });

  // --- 3. MOBILE MENU TOGGLE ---
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const hamburgerIcon = document.getElementById('hamburger-icon');
  const closeIcon = document.getElementById('close-icon');

  function toggleMobileMenu(open) {
    const isOpen = open !== undefined ? open : mobileMenu.classList.contains('pointer-events-none');
    if (isOpen) {
      mobileMenu.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
      mobileMenu.classList.add('opacity-100', 'translate-y-0', 'pointer-events-auto');
      hamburgerIcon.classList.add('hidden');
      closeIcon.classList.remove('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'true');
    } else {
      mobileMenu.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
      mobileMenu.classList.remove('opacity-100', 'translate-y-0', 'pointer-events-auto');
      hamburgerIcon.classList.remove('hidden');
      closeIcon.classList.add('hidden');
      mobileMenuBtn.setAttribute('aria-expanded', 'false');
    }
  }

  mobileMenuBtn.addEventListener('click', () => toggleMobileMenu());

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

    toggleHeader.addEventListener('click', () => {
      const isExpanded = !drawer.classList.contains('hidden');

      // Collapse all other services for clean editorial accordions
      serviceCards.forEach(c => {
        const d = c.querySelector('.service-drawer');
        const p = c.querySelector('.service-plus-icon');
        const m = c.querySelector('.service-minus-icon');
        d.classList.add('hidden');
        p.classList.remove('hidden');
        m.classList.add('hidden');
        c.classList.remove('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-lg');
        c.classList.add('bg-[#FAF8F5]', 'border-[#EAE4D9]');
      });

      // If it wasn't expanded before, expand this one
      if (!isExpanded) {
        drawer.classList.remove('hidden');
        plusIcon.classList.add('hidden');
        minusIcon.classList.remove('hidden');
        card.classList.add('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-lg');
        card.classList.remove('bg-[#FAF8F5]', 'border-[#EAE4D9]');
      }
    });
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

  // --- 7. IMAGE LIGHTBOX MODAL ---
  const lightboxModal = document.getElementById('lightbox-modal');
  const lightboxOverlay = document.getElementById('lightbox-overlay');
  const lightboxCloseBtn = document.getElementById('lightbox-close-btn');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCategory = document.getElementById('lightbox-category');
  const lightboxClient = document.getElementById('lightbox-client');
  const lightboxTitle = document.getElementById('lightbox-title');
  const lightboxDescription = document.getElementById('lightbox-description');
  const lightboxDeliverables = document.getElementById('lightbox-deliverables');
  const lightboxInquireBtn = document.getElementById('lightbox-inquire-btn');

  let activeLightboxItem = null;

  function openLightbox(item) {
    activeLightboxItem = item;
    lightboxImg.src = item.image;
    lightboxImg.alt = item.title;
    lightboxCategory.textContent = item.categoryLabel;
    lightboxClient.textContent = item.client;
    lightboxTitle.textContent = item.title;
    lightboxDescription.textContent = item.description;

    // Deliverables tags
    lightboxDeliverables.innerHTML = '';
    if (item.deliverables && item.deliverables.length) {
      item.deliverables.forEach(d => {
        const span = document.createElement('span');
        span.className = 'text-[9px] uppercase tracking-wider text-[#544B44] bg-[#F5F1EA] border border-[#DDD5C7] px-2.5 py-1';
        span.textContent = d;
        lightboxDeliverables.appendChild(span);
      });
    }

    lightboxModal.classList.remove('opacity-0', 'pointer-events-none');
    lightboxModal.classList.add('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightboxModal.classList.add('opacity-0', 'pointer-events-none');
    lightboxModal.classList.remove('opacity-100', 'pointer-events-auto');
    document.body.style.overflow = '';
    activeLightboxItem = null;
  }

  lightboxOverlay.addEventListener('click', closeLightbox);
  lightboxCloseBtn.addEventListener('click', closeLightbox);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !lightboxModal.classList.contains('pointer-events-none')) {
      closeLightbox();
    }
  });

  // Click handler on portfolio & bts cards
  document.querySelectorAll('[data-portfolio-item]').forEach(card => {
    card.addEventListener('click', () => {
      const jsonStr = card.getAttribute('data-portfolio-item');
      if (jsonStr) {
        try {
          const item = JSON.parse(jsonStr);
          openLightbox(item);
        } catch (err) {
          console.error('Error parsing item data:', err);
        }
      }
    });
  });

  lightboxInquireBtn.addEventListener('click', () => {
    if (activeLightboxItem) {
      const serviceSelect = document.getElementById('contact-service');
      if (serviceSelect) {
        serviceSelect.value = 'Custom Multi-Service Scope';
      }
      closeLightbox();
      smoothScrollTo('#contact');
    }
  });

  // --- 8. TESTIMONIALS SLIDER & GRID TOGGLE ---
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
      quote: "I’ve had the absolute pleasure of working with Lexi and Lucci Media on several occasions for content creation days and business branding photo shoots, and every experience has been nothing short of amazing. Lexi has an incredible eye for aesthetics and such a natural talent for capturing the essence of a brand. The photos and content she created were not only visually stunning but also perfectly aligned with my brand’s aesthetic. Beyond her creative skills, Lexi is organized, patient, and full of fresh ideas.",
      author: "Matthew",
      business: "Matthew James Skin Spa",
      serviceMentioned: "Content Days & Branding Shoots"
    },
    {
      highlight: "I’m on my third project with Lucci Media, and the consistency speaks for itself!",
      quote: "She is the best!! She captures the right angles, picks the best tone, creates amazing reels, and the best part is she’s efficient and gets things done! She’s also such a sweet soul and a hard-working mama. I am so excited for our future projects together.",
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
      highlight: "Obsessed is an understatement... the Lucci Media high-end touch that they’re known for.",
      quote: "As a fellow female business owner who prioritizes the client experience, it goes a long way when I’m on the receiving end. After experiencing an exploration call and a CEO Mini shoot with incredible final edits, I decided to bring her on for a year’s worth of content. It still feels like my voice—just with the Lucci Media high-end touch that they're known for. Love me some Lex and Lucci Media!",
      author: "Alyssa",
      business: "Dosed RX",
      serviceMentioned: "Inner Circle Annual Content & Shoots"
    },
    {
      highlight: "She captured 700+ pictures and gave me a lifetime of images for my business.",
      quote: "I can’t say enough great things about Lex and the process of my brand photoshoot. From her gentle manner through messages to the awesome energy in person behind the camera. Not only did she help with posing and angles, but she made me feel so much more confident. I wanted to captivate this new era for myself and she exceeded all expectations.",
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
      highlight: "Lex’s passion to stand out and provide high attention to detail is unmatched.",
      quote: "Lucci Media brought my vision to life during my CEO mini shoot. I am so happy with the energy and quality of work with this team. Lex’s passion to stand out and provide high attention to detail to our projects is what will keep me on board for all my social media needs!",
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

  function renderTestimonial(idx) {
    currentTestimonialIndex = idx;
    const t = testimonials[idx];
    tHighlight.innerHTML = `&ldquo;${t.highlight}&rdquo;`;
    tQuote.textContent = t.quote;
    tAuthor.textContent = t.author;
    tBusiness.textContent = t.business;
    tService.textContent = `Service: ${t.serviceMentioned}`;
    tCounter.textContent = `${String(idx + 1).padStart(2, '0')} / ${String(testimonials.length).padStart(2, '0')}`;

    tDots.forEach((d, i) => {
      if (i === idx) {
        d.className = 'h-1.5 transition-all duration-300 w-8 bg-[#1E1A17]';
      } else {
        d.className = 'h-1.5 transition-all duration-300 w-2 bg-[#DDD5C7] hover:bg-[#A99B87]';
      }
    });
  }

  tPrevBtn.addEventListener('click', () => {
    const nextIdx = (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
    renderTestimonial(nextIdx);
  });

  tNextBtn.addEventListener('click', () => {
    const nextIdx = (currentTestimonialIndex + 1) % testimonials.length;
    renderTestimonial(nextIdx);
  });

  tDots.forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.getAttribute('data-testimonial-dot'), 10);
      renderTestimonial(idx);
    });
  });

  // Toggle Slider vs Grid View
  const toggleViewBtn = document.getElementById('toggle-testimonials-view');
  const sliderView = document.getElementById('testimonials-slider-view');
  const gridView = document.getElementById('testimonials-grid-view');
  const viewText = document.getElementById('view-text');

  toggleViewBtn.addEventListener('click', () => {
    const isShowingGrid = !gridView.classList.contains('hidden');
    if (isShowingGrid) {
      gridView.classList.add('hidden');
      sliderView.classList.remove('hidden');
      viewText.textContent = 'READ ALL 10 TESTIMONIALS';
    } else {
      sliderView.classList.add('hidden');
      gridView.classList.remove('hidden');
      viewText.textContent = 'SLIDESHOW VIEW';
    }
  });

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

    qBtn.addEventListener('click', () => {
      const isOpen = !answerPanel.classList.contains('hidden');

      // Collapse other FAQs
      faqCards.forEach(c => {
        const a = c.querySelector('.faq-answer-panel');
        const p = c.querySelector('.faq-plus-icon');
        const m = c.querySelector('.faq-minus-icon');
        a.classList.add('hidden');
        p.classList.remove('hidden');
        m.classList.add('hidden');
        c.classList.remove('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-sm');
        c.classList.add('bg-[#FAF8F5]', 'border-[#EAE4D9]');
      });

      if (!isOpen) {
        answerPanel.classList.remove('hidden');
        plusIcon.classList.add('hidden');
        minusIcon.classList.remove('hidden');
        card.classList.add('bg-[#FFFFFF]', 'border-[#9E8063]/60', 'shadow-sm');
        card.classList.remove('bg-[#FAF8F5]', 'border-[#EAE4D9]');
      }
    });
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

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const business = businessInput.value.trim();
      const details = detailsInput.value.trim();

      if (!name || !email || !details) {
        contactError.textContent = 'Please fill in your name, email, and project details.';
        contactError.classList.remove('hidden');
        return;
      }

      contactError.classList.add('hidden');
      submitBtnText.textContent = 'PROCESSING APPLICATION...';
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.disabled = false;
        submitBtnText.textContent = 'SUBMIT APPLICATION';

        successClientName.textContent = `Thank you, ${name}.`;
        successClientDesc.textContent = `We have received your project details for ${business || 'your business'}. Lex will review your aesthetic goals and reach out directly within 24-48 hours.`;

        contactForm.classList.add('hidden');
        contactSuccess.classList.remove('hidden');
      }, 700);
    });

    resetContactBtn.addEventListener('click', () => {
      contactForm.reset();
      contactSuccess.classList.add('hidden');
      contactForm.classList.remove('hidden');
    });
  }

  console.log('LUCCI MEDIA pure static JavaScript engine initialized.');
});

