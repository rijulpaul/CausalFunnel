// ============================
// JavaScript for TechFlow Website
// ============================

// Wait for the DOM to be fully loaded before executing JavaScript
document.addEventListener("DOMContentLoaded", function () {
  // ============================
  // Mobile Navigation Toggle
  // ============================

  // Get references to hamburger menu and navigation menu
  const hamburger = document.querySelector(".hamburger");
  const navMenu = document.querySelector(".nav-menu");

  // Add click event listener to hamburger menu
  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      // Toggle the 'active' class on the navigation menu
      navMenu.classList.toggle("active");

      // Animate hamburger bars to form an X
      hamburger.classList.toggle("active");
    });

    // Close mobile menu when clicking on a nav link
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach((link) => {
      link.addEventListener("click", function () {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // ============================
  // Smooth Scrolling for Anchor Links
  // ============================

  // Get all anchor links that start with #
  const smoothScrollLinks = document.querySelectorAll('a[href^="#"]');

  smoothScrollLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      // Get the target element
      const targetId = this.getAttribute("href").substring(1);
      const targetElement = document.getElementById(targetId);

      if (targetElement) {
        // Calculate offset for fixed navbar
        const navbarHeight = document.querySelector(".navbar").offsetHeight;
        const targetPosition = targetElement.offsetTop - navbarHeight;

        // Smooth scroll to target
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  // ============================
  // Navbar Background on Scroll
  // ============================

  // Change navbar appearance when scrolling
  const navbar = document.querySelector(".navbar");

  if (navbar) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 100) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.15)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)";
      }
    });
  }

  // ============================
  // Active Navigation Link Highlighting
  // ============================

  // Highlight the current section in navigation
  const sections = document.querySelectorAll("section[id]");
  const navLinksForHighlight = document.querySelectorAll(
    '.nav-link[href^="#"]'
  );

  if (sections.length > 0 && navLinksForHighlight.length > 0) {
    window.addEventListener("scroll", function () {
      let current = "";
      const scrollPosition = window.scrollY + 200; // Offset for better detection

      sections.forEach((section) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (
          scrollPosition >= sectionTop &&
          scrollPosition < sectionTop + sectionHeight
        ) {
          current = section.getAttribute("id");
        }
      });

      // Remove active class from all nav links
      navLinksForHighlight.forEach((link) => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) {
          link.classList.add("active");
        }
      });
    });
  }

  // ============================
  // Contact Form Handling
  // ============================

  // Handle contact form submission
  const contactForm = document.getElementById("contactForm");
  const formSuccess = document.getElementById("formSuccess");

  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault(); // Prevent actual form submission

      // Get form data
      const formData = new FormData(contactForm);
      const firstName = formData.get("firstName");
      const lastName = formData.get("lastName");
      const email = formData.get("email");
      const message = formData.get("message");

      // Basic form validation
      if (!firstName || !lastName || !email || !message) {
        showFormMessage("Please fill in all required fields.", "error");
        return;
      }

      // Email validation
      if (!isValidEmail(email)) {
        showFormMessage("Please enter a valid email address.", "error");
        return;
      }

      // Simulate form submission (in a real application, you would send this to a server)
      simulateFormSubmission(formData);
    });
  }

  // Function to validate email format
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to simulate form submission
  function simulateFormSubmission(formData) {
    // Show loading state
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;

    // Simulate server delay
    setTimeout(function () {
      // Hide form and show success message
      contactForm.style.display = "none";
      formSuccess.style.display = "block";

      // Log form data (in a real app, this would be sent to a server)
      console.log("Form submitted with data:", Object.fromEntries(formData));

      // Reset form after a delay
      setTimeout(function () {
        contactForm.reset();
        contactForm.style.display = "block";
        formSuccess.style.display = "none";
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 5000);
    }, 2000);
  }

  // Function to show form messages
  function showFormMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll(".form-message");
    existingMessages.forEach((msg) => msg.remove());

    // Create message element
    const messageDiv = document.createElement("div");
    messageDiv.className = `form-message ${type}`;
    messageDiv.innerHTML = `<p>${message}</p>`;

    // Insert message after form
    contactForm.insertAdjacentElement("afterend", messageDiv);

    // Remove message after 5 seconds
    setTimeout(function () {
      messageDiv.remove();
    }, 5000);
  }

  // ============================
  // Animated Counter for Statistics
  // ============================

  // Animate statistics numbers when they come into view
  const statNumbers = document.querySelectorAll(".stat-number");

  if (statNumbers.length > 0) {
    // Create intersection observer for animations
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target); // Only animate once
        }
      });
    });

    // Observe all stat numbers
    statNumbers.forEach((stat) => {
      observer.observe(stat);
    });
  }

  // Function to animate counter numbers
  function animateCounter(element) {
    const target = element.textContent;
    const isNumber = /^\d+$/.test(target);

    if (isNumber) {
      const targetNumber = parseInt(target);
      const duration = 2000; // 2 seconds
      const increment = targetNumber / (duration / 16); // 60fps
      let current = 0;

      const updateCounter = () => {
        current += increment;
        if (current < targetNumber) {
          element.textContent = Math.floor(current);
          requestAnimationFrame(updateCounter);
        } else {
          element.textContent = targetNumber;
        }
      };

      element.textContent = "0";
      updateCounter();
    }
  }

  // ============================
  // Scroll-triggered Animations
  // ============================

  // Add fade-in animations to elements as they come into view
  const animatedElements = document.querySelectorAll(
    ".service-card, .team-member, .mv-card, .faq-item"
  );

  if (animatedElements.length > 0) {
    // Add initial styles
    animatedElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    // Create intersection observer for animations
    const animationObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }
        });
      },
      {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: "0px 0px -50px 0px", // Trigger slightly before element is fully visible
      }
    );

    // Observe all animated elements
    animatedElements.forEach((element) => {
      animationObserver.observe(element);
    });
  }

  // ============================
  // Back to Top Button
  // ============================

  // Create and add back to top button
  const backToTopButton = document.createElement("button");
  backToTopButton.innerHTML = "↑";
  backToTopButton.className = "back-to-top";
  backToTopButton.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #3498db;
        color: white;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
    `;

  document.body.appendChild(backToTopButton);

  // Show/hide back to top button based on scroll position
  window.addEventListener("scroll", function () {
    if (window.scrollY > 500) {
      backToTopButton.style.opacity = "1";
      backToTopButton.style.visibility = "visible";
    } else {
      backToTopButton.style.opacity = "0";
      backToTopButton.style.visibility = "hidden";
    }
  });

  // Add click event to back to top button
  backToTopButton.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  // ============================
  // Form Input Enhancement
  // ============================

  // Add floating label effect to form inputs
  const formInputs = document.querySelectorAll(
    ".form-group input, .form-group textarea, .form-group select"
  );

  formInputs.forEach((input) => {
    // Add focus and blur event listeners
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused");
    });

    input.addEventListener("blur", function () {
      if (this.value === "") {
        this.parentElement.classList.remove("focused");
      }
    });

    // Check if input has value on page load
    if (input.value !== "") {
      input.parentElement.classList.add("focused");
    }
  });

  // ============================
  // Loading Animation
  // ============================

  // Show loading animation for images (if any real images are added)
  const imageContainers = document.querySelectorAll(".image-placeholder");

  imageContainers.forEach((container) => {
    // Add loading animation
    container.style.position = "relative";
    container.style.overflow = "hidden";

    // Create shimmer effect
    const shimmer = document.createElement("div");
    shimmer.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            animation: shimmer 2s infinite;
        `;

    container.appendChild(shimmer);
  });

  // Add shimmer animation to CSS
  if (!document.querySelector("#shimmer-style")) {
    const shimmerStyle = document.createElement("style");
    shimmerStyle.id = "shimmer-style";
    shimmerStyle.textContent = `
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
    document.head.appendChild(shimmerStyle);
  }
});

// ============================
// Utility Functions
// ============================

// Function to detect if user prefers reduced motion
function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

// Function to debounce events (useful for scroll events)
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Function to throttle events (useful for scroll events)
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Export functions for use in other scripts (if needed)
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
    prefersReducedMotion,
  };
}
