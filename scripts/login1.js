/**
 * Initializes the application by calling setup functions for password handling and database resetting.
 * @function init
 * @returns {void}
 */
function init() {
  setupRememberMe();
  loginPassword();
  signupPassword();
  signupConfirmPassword();
  resetDatabase();
}

/**
 * Sets up the "Remember Me" functionality for the login form.
 * @function setupRememberMe
 * @returns {void}
 */
function setupRememberMe() {
  let emailInput = document.getElementById("login_email");
  let passwordInput = document.getElementById("login_password");
  let legalButton = document.getElementById("login_check_off");

  emailInput.addEventListener("input", function () {
    if (this.value === "") {
      legalButton.src = `./assets/img/png/check-button-false.png`;
      passwordInput.value = "";
    }
  });
}

/**
 * Configures the password handling logic on the login form.
 * @function loginPassword
 * @returns {void}
 */
function loginPassword() {
  let passwordField = document.getElementById("login_password");
  let lockIcon = document.getElementById("login_lock_icon");
  let togglePassword = document.getElementById("login_toggle_password");

  setupPasswordField(passwordField, lockIcon, togglePassword);

  updateConspicuity(passwordField, lockIcon, togglePassword);
}

/**
 * Configures the password handling logic on the signup form (primary password field).
 * @function signupPassword
 * @returns {void}
 */
function signupPassword() {
  let passwordField = document.getElementById("signup_password");
  let lockIcon = document.getElementById("signup_lock_icon");
  let togglePassword = document.getElementById("signup_toggle_password");

  setupPasswordField(passwordField, lockIcon, togglePassword);

  updateConspicuity(passwordField, lockIcon, togglePassword);
}

/**
 * Configures the password handling logic on the signup form (confirmation password field).
 * @function signupConfirmPassword
 * @returns {void}
 */
function signupConfirmPassword() {
  let passwordField = document.getElementById("signup_c_password");
  let lockIcon = document.getElementById("signup_c_lock_icon");
  let togglePassword = document.getElementById("signup_c_toggle_password");

  setupPasswordField(passwordField, lockIcon, togglePassword);

  updateConspicuity(passwordField, lockIcon, togglePassword);
}

/**
 * Resets the database by posting backup data for tasks and contacts.
 * @async
 * @function resetDatabase
 * @returns {Promise<void>}
 */
async function resetDatabase() {
  for (let index = 0; index < backupTask.length; index++) {
      await postData(`tasks/${index}/`, backupTask[index]);
      await postData(`contacts/${index}/`, backupContacts[index]);
  }  
}

/**
 * Toggles the check button graphic for a specific element, indicating true or false status.
 * @function toggleCheckBtnAdmission
 * @param {string} CheckButtonId - The DOM element ID of the check button.
 * @param {string} CheckTaskButton - The base filename or identifier used in the check button graphic.
 * @returns {void}
 */
function toggleCheckBtnAdmission(CheckButtonId, CheckTaskButton) {
  let checkButton = document.getElementById(CheckButtonId);
  let isChecked = checkButton.src.includes("true");
  checkButton.src = `./assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

document.addEventListener("DOMContentLoaded", () => {
  let logoContainer = document.querySelector(".logo-container");
  let logo = document.querySelector(".img-logo");

  setTimeout(() => {
    logo.classList.add("logo-small");
    logoContainer.classList.add("container-transparent");
  }, 1000);

  setTimeout(() => {
    logoContainer.style.pointerEvents = "none";
    logo.style.zIndex = "1001";
  }, 1500);
  checkRememberMe();
});

/**
 * Checks if there is saved login data in localStorage and applies it if found.
 * @function checkRememberMe
 * @returns {void}
 */
function checkRememberMe() {
  let rememberMeData = localStorage.getItem("rememberMeData");

  if (rememberMeData) {
    try {
      let { email, password } = JSON.parse(rememberMeData);
      fillLoginForm(email, password);
      toggleCheckBtnAdmission("login_check_off", "button");
    } catch (error) {
      console.error("Fehler beim Parsen der gespeicherten Login-Daten:", error);
    }
  }
}

/**
 * Fills the login form fields with the provided email and password.
 * @function fillLoginForm
 * @param {string} email - The email address to set.
 * @param {string} password - The password to set.
 * @returns {void}
 */
function fillLoginForm(email, password) {
  let emailInput = document.getElementById("login_email");
  let passwordInput = document.getElementById("login_password");

  if (emailInput && passwordInput) {
    emailInput.value = email;
    passwordInput.value = password;
  } else {
    console.error("Login-Formularfelder nicht gefunden");
  }
}

/**
 * Toggles visibility between the Login and Signup sections.
 * @function toggleAdmissionWindow
 * @returns {void}
 */
function toggleAdmissionWindow() {
  let logIn = document.getElementById("Login");
  let signUp = document.getElementById("Signup");
  let changeAccess = document.getElementById("change_access");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
  changeAccess.classList.toggle("d-none");
}

/**
 * Sets up event listeners on a password field to manage display and toggle behavior.
 * @function setupPasswordField
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLElement} lockIcon - The lock icon element displayed when the field is empty.
 * @param {HTMLImageElement} togglePassword - The toggle icon element used to show/hide the password.
 * @returns {void}
 */
function setupPasswordField(passwordField, lockIcon, togglePassword) {
  setupInputListener(passwordField, lockIcon, togglePassword);
  setupMouseListener(passwordField, togglePassword);
  setupTouchListeners(passwordField, togglePassword);
}

/**
 * Sets up an input listener on a password field to update visibility and styling.
 * @function setupInputListener
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLElement} lockIcon - The lock icon element displayed when the field is empty.
 * @param {HTMLImageElement} togglePassword - The toggle icon element used to show/hide the password.
 * @returns {void}
 */
function setupInputListener(passwordField, lockIcon, togglePassword) {
  passwordField.addEventListener("input", () =>
    updateConspicuity(passwordField, lockIcon, togglePassword)
  );
}

/**
 * Sets up mouse-based events to show or hide the password on mousedown, mouseup, or mouseleave.
 * @function setupMouseListener
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLImageElement} togglePassword - The toggle icon element used to show/hide the password.
 * @returns {void}
 */
function setupMouseListener(passwordField, togglePassword) {
  togglePassword.addEventListener("mousedown", () =>
    showPassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("mouseup", () =>
    hidePassword(passwordField, togglePassword)
  );
  togglePassword.addEventListener("mouseleave", () =>
    hidePassword(passwordField, togglePassword)
  );
}

/**
 * Sets up touch events to show or hide the password on touchstart or touchend.
 * @function setupTouchListeners
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLImageElement} togglePassword - The toggle icon element used to show/hide the password.
 * @returns {void}
 */
function setupTouchListeners(passwordField, togglePassword) {
  togglePassword.addEventListener(
    "touchstart",
    () => showPassword(passwordField, togglePassword),
    { passive: true }
  );
  togglePassword.addEventListener(
    "touchend",
    () => hidePassword(passwordField, togglePassword),
    { passive: true }
  );
}

/**
 * Updates the visibility of the lock icon and toggle button based on the password field input.
 * @function updateConspicuity
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLElement} lockIcon - The lock icon element displayed when the field is empty.
 * @param {HTMLImageElement} togglePassword - The toggle icon element used to show/hide the password.
 * @returns {void}
 */
function updateConspicuity(passwordField, lockIcon, togglePassword) {
  let isEmpty = passwordField.value.length === 0;
  lockIcon.classList.toggle("d-none", !isEmpty);
  togglePassword.classList.toggle("d-none", isEmpty);
}

/**
 * Reveals the text in a password field and updates the toggle icon.
 * @function showPassword
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLImageElement} togglePassword - The toggle icon to switch images.
 * @returns {void}
 */
function showPassword(passwordField, togglePassword) {
  passwordField.type = "text";
  togglePassword.src = "./assets/img/png/visibility.png";
}

/**
 * Conceals the text in a password field and updates the toggle icon.
 * @function hidePassword
 * @param {HTMLInputElement} passwordField - The password input field.
 * @param {HTMLImageElement} togglePassword - The toggle icon to switch images.
 * @returns {void}
 */
function hidePassword(passwordField, togglePassword) {
  passwordField.type = "password";
  togglePassword.src = "./assets/img/png/visibility_off.png";
}
