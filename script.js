const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const contactForm = document.querySelector("#contact-form");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelector("#current-year").textContent = new Date().getFullYear();

function updateHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
}

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

navToggle.addEventListener("click", () => {
  const isExpanded = navToggle.getAttribute("aria-expanded") === "true";
  navToggle.setAttribute("aria-expanded", String(!isExpanded));
  navToggle.setAttribute("aria-label", isExpanded ? "Open navigation" : "Close navigation");
  navLinks.classList.toggle("is-open", !isExpanded);
});

navLinks.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("is-open");
  }
});

contactForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const status = document.querySelector("#contact-status");
  const submitButton = contactForm.querySelector('[type="submit"]');
  const originalButtonText = submitButton.innerHTML;

  function showEmailFallback(message) {
    const emailLink = document.createElement("a");
    emailLink.href = "mailto:seongchunlaw050@gmail.com";
    emailLink.textContent = "Email Daniel directly.";
    status.replaceChildren(document.createTextNode(`${message} `), emailLink);
  }

  submitButton.disabled = true;
  submitButton.textContent = "Sending...";
  status.textContent = "";

  try {
    const response = await fetch(contactForm.action, {
      method: "POST",
      body: new FormData(contactForm),
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      showEmailFallback("Your message couldn’t be sent. Please try again or");
      return;
    }

    contactForm.reset();
    status.textContent = "Thanks! Your message has been sent.";
  } catch (error) {
    console.error("Contact form submission failed:", error);
    showEmailFallback("We couldn’t connect to the form service. Please try again or");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML = originalButtonText;
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open navigation");
    navLinks.classList.remove("is-open");
  }
});

const roles = ["web development", "useful software", "thoughtful interfaces", "learning by building"];
let roleIndex = 0;
const roleText = document.querySelector("#role-text");

if (!reduceMotion) {
  window.setInterval(() => {
    roleText.classList.add("role-changing");
    window.setTimeout(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      roleText.textContent = roles[roleIndex];
      roleText.classList.remove("role-changing");
    }, 180);
  }, 2800);
}

if ("IntersectionObserver" in window && !reduceMotion) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  document.querySelectorAll(".section-heading, .about-note, .about-copy, .about-facts, .expertise-card, .skills-board, .project-card, .contact-inner > *")
    .forEach((element) => {
      element.classList.add("reveal");
      revealObserver.observe(element);
    });
}
