'use strict';



/**
 * add Event on elements
 */

const addEventOnElem = function (elem, type, callback) {
  if (elem.length > 1) {
    for (let i = 0; i < elem.length; i++) {
      elem[i].addEventListener(type, callback);
    }
  } else {
    elem.addEventListener(type, callback);
  }
}



/**
 * navbar toggle
 */

const navbar = document.querySelector("[data-navbar]");
const navTogglers = document.querySelectorAll("[data-nav-toggler]");
const navbarLinks = document.querySelectorAll("[data-nav-link]");
const overlay = document.querySelector("[data-overlay]");

const toggleNavbar = function () {
  navbar.classList.toggle("active");
  overlay.classList.toggle("active");
}

addEventOnElem(navTogglers, "click", toggleNavbar);

const closeNavbar = function () {
  navbar.classList.remove("active");
  overlay.classList.remove("active");
}

addEventOnElem(navbarLinks, "click", closeNavbar);



/**
 * header & back top btn show when scroll down to 100px
 */

const header = document.querySelector("[data-header]");
const backTopBtn = document.querySelector("[data-back-top-btn]");

const headerActive = function () {
  if (window.scrollY > 80) {
    header.classList.add("active");
    backTopBtn.classList.add("active");
  } else {
    header.classList.remove("active");
    backTopBtn.classList.remove("active");
  }
}

addEventOnElem(window, "scroll", headerActive);



/**
 * product catalogue category filter
 */

const filterBtns = document.querySelectorAll("[data-filter-btn]");
const catalogueItems = document.querySelectorAll("[data-catalogue-item]");

if (filterBtns.length && catalogueItems.length) {
  addEventOnElem(filterBtns, "click", function () {
    const selectedCategory = this.dataset.filter;

    filterBtns.forEach((btn) => btn.classList.remove("active"));
    this.classList.add("active");

    catalogueItems.forEach((item) => {
      const itemCategory = item.dataset.category;
      const shouldShow = selectedCategory === "all" || itemCategory === selectedCategory;
      item.style.display = shouldShow ? "" : "none";
    });
  });
}



/**
 * pre-fill application form when clicking a catalogue product CTA
 */

const applyProductBtns = document.querySelectorAll("[data-apply-product]");
const productSelect = document.querySelector("#product-interest");
const applicationTypeSelect = document.querySelector("#application-type");
const applicationSection = document.querySelector("#apply");

if (applyProductBtns.length && productSelect) {
  addEventOnElem(applyProductBtns, "click", function (event) {
    event.preventDefault();
    const productName = this.dataset.applyProduct;

    if (productName) {
      productSelect.value = productName;
    }
    if (applicationTypeSelect) {
      applicationTypeSelect.value = "Product Quote / Order";
    }
    if (applicationSection) {
      applicationSection.scrollIntoView({ behavior: "smooth" });
    }
  });
}



/**
 * application form submission & validation
 */

const applicationForm = document.querySelector("[data-application-form]");
const applicationStatus = document.querySelector("[data-application-status]");

if (applicationForm && applicationStatus) {
  applicationForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const submitBtn = applicationForm.querySelector("[type='submit']");
    const endpoint = applicationForm.dataset.formEndpoint?.trim();

    if (!applicationForm.checkValidity()) {
      applicationForm.reportValidity();
      return;
    }

    const formData = new FormData(applicationForm);
    const fullName = formData.get("full_name");
    const refId = "KMG-" + Math.floor(100000 + Math.random() * 900000);

    if (submitBtn) {
      submitBtn.disabled = true;
    }

    try {
      if (endpoint) {
        const response = await fetch(endpoint, {
          method: "POST",
          body: formData,
          headers: { Accept: "application/json" }
        });
        if (!response.ok) {
          throw new Error("Submission failed");
        }
      }

      applicationStatus.className = "application-status is-visible is-success";
      applicationStatus.textContent =
        `Thank you, ${fullName}! Your message (Ref: ${refId}) has been recorded.`;
      applicationForm.reset();
    } catch (error) {
      applicationStatus.className = "application-status is-visible is-error";
      applicationStatus.textContent =
        "We could not submit your application right now. Please try again or email solutions@kmglobal.com.";
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
      }
    }
  });
}
