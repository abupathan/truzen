// truzen.js
// Shared JS for all Truzen Consulting pages
// Requires: Bootstrap 5 bundle (for dropdowns, modal, etc.)

(function () {
  // Load HTML partials into elements with data-include="path"
  function loadIncludes() {
    var includeEls = document.querySelectorAll("[data-include]");
    if (!includeEls.length) {
      return Promise.resolve();
    }

    var promises = [];
    includeEls.forEach(function (el) {
      var src = el.getAttribute("data-include");
      if (!src) return;

      var p = fetch(src)
        .then(function (resp) {
          if (!resp.ok) {
            // Fail silently but avoid breaking the chain
            return "";
          }
          return resp.text();
        })
        .then(function (html) {
          el.innerHTML = html;
        })
        .catch(function () {
          // On error, leave the element empty
        });

      promises.push(p);
    });

    return Promise.all(promises);
  }

  function initFooterYear() {
    var yearEl = document.getElementById("tz-year");
    if (yearEl) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  function initNavActive() {
    try {
      var currentPath = window.location.pathname;
      if (currentPath === "" || currentPath === "/") {
        currentPath = "index.html";
      }

      var navLinks = document.querySelectorAll(".navbar .nav-link, .navbar .dropdown-item");

      navLinks.forEach(function (link) {
        var href = link.getAttribute("href");
        if (!href) return;

        var normalizedHref = href;
        if (!normalizedHref.startsWith("/")) {
          normalizedHref = "/" + normalizedHref;
        }

        var normalizedPath = currentPath.replace(/\/+$/, "");
        normalizedHref = normalizedHref.replace(/\/+$/, "");

        // Treat /services/ and /services/index.html as equivalent
        normalizedHref = normalizedHref.replace(/\/index\.html$/, "");
        normalizedPath = normalizedPath.replace(/\/index\.html$/, "");

        if (normalizedPath === normalizedHref) {
          link.classList.add("tz-nav-active");
          var parentDropdown = link.closest(".dropdown");
          if (parentDropdown) {
            var parentToggle = parentDropdown.querySelector(".nav-link.dropdown-toggle");
            if (parentToggle) {
              parentToggle.classList.add("tz-nav-active");
            }
          }
        }
      });
    } catch (e) {
      // Fail-safe: do nothing if structure differs
    }
  }

  function initSmoothScroll() {
    document.body.addEventListener("click", function (event) {
      var target = event.target;
      if (target.tagName === "A" && target.getAttribute("href")) {
        var href = target.getAttribute("href");
        if (href.startsWith("#")) {
          var id = href.substring(1);
          var targetEl = document.getElementById(id);
          if (targetEl) {
            event.preventDefault();
            targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }
      }
    });
  }

  function initGreetingModal() {
    var greetingModalEl = document.getElementById("greetingModal");
    if (greetingModalEl && typeof bootstrap !== "undefined" && bootstrap.Modal) {
      var alreadyShown = sessionStorage.getItem("tzGreetingShown");
      if (!alreadyShown) {
        setTimeout(function () {
          var modalInstance = new bootstrap.Modal(greetingModalEl);
          modalInstance.show();
          sessionStorage.setItem("tzGreetingShown", "1");
        }, 10000);
      }
    }
  }

  document.addEventListener("DOMContentLoaded", function () {
    // 1. Load navbar/footer (and any other partials)
    loadIncludes().then(function () {
      // 2. Once partials are in the DOM, initialize behaviour that depends on them
      initFooterYear();
      initNavActive();
      initSmoothScroll();
      initGreetingModal();
    });
  });
})();
