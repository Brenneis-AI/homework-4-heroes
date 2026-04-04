/**
 * Global Navigation — HomeWork 4 Heroes
 * Handles: hamburger toggle, mobile overlay injection, sticky nav scroll,
 *          hero entrance animation, section entrance (IntersectionObserver),
 *          copyright year, newsletter form UX.
 */

(function () {
  'use strict';

  /* ------------------------------------------
     DOM READY GUARD
     ------------------------------------------ */
  function onReady(fn) {
    if (document.readyState !== 'loading') {
      fn();
    } else {
      document.addEventListener('DOMContentLoaded', fn);
    }
  }

  onReady(function () {

    /* ------------------------------------------
       MOBILE NAV OVERLAY — dynamic injection
       ------------------------------------------ */
    var overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', 'Mobile navigation');

    // Determine path depth: root pages use '' prefix, subpages use '../../'
    var isSubpage = window.location.pathname.indexOf('/pages/') !== -1;
    var prefix = isSubpage ? '../../' : '';

    var navLinks = [
      { label: 'Home', href: prefix + 'index.html' },
      { label: 'About', href: prefix + 'pages/about/about.html' },
      { label: 'What We Do', href: prefix + 'pages/what-we-do/what-we-do.html' },
      { label: 'Get Help', href: prefix + 'pages/get-help/get-help.html' },
      { label: 'Volunteer', href: prefix + 'pages/volunteer/volunteer.html' },
      { label: 'Events', href: prefix + 'pages/events/events.html' },
      { label: 'Contact', href: prefix + 'pages/contact/contact.html' }
    ];

    navLinks.forEach(function (item) {
      var a = document.createElement('a');
      a.className = 'nav-overlay__link';
      a.href = item.href;
      a.textContent = item.label;
      overlay.appendChild(a);
    });

    // Donate CTA in overlay
    var donateCta = document.createElement('a');
    donateCta.className = 'btn-primary nav-overlay__cta';
    donateCta.href = prefix + 'pages/donate/donate.html';
    donateCta.textContent = 'Donate';
    overlay.appendChild(donateCta);

    document.body.appendChild(overlay);

    /* ------------------------------------------
       HAMBURGER TOGGLE
       ------------------------------------------ */
    var hamburger = document.querySelector('.hamburger');

    if (hamburger) {
      hamburger.addEventListener('click', function () {
        var isOpen = document.body.classList.toggle('nav-open');
        hamburger.setAttribute('aria-expanded', String(isOpen));
        overlay.setAttribute('aria-hidden', String(!isOpen));
      });
    }

    // Close nav on link click
    var overlayLinks = overlay.querySelectorAll('.nav-overlay__link, .nav-overlay__cta');
    overlayLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        document.body.classList.remove('nav-open');
        if (hamburger) hamburger.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
      });
    });

    // Close nav on Escape key
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        if (hamburger) {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.focus();
        }
        overlay.setAttribute('aria-hidden', 'true');
      }
    });

    /* ------------------------------------------
       STICKY NAV — scroll state class
       ------------------------------------------ */
    var header = document.querySelector('.site-header');

    if (header) {
      var scrollThreshold = 50;

      function handleScroll() {
        if (window.scrollY > scrollThreshold) {
          header.classList.add('site-header--scrolled');
        } else {
          header.classList.remove('site-header--scrolled');
        }
      }

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll(); // Initial check
    }

    /* ------------------------------------------
       HERO ENTRANCE ANIMATION (Design Moment 1)
       ------------------------------------------ */
    var heroElements = document.querySelectorAll('.hero-animate');

    if (heroElements.length > 0) {
      // Small delay to ensure paint before animation
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          heroElements.forEach(function (el) {
            el.classList.add('hero-animate--visible');
          });
        });
      });
    }

    /* ------------------------------------------
       SECTION ENTRANCE ANIMATION (IntersectionObserver)
       ------------------------------------------ */
    var animateSections = document.querySelectorAll('.section-animate');

    if (animateSections.length > 0 && 'IntersectionObserver' in window) {
      var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            sectionObserver.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
      });

      animateSections.forEach(function (section) {
        sectionObserver.observe(section);
      });
    } else {
      // Fallback: show all sections immediately
      animateSections.forEach(function (section) {
        section.classList.add('is-visible');
      });
    }

    /* ------------------------------------------
       COPYRIGHT YEAR
       ------------------------------------------ */
    var yearEl = document.getElementById('copyright-year');
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }

    /* ------------------------------------------
       NEWSLETTER FORM UX (shared across pages)
       ------------------------------------------ */
    var newsletterForms = document.querySelectorAll('.footer-newsletter__form');

    newsletterForms.forEach(function (form) {
      form.addEventListener('submit', function (e) {
        // Netlify handles form submissions; this provides inline UX feedback
        var successMsg = form.parentElement.querySelector('.footer-newsletter__msg--success');
        var errorMsg = form.parentElement.querySelector('.footer-newsletter__msg--error');

        if (successMsg) successMsg.style.display = 'none';
        if (errorMsg) errorMsg.style.display = 'none';
      });
    });

    /* ------------------------------------------
       ACCORDION TOGGLE (FAQ sections, shared)
       ------------------------------------------ */
    var accordionButtons = document.querySelectorAll('.accordion__trigger');

    accordionButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.getAttribute('aria-controls'));
        var isExpanded = btn.getAttribute('aria-expanded') === 'true';

        btn.setAttribute('aria-expanded', String(!isExpanded));
        if (panel) {
          panel.hidden = isExpanded;
        }
      });
    });

  });
})();
