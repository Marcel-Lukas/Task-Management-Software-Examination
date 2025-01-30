/**
 * Waits for the DOM to fully load, then loads the template, initializes the user interface,
 * ensures the legal notice is handled for non-logged-in users, and attaches a resize event listener.
 * @listens DOMContentLoaded
 * @async
 * @returns {Promise<void>}
 */
document.addEventListener("DOMContentLoaded", async () => {
  await loadTemplate();
  initializeUserInterface();
  legalNoticeWithoutUser();
  window.addEventListener("resize", handleResize);
});

/**
 * Attaches a click event listener to the document that triggers the user menu click handler.
 * @listens document:click
 * @returns {void}
 */
document.addEventListener("click", handleClickUserMenu);

/**
 * Loads an external HTML template and injects it into the element with ID "desktop_template".
 * @async
 * @function loadTemplate
 * @returns {Promise<void>}
 */
async function loadTemplate() {
  const response = await fetch("../assets/templates/desktopTemplate.html");
  document.getElementById("desktop_template").innerHTML = await response.text();
}

/**
 * Initializes the user interface by updating the user's initials, making the document visible,
 * refreshing sidebar icons, setting up links, and handling initial screen resizing behavior.
 * @function initializeUserInterface
 * @returns {void}
 */
function initializeUserInterface() {
  updateInitials();
  document.body.style.visibility = "visible";
  updateSidebarIcons();
  initializeLinks();
  handleResize(); 
}

/**
 * Updates the sidebar icons based on the current page and sets active or disabled states.
 * @function updateSidebarIcons
 * @returns {void}
 */
function updateSidebarIcons() {
  const currentPage = window.location.pathname.split("/").pop();
  const pages = ["summary", "board", "contacts", "addTask"];
  pages.forEach((page) => updateIconState(page, currentPage));
  updatePageState("privacyPolicy.html", ".privacy-policy-link", currentPage);
  updatePageState("legalNotice.html", ".legal-notice-link", currentPage);
}

/**
 * Updates the icon state for a specified page link, marking it active if it matches the current page.
 * @function updateIconState
 * @param {string} page - The base name of the page (e.g., "summary", "board").
 * @param {string} currentPage - The filename of the current page.
 * @returns {void}
 */
function updateIconState(page, currentPage) {
  const link = document.querySelector(`.${page}-link`);
  const icon = link?.querySelector("img");
  const isActive = currentPage === `${page}.html`;
  if (link && icon) {
    icon.src = `../assets/img/png/${page}-${isActive ? "white" : "grey"}.png`;
    link.classList.toggle("active", isActive);
    link.classList.toggle("disabled", isActive);
  }
}

/**
 * Updates the link state (e.g., for privacy policy or legal notice) by toggling active and disabled classes.
 * @function updatePageState
 * @param {string} page - The filename of the page (e.g., "privacyPolicy.html").
 * @param {string} selector - The DOM selector for the corresponding link element.
 * @param {string} currentPage - The filename of the current page.
 * @returns {void}
 */
function updatePageState(page, selector, currentPage) {
  const link = document.querySelector(selector);
  if (link) {
    const isActive = currentPage === page;
    link.classList.toggle("active", isActive);
    link.classList.toggle("disabled", isActive);
  }
}

/**
 * Handles window resize events, hiding the sidebar on mobile if no user is logged in, and adjusting the menu layout.
 * @function handleResize
 * @returns {void}
 */
function handleResize() {
  hideSidebarAtMobile();
  addHelpToMenu();
}

/**
 * Hides the sidebar and adjusts the layout if the window is narrow and no user is logged in.
 * @function hideSidebarAtMobile
 * @returns {void}
 */
function hideSidebarAtMobile() {
  if (!localStorage.getItem("activeUser") && window.innerWidth < 770) {
    document.getElementById("sidebar")?.style.setProperty("display", "none", "important");
    document.getElementById("arrow_back")?.classList.add("d-none");
    document.querySelector(".content")?.style.setProperty("height", "100%");
  }
}

/**
 * Moves the "Help" section into or out of the logout menu depending on screen size.
 * @function addHelpToMenu
 * @returns {void}
 */
function addHelpToMenu() {
  const isMobile = window.matchMedia("(max-width: 1240px)").matches;
  const helpDiv = document.getElementById("help_mobile");
  const logOutDiv = document.getElementById("log_out");
  if (isMobile) {
    logOutDiv.insertBefore(helpDiv, logOutDiv.firstChild);
    helpDiv.classList.remove("d-none");
  } else {
    document.getElementById("header_icons").appendChild(helpDiv);
    helpDiv.classList.add("d-none");
  }
}

/**
 * Initializes link behavior for policy and legal pages, disabling the link if the user is already on that page.
 * @function initializeLinks
 * @returns {void}
 */
function initializeLinks() {
  setupLink("policy_link", "privacyPolicy.html", handleLinkClick);
  setupLink("legal_link", "legalNotice.html", handleLinkClick);
}

/**
 * Sets up a link element by adding a click event listener unless the current page matches the link destination.
 * @function setupLink
 * @param {string} id - The ID of the link element.
 * @param {string} page - The filename representing the page the link should lead to.
 * @param {Function} clickHandler - The event handler function for the link click.
 * @returns {void}
 */
function setupLink(id, page, clickHandler) {
  const link = document.getElementById(id);
  if (link && !window.location.pathname.includes(page)) {
    link.addEventListener("click", clickHandler);
  } else {
    link.classList.add("disabled");
  }
}

/**
 * Handles link clicks by preventing the default action, temporarily disabling the link,
 * and then navigating to the specified page.
 * @function handleLinkClick
 * @param {Event} event - The click event object.
 * @returns {void}
 */
function handleLinkClick(event) {
  event.preventDefault();
  const link = event.currentTarget;
  link.classList.add("disabled");
  localStorage.setItem(`${link.id}_disabled`, "true");
  setTimeout(() => {
    window.location.href = link.href;
  }, 100);
}

/**
 * Handles clicks on the user initials, toggling the user menu, and closes the menu if clicked outside.
 * @function handleClickUserMenu
 * @param {Event} event - The click event object.
 * @returns {void}
 */
function handleClickUserMenu(event) {
  const initials = document.getElementById("user_profile_initials");
  const logOut = document.getElementById("log_out");
  if (initials.contains(event.target)) {
    toggleVisibility(logOut, initials);
  } else if (!logOut.classList.contains("d-none") && !logOut.contains(event.target)) {
    logOut.classList.add("d-none");
    initials.classList.remove("bg-color");
  }
}

/**
 * Toggles the visibility of the logout menu and adjusts the background color of the initials element.
 * @function toggleVisibility
 * @param {HTMLElement} logOut - The element representing the logout options/menu.
 * @param {HTMLElement} initials - The element containing the user initials.
 * @returns {void}
 */
function toggleVisibility(logOut, initials) {
  logOut.classList.toggle("d-none");
  initials.classList.toggle("bg-color");
}

/**
 * Updates the user's initials on the page based on data stored in localStorage.
 * @function updateInitials
 * @returns {void}
 */
function updateInitials() {
  const initials = JSON.parse(localStorage.getItem("activeUser"))?.initials;
  document.getElementById("user_profile_initials").textContent = initials || "";
}

/**
 * Manages the legal notice display for users who are not logged in, hiding specific UI elements if necessary.
 * @function legalNoticeWithoutUser
 * @returns {void}
 */
function legalNoticeWithoutUser() {
  const checkIfUserIsLogged = localStorage.getItem("activeUser");
  if (!checkIfUserIsLogged) {
    document.getElementById('header_icons').classList.add('d-none');
    document.getElementById('icon_bar').classList.add('d-none');
    document.getElementById('arrow_back').classList.add('d-none');
  }
}
