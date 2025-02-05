/**
 * Logs the user in as a guest, clears saved login data, and redirects to the summary page.
 * @function loginGuest
 * @returns {void}
 */
function loginGuest() {
  activeUser = {
    name: "Guest",
    initials: "G",
    id: 0,
    color: "#ffffff",
    tasks: [1, 2, 3, 4, 5],
    contacts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
  localStorage.removeItem("rememberMeData");
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
  localStorage.setItem("greetingShown", "false");
  window.location.href = "./html/summary.html";
}

/**
 * Attempts to log in a user with the provided credentials.
 * Fetches user data, checks validity, and manages Remember Me settings.
 * @async
 * @function loginUser
 * @returns {Promise<void>}
 */
async function loginUser() {
  let loginEmail = document.getElementById("login_email").value.trim();
  let loginPassword = document.getElementById("login_password").value;
  let users = await fetchData("users");
  let user = users.find(
    (user) => user.email.toLowerCase() === loginEmail.toLowerCase()
  );

  resetLoginAlert();

  if (user && user.password === loginPassword) {
    await successfulLogin(user);
  } else {
    manageLoginError();
  }
}

/**
 * Resets any alert or error styling in the login form.
 * @function resetLoginAlert
 * @returns {void}
 */
function resetLoginAlert() {
  let noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("login_email").classList.remove("border-alert");
  document.getElementById("login_password").classList.remove("border-alert");
}

/**
 * Handles successful login by storing user data in localStorage and redirecting.
 * @async
 * @function successfulLogin
 * @param {Object} user - The user object containing login credentials and additional info.
 * @returns {Promise<void>}
 */
async function successfulLogin(user) {
  operateRememberMe(user);

  let userData = await loadUserData(user);

  localStorage.setItem("activeUser", JSON.stringify(userData));
  localStorage.setItem("greetingShown", "false");
  resetLoginFormInputs();
  window.location.href = "./html/summary.html";
}

/**
 * Manages the "Remember Me" checkbox logic by saving or removing login data based on user preference.
 * @function operateRememberMe
 * @param {Object} user - The user object containing login credentials.
 * @returns {void}
 */
function operateRememberMe(user) {
  if (rememberMeChecked()) {
    batchRememberMeData(user).then((saveData) => {
      localStorage.setItem("rememberMeData", JSON.stringify(saveData));
    });
  }

  if (!rememberMeChecked()) {
    localStorage.removeItem("rememberMeData");
  }
}

/**
 * Checks if the "Remember Me" checkbox is currently marked as true.
 * @function rememberMeChecked
 * @returns {boolean} Returns true if the checkbox indicates a "checked" state, otherwise false.
 */
function rememberMeChecked() {
  let checkButton = document.getElementById("login_check_off");
  let isChecked = checkButton.src.includes("true");
  return isChecked;
}

/**
 * Batches the user's login data to be stored if "Remember Me" is enabled.
 * @async
 * @function batchRememberMeData
 * @param {Object} user - The user object containing email and password.
 * @returns {Promise<Object>} Returns an object with email and password.
 */
async function batchRememberMeData(user) {
  return {
    email: user.email,
    password: user.password,
  };
}

/**
 * Loads additional user data needed for the session.
 * @async
 * @function loadUserData
 * @param {Object} user - The user object containing necessary user information.
 * @returns {Promise<Object>} Returns an object with user properties such as name, initials, id, etc.
 */
async function loadUserData(user) {
  return {
    name: user.name,
    initials: user.initials,
    id: user.id,
    color: user.color,
    tasks: user.tasks,
    contacts: user.contacts,
  };
}

/**
 * Resets the login form fields and reverts the "Remember Me" checkbox to false.
 * @function resetLoginFormInputs
 * @returns {void}
 */
function resetLoginFormInputs() {
  document.getElementById("login_email").value = "";
  document.getElementById("login_password").value = "";

  let legalButton = document.getElementById("login_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
}

/**
 * Manages login failure by displaying an error message and highlighting the form fields.
 * @function manageLoginError
 * @returns {void}
 */
function manageLoginError() {
  let noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML += `<div>Check your email and password. Please try again.</div>`;
  document.getElementById("login_email").classList.add("border-alert");
  document.getElementById("login_password").classList.add("border-alert");
}

/**
 * Collects input from signup fields and initiates the signup process.
 * @function signUp
 * @returns {void}
 */
function signUp() {
  let email = document.getElementById("signup_email").value.trim();
  let name = document.getElementById("signup_name").value.trim();
  let password = document.getElementById("signup_password").value;
  let cPassword = document.getElementById("signup_c_password").value;

  signUpProcedure(email, name, password, cPassword);
}

/**
 * Performs the full signup procedure, including validation, creating a new user, and updating the UI.
 * @async
 * @function signUpProcedure
 * @param {string} email - The user's email address.
 * @param {string} name - The user's chosen name.
 * @param {string} password - The user's chosen password.
 * @param {string} cPassword - The confirmation of the user's chosen password.
 * @returns {Promise<void>}
 */
async function signUpProcedure(email, name, password, cPassword) {
  resetSignupAlert();
  await validateInputs(email, name, password, cPassword);
  let initials = getUserInitials(name);
  await addUser(email, name, password, initials);
  resetSignupFormInputs();
  await showSuccessfullSignUp();
  localStorage.removeItem("rememberMeData");
  toggleAdmissionWindow();
}

/**
 * Resets any alert or error styling in the signup form.
 * @function resetSignupAlert
 * @returns {void}
 */
function resetSignupAlert() {
  let noticeField = document.getElementById("signup_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("signup_email").classList.remove("border-alert");
  document.getElementById("signup_name").classList.remove("border-alert");
  document.getElementById("signup_password").classList.remove("border-alert");
  document.getElementById("signup_c_password").classList.remove("border-alert");
}

/**
 * Creates and posts a new user entry to the database.
 * @async
 * @function addUser
 * @param {string} email - The user's email address.
 * @param {string} name - The user's name.
 * @param {string} password - The user's chosen password.
 * @param {string} initials - The user's initials derived from their name.
 * @returns {Promise<void>}
 */
async function addUser(email, name, password, initials) {
  let userId = await getNewId("users");
  let userData = createUserData(name, initials, email, password, userId);

  try {
    let result = await postData(`users/${userId - 1}/`, userData);
  } catch (error) {
    console.error("Error during registration:", error);
  }
}

/**
 * Constructs an object representing the new user's data.
 * @function createUserData
 * @param {string} name - The user's name.
 * @param {string} initials - The user's initials derived from their name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {number} userId - The unique ID assigned to the user.
 * @returns {Object} Returns the new user's data object.
 */
function createUserData(name, initials, email, password, userId) {
  return {
    name,
    initials,
    email,
    password,
    id: userId,
    color: "#ffffff",
    tasks: [6, 7, 8, 9, 10],
    contacts: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  };
}

/**
 * Resets the signup form fields and reverts the legal acceptance checkbox to false.
 * @function resetSignupFormInputs
 * @returns {void}
 */
function resetSignupFormInputs() {
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_password").value = "";
  document.getElementById("signup_c_password").value = "";

  let legalButton = document.getElementById("signup_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
  legalButton.classList.remove("bg-alert");
}

/**
 * Displays an overlay indicating a successful signup, then hides it after a timeout.
 * @async
 * @function showSuccessfullSignUp
 * @returns {Promise<void>}
 */
function showSuccessfullSignUp() {
  return new Promise((resolve) => {
    let overlay = document.getElementById("successfully_signed_up");
    overlay.classList.remove("d-none");
    overlay.classList.add("active");

    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1500);
    }, 50);
  });
}

/**
 * Removes the background alert styling from the legal acceptance checkbox on the signup form.
 * @function removeNoticeButtonBg
 * @returns {void}
 */
function removeNoticeButtonBg() {
  let checkButton = document.getElementById("signup_check_off");
  checkButton.classList.remove("bg-alert");
}
