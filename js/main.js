// DOM Elements - with null checks
const hamburger = document.querySelector(".pasco-hamburger");
const navMenu = document.querySelector(".pasco-nav-menu");
const navNumbers = document.querySelectorAll(".pasco-nav-number");
const slides = document.querySelectorAll(".pasco-slide");
const slideContents = document.querySelectorAll(".pasco-slide-content");
const header = document.getElementById("header");

let currentSlide = 0;
let slideInterval;

// Mobile Navigation Toggle
if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });
}

// Close mobile menu when clicking on a nav link
document.querySelectorAll(".pasco-nav-link").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Initialize Slider
function initSlider() {
  // Set background images for slides
  slides.forEach((slide) => {
    const bgImage = slide.dataset.bg;
    slide.style.backgroundImage = `url(${bgImage})`;
  });

  // Start auto slider
  startAutoSlider();
}

// Show specific slide
function showSlide(index) {
  // Remove active class from all slides and nav numbers
  slides.forEach((slide) => slide.classList.remove("active"));
  navNumbers.forEach((nav) => nav.classList.remove("active"));

  // Add active class to current slide and nav number
  slides[index].classList.add("active");
  navNumbers[index].classList.add("active");

  currentSlide = index;
}

// Next slide
function nextSlide() {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}

// Start auto slider
function startAutoSlider() {
  slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
}

// Stop auto slider
function stopAutoSlider() {
  clearInterval(slideInterval);
}

// Navigation number click events
if (navNumbers.length > 0) {
  navNumbers.forEach((navNumber, index) => {
    navNumber.addEventListener("click", () => {
      stopAutoSlider();
      showSlide(index);
      setTimeout(startAutoSlider, 5000); // Restart auto slider after 5 seconds
    });
  });
}

// Mouse tracking effect for slide content
if (header) {
  header.addEventListener("mousemove", (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;

    // Calculate mouse position as percentage
    const xPercent = (clientX / innerWidth - 0.5) * 2; // -1 to 1
    const yPercent = (clientY / innerHeight - 0.5) * 2; // -1 to 1

    // Apply subtle movement to active slide content
    const activeSlideContent = document.querySelector(
      ".pasco-slide.active .pasco-slide-content"
    );
    if (activeSlideContent) {
      const moveX = xPercent * 10; // Adjust multiplier for more/less movement
      const moveY = yPercent * 10;

      activeSlideContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
  });

  // Reset slide content position when mouse leaves header
  header.addEventListener("mouseleave", () => {
    const activeSlideContent = document.querySelector(
      ".pasco-slide.active .pasco-slide-content"
    );
    if (activeSlideContent) {
      activeSlideContent.style.transform = "translate(0, 0)";
    }
  });
}

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".pasco-navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
    navbar.style.backdropFilter = "blur(10px)";
  } else {
    navbar.style.background = "var(--white)";
    navbar.style.backdropFilter = "none";
  }
});

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initSlider();

  // Add loading animation
  document.body.style.opacity = "0";
  setTimeout(() => {
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  }, 100);
});

// Keyboard navigation for slides
document.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") {
    stopAutoSlider();
    currentSlide = currentSlide > 0 ? currentSlide - 1 : slides.length - 1;
    showSlide(currentSlide);
    setTimeout(startAutoSlider, 5000);
  } else if (e.key === "ArrowRight") {
    stopAutoSlider();
    nextSlide();
    setTimeout(startAutoSlider, 5000);
  }
});

// Pause auto slider when tab is not visible
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    stopAutoSlider();
  } else {
    startAutoSlider();
  }
});

// Project Tabs Functionality
function initProjectTabs() {
  const tabButtons = document.querySelectorAll(".project-tab-btn");
  const projectItems = document.querySelectorAll(".project-item");

  // Exit early if elements don't exist
  if (!tabButtons.length || !projectItems.length) {
    return;
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const category = button.dataset.category;

      // Remove active class from all buttons
      tabButtons.forEach((btn) => btn.classList.remove("active"));

      // Add active class to clicked button
      button.classList.add("active");

      // Filter projects
      projectItems.forEach((item) => {
        if (category === "all") {
          // For "All Projects" tab, show only the original 6 projects
          if (item.classList.contains("original-project")) {
            item.style.display = "block";
            item.style.animation = "fadeInUp 0.5s ease forwards";
          } else {
            item.style.display = "none";
          }
        } else if (item.dataset.category === category) {
          // For specific category tabs, show all projects including additional ones
          item.style.display = "block";
          item.style.animation = "fadeInUp 0.5s ease forwards";
        } else {
          item.style.display = "none";
        }
      });
    });
  });
}

// Statistics Counter Animation
function animateCounters() {
  const counters = document.querySelectorAll(".stat-number");

  // Exit if no counters found
  if (!counters.length) {
    return;
  }

  const animateCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));

    // Check if target is valid
    if (isNaN(target) || target <= 0) {
      return;
    }

    const duration = 2000; // 2 seconds
    const increment = target / (duration / 16); // 60fps
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      counter.textContent = Math.floor(current) + "+";
    }, 16);
  };

  // Use Intersection Observer for scroll-triggered animation
  const options = {
    threshold: 0.1, // Trigger when 10% visible
    rootMargin: "50px", // Trigger 50px before element comes into view
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Stop observing once animated
      }
    });
  }, options);

  // Observe all counters
  counters.forEach((counter) => {
    observer.observe(counter);
  });

  // Fallback: Also trigger animation after a short delay if elements are already visible
  setTimeout(() => {
    counters.forEach((counter) => {
      const rect = counter.getBoundingClientRect();
      const isVisible = rect.top >= 0 && rect.top <= window.innerHeight;

      if (isVisible && counter.textContent === "0") {
        animateCounter(counter);
      }
    });
  }, 500);
}

// Pasco Testimonials Carousel
let pascoCurrentTestimonial = 0;
let pascoTestimonialInterval;

function initPascoTestimonialsCarousel() {
  const track = document.getElementById("pascoTestimonialTrack");
  const slides = document.querySelectorAll(".pasco-testimonial-slide");
  const dots = document.querySelectorAll(".pasco-testimonial-dot");
  const prevBtn = document.getElementById("pascoTestimonialPrev");
  const nextBtn = document.getElementById("pascoTestimonialNext");

  if (!track || !slides.length) return;

  function showPascoTestimonial(index) {
    // Calculate transform value
    const translateX = -index * 100;
    track.style.transform = `translateX(${translateX}%)`;

    // Update active states
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === index);
    });

    pascoCurrentTestimonial = index;
  }

  function nextPascoTestimonial() {
    const nextIndex = (pascoCurrentTestimonial + 1) % slides.length;
    showPascoTestimonial(nextIndex);
  }

  function prevPascoTestimonial() {
    const prevIndex =
      (pascoCurrentTestimonial - 1 + slides.length) % slides.length;
    showPascoTestimonial(prevIndex);
  }

  function startPascoTestimonialAutoplay() {
    pascoTestimonialInterval = setInterval(nextPascoTestimonial, 6000); // Change every 6 seconds
  }

  function stopPascoTestimonialAutoplay() {
    clearInterval(pascoTestimonialInterval);
  }

  // Event listeners
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      nextPascoTestimonial();
      stopPascoTestimonialAutoplay();
      startPascoTestimonialAutoplay(); // Restart autoplay
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      prevPascoTestimonial();
      stopPascoTestimonialAutoplay();
      startPascoTestimonialAutoplay(); // Restart autoplay
    });
  }

  // Dot navigation
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
      showPascoTestimonial(index);
      stopPascoTestimonialAutoplay();
      startPascoTestimonialAutoplay(); // Restart autoplay
    });
  });

  // Touch/Swipe support for mobile
  let startX = 0;
  let isDragging = false;

  track.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
    stopPascoTestimonialAutoplay();
  });

  track.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    e.preventDefault();
  });

  track.addEventListener("touchend", (e) => {
    if (!isDragging) return;
    isDragging = false;

    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (Math.abs(diffX) > 50) {
      // Minimum swipe distance
      if (diffX > 0) {
        nextPascoTestimonial();
      } else {
        prevPascoTestimonial();
      }
    }

    startPascoTestimonialAutoplay(); // Restart autoplay
  });

  // Pause autoplay on hover
  const carousel = document.querySelector(
    ".pasco-testimonials-carousel-container"
  );
  if (carousel) {
    carousel.addEventListener("mouseenter", stopPascoTestimonialAutoplay);
    carousel.addEventListener("mouseleave", startPascoTestimonialAutoplay);
  }

  // Initialize
  showPascoTestimonial(0);
  startPascoTestimonialAutoplay();
}

// Smooth Scroll Animation System
function initScrollAnimations() {
  // Get all elements with scroll-animate class
  const animatedElements = document.querySelectorAll(".scroll-animate");

  if (!animatedElements.length) return;

  // Create intersection observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px", // Trigger animation 50px before element enters viewport
  };

  const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Add animated class to trigger the animation
        entry.target.classList.add("animated");

        // Stop observing this element once it's animated
        scrollObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe all animated elements
  animatedElements.forEach((element) => {
    scrollObserver.observe(element);
  });
}

// Enhanced smooth scrolling for navigation links
function initSmoothScrolling() {
  // Enhanced smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));

      if (target) {
        // Calculate offset for fixed navbar
        const navHeight =
          document.querySelector(".pasco-navbar")?.offsetHeight || 0;
        const targetPosition = target.offsetTop - navHeight - 20;

        // Smooth scroll with easing
        window.scrollTo({
          top: targetPosition,
          behavior: "smooth",
        });
      }
    });
  });
}

// Lazy loading enhancement for images
function initLazyLoading() {
  const images = document.querySelectorAll("img[data-src]");

  if (!images.length) return;

  const imageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.add("loaded");
          imageObserver.unobserve(img);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "50px",
    }
  );

  images.forEach((img) => {
    imageObserver.observe(img);
  });
}

// Parallax scrolling effect for hero section
function initParallaxEffect() {
  const parallaxElements = document.querySelectorAll(".parallax-element");

  if (!parallaxElements.length) return;

  let ticking = false;

  function updateParallax() {
    const scrollY = window.pageYOffset;

    parallaxElements.forEach((element) => {
      const speed = element.dataset.speed || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });

    ticking = false;
  }

  function requestTick() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestTick);
}

// Portfolio Gallery Functionality
let currentImageIndex = 0;
const portfolioImages = [
  {
    src: "images/project-1.jpg",
    title: "Modern Family Home",
    description:
      "Complete residential construction project with modern design and high-quality finishes",
  },
  {
    src: "images/project-3.jpg",
    title: "Corporate Office Complex",
    description:
      "Commercial office building featuring contemporary architecture and professional workspace design",
  },
  {
    src: "images/project-4.jpg",
    title: "Kitchen Transformation",
    description:
      "Complete kitchen renovation with modern appliances, custom cabinetry, and premium countertops",
  },
  {
    src: "images/project-5.jpg",
    title: "Luxury Villa Estate",
    description:
      "High-end residential construction featuring luxury amenities and sophisticated architectural details",
  },
  {
    src: "images/project-6.jpg",
    title: "Industrial Warehouse",
    description:
      "Large-scale industrial construction project with advanced structural engineering solutions",
  },
  {
    src: "images/projec-image-4.jpg",
    title: "Retail Development",
    description:
      "Modern retail complex designed for optimal customer experience and commercial functionality",
  },
  {
    src: "images/project-image-5.jpg",
    title: "Custom Home Build",
    description:
      "Bespoke residential construction tailored to client specifications with premium materials",
  },
  {
    src: "images/project-image-6.jpg",
    title: "Bathroom Renovation",
    description:
      "Luxury bathroom remodel featuring spa-like amenities and high-end finishes",
  },
  {
    src: "images/project-image-7.jpg",
    title: "Manufacturing Facility",
    description:
      "Industrial manufacturing plant construction with specialized equipment integration",
  },
  {
    src: "images/project-image-8.jpg",
    title: "Shopping Center",
    description:
      "Multi-tenant retail development with modern design and optimized traffic flow",
  },
];

function initPortfolioGallery() {
  const portfolioItems = document.querySelectorAll(".portfolio-item");
  const modal = document.getElementById("portfolioModal");
  const videoModal = document.getElementById("videoModal");
  const modalImage = document.getElementById("portfolioModalImage");
  const modalTitle = document.getElementById("portfolioModalTitle");
  const modalDescription = document.getElementById("portfolioModalDescription");
  const modalCounter = document.getElementById("portfolioModalCounter");
  const prevBtn = document.getElementById("portfolioPrevBtn");
  const nextBtn = document.getElementById("portfolioNextBtn");

  // Video modal elements
  const videoModalTitle = document.getElementById("videoModalTitle");
  const videoModalDescription = document.getElementById(
    "videoModalDescription"
  );
  const videoIframe = document.getElementById("videoIframe");

  if (!portfolioItems.length) return;

  // Video data
  const videoData = {
    "construction-process": {
      title: "Construction Process",
      description:
        "Watch our professional team in action as we transform spaces with precision, quality craftsmanship, and attention to detail. From foundation to finishing touches, see how we bring your vision to life.",
      src: "videos/video-1.mp4",
    },
    "transformation-showcase": {
      title: "Before & After Transformation",
      description:
        "Witness incredible property transformations that showcase our expertise in renovation and remodeling. See how we turn outdated spaces into modern, functional, and beautiful environments.",
      src: "videos/video-2.mp4",
    },
  };

  // Add click event to portfolio items
  portfolioItems.forEach((item, index) => {
    item.addEventListener("click", () => {
      const videoContainer = item.querySelector("[data-video-id]");

      if (videoContainer && item.classList.contains("portfolio-video")) {
        // Handle video items
        const videoId = videoContainer.getAttribute("data-video-id");
        const video = videoData[videoId];

        if (video && videoModal) {
          if (videoModalTitle) videoModalTitle.textContent = video.title;
          if (videoModalDescription)
            videoModalDescription.textContent = video.description;
          if (videoIframe) videoIframe.src = video.src;

          const bootstrapVideoModal = new bootstrap.Modal(videoModal);
          bootstrapVideoModal.show();
        }
      } else {
        // Handle regular image items
        if (modal) {
          currentImageIndex = index;
          showPortfolioImage(currentImageIndex);
          const bootstrapModal = new bootstrap.Modal(modal);
          bootstrapModal.show();
        }
      }
    });
  });

  // Close video modal event - stop video
  if (videoModal) {
    videoModal.addEventListener("hidden.bs.modal", function () {
      if (videoIframe) {
        videoIframe.src = "";
      }
    });
  }

  // Navigation button events
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentImageIndex =
        (currentImageIndex - 1 + portfolioImages.length) %
        portfolioImages.length;
      showPortfolioImage(currentImageIndex);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
      showPortfolioImage(currentImageIndex);
    });
  }

  // Keyboard navigation
  document.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("show")) return;

    if (e.key === "ArrowLeft") {
      currentImageIndex =
        (currentImageIndex - 1 + portfolioImages.length) %
        portfolioImages.length;
      showPortfolioImage(currentImageIndex);
    } else if (e.key === "ArrowRight") {
      currentImageIndex = (currentImageIndex + 1) % portfolioImages.length;
      showPortfolioImage(currentImageIndex);
    }
  });

  function showPortfolioImage(index) {
    const imageData = portfolioImages[index];

    if (modalImage) {
      modalImage.src = imageData.src;
      modalImage.alt = imageData.title;
    }

    if (modalTitle) {
      modalTitle.textContent = imageData.title;
    }

    if (modalDescription) {
      modalDescription.textContent = imageData.description;
    }

    if (modalCounter) {
      modalCounter.textContent = `${index + 1} of ${portfolioImages.length}`;
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
  // Only initialize project tabs if they exist (homepage only)
  if (document.querySelector(".project-tab-btn")) {
    initProjectTabs();
  }

  // Always initialize counters (works on both homepage and services page)
  animateCounters();

  // Only initialize testimonials carousel if it exists (homepage only)
  if (document.getElementById("pascoTestimonialTrack")) {
    initPascoTestimonialsCarousel();
  }

  // Initialize scroll animations
  initScrollAnimations();

  // Initialize smooth scrolling
  initSmoothScrolling();

  // Initialize lazy loading
  initLazyLoading();

  // Initialize parallax effects
  initParallaxEffect();

  // Initialize portfolio gallery (portfolio page only)
  if (document.querySelector(".portfolio-item")) {
    initPortfolioGallery();
  }

  // Initialize back to top button
  initBackToTop();
});

// Back to Top Button Functionality
function initBackToTop() {
  const backToTopBtn = document.getElementById("backToTop");

  if (!backToTopBtn) return;

  // Show/hide button based on scroll position
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 300) {
      backToTopBtn.classList.add("show");
    } else {
      backToTopBtn.classList.remove("show");
    }
  });

  // Smooth scroll to top when clicked
  backToTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

//contact page forms integration
const form = document.getElementById("contactForm");
const result = document.getElementById("result");

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(form);
  const object = Object.fromEntries(formData);
  const json = JSON.stringify(object);
  result.innerHTML = "Please wait.. Your form is being submitted.";

  fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: json,
  })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        result.innerHTML =
          "Thank you! Your Message has been sent successfully.";
      } else {
        console.log(response);
        result.innerHTML = json.message;
      }
    })
    .catch((error) => {
      console.log(error);
      result.innerHTML = "Oops! There was a problem submitting your form.";
    })
    .then(function () {
      form.reset();
      setTimeout(() => {
        result.style.display = "none";
      }, 3000);
    });
});
