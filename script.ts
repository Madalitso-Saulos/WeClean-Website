/* ===========================================================
   WeClean Services — Interactive functionality
=========================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  window.addEventListener('load', () => {
    setTimeout(() => preloader?.classList.add('hide'), 350);
  });
  // Fallback in case 'load' already fired
  setTimeout(() => preloader?.classList.add('hide'), 2200);

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.querySelector<HTMLElement>('.cursor-dot');
  const cursorRing = document.querySelector<HTMLElement>('.cursor-ring');
  let mouseX = 0, mouseY = 0, ringX = 0, ringY = 0;

  window.addEventListener('mousemove', (e: MouseEvent) => {
    mouseX = e.clientX; mouseY = e.clientY;
    if (cursorDot) { cursorDot.style.left = `${mouseX}px`; cursorDot.style.top = `${mouseY}px`; }
  });

  function animateRing(): void {
    ringX += (mouseX - ringX) * 0.18;
    ringY += (mouseY - ringY) * 0.18;
    if (cursorRing) { cursorRing.style.left = `${ringX}px`; cursorRing.style.top = `${ringY}px`; }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, input, textarea, select').forEach((el) => {
    el.addEventListener('mouseenter', () => cursorRing?.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorRing?.classList.remove('grow'));
  });

  /* ---------- Scroll progress bar ---------- */
  const progressBar = document.getElementById('scrollProgress');
  function updateProgress(): void {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = `${pct}%`;
  }

  /* ---------- Navbar scroll state ---------- */
  const siteNav = document.getElementById('siteNav');
  function updateNav(): void {
    if (window.scrollY > 60) siteNav?.classList.add('scrolled');
    else siteNav?.classList.remove('scrolled');
  }

  /* ---------- Back to top ---------- */
  const backToTop = document.getElementById('backToTop');
  function updateBackToTop(): void {
    if (window.scrollY > 500) backToTop?.classList.add('show');
    else backToTop?.classList.remove('show');
  }
  backToTop?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  window.addEventListener('scroll', () => {
    updateProgress();
    updateNav();
    updateBackToTop();
  }, { passive: true });
  updateProgress(); updateNav(); updateBackToTop();

  /* ---------- Mobile hamburger menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  hamburger?.addEventListener('click', () => {
    const isOpen = navLinks?.classList.toggle('open');
    hamburger.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(!!isOpen));
  });
  document.querySelectorAll('#navLinks .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      hamburger?.classList.remove('open');
      hamburger?.setAttribute('aria-expanded', 'false');
    });
  });

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll<HTMLElement>('section[id]');
  const navAnchors = document.querySelectorAll<HTMLAnchorElement>('.nav-link');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach((a) => {
          a.classList.toggle('active-link', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach((s) => sectionObserver.observe(s));

  /* ---------- Scroll-reveal animations ---------- */
  const revealTargets = document.querySelectorAll<HTMLElement>(
    '.reveal-left, .reveal-right, .service-card.reveal-up, .why-card.reveal-up, .timeline-step.reveal-up, .gallery-item.reveal-up'
  );
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealTargets.forEach((t) => revealObserver.observe(t));

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll<HTMLElement>('.stat-num');
  function animateCounter(el: HTMLElement): void {
    const target = parseInt(el.dataset.count || '0', 10);
    const suffix = el.dataset.suffix || '';
    const duration = 1600;
    const startTime = performance.now();

    function tick(now: number): void {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(target * eased);
      el.textContent = `${value}${suffix}`;
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target as HTMLElement);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach((c) => counterObserver.observe(c));

  /* ---------- Gallery lightbox ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg') as HTMLImageElement | null;
  const lightboxClose = document.getElementById('lightboxClose');

  document.querySelectorAll<HTMLButtonElement>('.gallery-item').forEach((item) => {
    item.addEventListener('click', () => {
      const full = item.dataset.full;
      const img = item.querySelector('img');
      if (lightboxImg && full) {
        lightboxImg.src = full;
        lightboxImg.alt = img?.alt || '';
      }
      lightbox?.classList.add('open');
      lightbox?.setAttribute('aria-hidden', 'false');
    });
  });

  function closeLightbox(): void {
    lightbox?.classList.remove('open');
    lightbox?.setAttribute('aria-hidden', 'true');
  }
  lightboxClose?.addEventListener('click', closeLightbox);
  lightbox?.addEventListener('click', (e: Event) => {
    if (e.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ---------- Testimonial slider ---------- */
  const track = document.getElementById('testimonialTrack');
  const dotsWrap = document.getElementById('testimonialDots');
  const cards = document.querySelectorAll('.testimonial-card');
  let current = 0;
  let autoplay: ReturnType<typeof setInterval>;

  if (track && dotsWrap && cards.length) {
    cards.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => goToSlide(i));
      dotsWrap.appendChild(dot);
    });

    function goToSlide(index: number): void {
      current = index;
      (track as HTMLElement).style.transform = `translateX(-${index * 100}%)`;
      dotsWrap?.querySelectorAll('button').forEach((d, i) => d.classList.toggle('active', i === index));
    }

    function nextSlide(): void {
      goToSlide((current + 1) % cards.length);
    }

    autoplay = setInterval(nextSlide, 5000);
    track.addEventListener('mouseenter', () => clearInterval(autoplay));
    track.addEventListener('mouseleave', () => { autoplay = setInterval(nextSlide, 5000); });
  }

  /* ---------- Contact form validation + submission ---------- */
  const form = document.getElementById('contactForm') as HTMLFormElement | null;
  const formStatus = document.getElementById('formStatus');
  const submitBtn = form?.querySelector<HTMLButtonElement>('.form-submit');

  function setError(fieldName: string, message: string): void {
    const errorEl = form?.querySelector<HTMLElement>(`.form-error[data-for="${fieldName}"]`);
    const row = errorEl?.closest('.form-row');
    if (errorEl) errorEl.textContent = message;
    if (message) row?.classList.add('invalid'); else row?.classList.remove('invalid');
  }

  function validateForm(data: Record<string, string>): boolean {
    let valid = true;

    if (!data.fullName || data.fullName.trim().length < 2) {
      setError('fullName', 'Please enter your full name.'); valid = false;
    } else setError('fullName', '');

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailPattern.test(data.email)) {
      setError('email', 'Please enter a valid email address.'); valid = false;
    } else setError('email', '');

    const phonePattern = /^[0-9+()\s-]{7,}$/;
    if (!data.phone || !phonePattern.test(data.phone)) {
      setError('phone', 'Please enter a valid phone number.'); valid = false;
    } else setError('phone', '');

    if (!data.service) {
      setError('service', 'Please select a service.'); valid = false;
    } else setError('service', '');

    return valid;
  }

  form?.addEventListener('submit', async (e: SubmitEvent) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data: Record<string, string> = {
      fullName: String(formData.get('fullName') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      service: String(formData.get('service') || ''),
      message: String(formData.get('message') || ''),
    };

    if (!validateForm(data)) {
      if (formStatus) {
        formStatus.textContent = 'Please fix the highlighted fields.';
        formStatus.className = 'form-status error';
      }
      return;
    }

    submitBtn?.classList.add('loading');
    if (formStatus) { formStatus.textContent = ''; formStatus.className = 'form-status'; }

    try {
      const response = await fetch(form.action, { method: 'POST', body: formData });
      const result = await response.json().catch(() => ({ success: response.ok }));

      if (response.ok && result.success !== false) {
        if (formStatus) {
          formStatus.textContent = 'Thank you! We will get back to you shortly.';
          formStatus.className = 'form-status success';
        }
        form.reset();
      } else {
        throw new Error(result.message || 'Submission failed');
      }
    } catch (err) {
      if (formStatus) {
        formStatus.textContent = 'Something went wrong. Please call or WhatsApp us directly.';
        formStatus.className = 'form-status error';
      }
    } finally {
      submitBtn?.classList.remove('loading');
    }
  });

});
