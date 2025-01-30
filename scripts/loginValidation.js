/**
 * Validates user inputs including email, name, password, and password confirmation.
 * @async
 * @function validateInputs
 * @param {string} email - The user's email address to validate.
 * @param {string} name - The user's name to validate.
 * @param {string} password - The user's desired password.
 * @param {string} cPassword - The user's password confirmation.
 * @returns {Promise<boolean>} Returns `true` if all validations pass.
 * @throws {Error} Throws an error if any validation fails.
 */
async function validateInputs(email, name, password, cPassword) {
  let noticeField = document.getElementById("signup_notice_field");
  let isEmailValid = await validateMail(email, noticeField);
  let isNameValid = validateName(name, noticeField);
  let isPasswordValid = validatePassword(password, cPassword, noticeField);
  let isLegalAccepted = checkLegalAcceptance(noticeField);

  let isValid =
    isEmailValid && isNameValid && isPasswordValid && isLegalAccepted;

  if (!isValid) {
    throw new Error("Error in validation");
  }
  return true;
}


/**
 * Validates the format and registration status of the provided email.
 * @async
 * @function validateMail
 * @param {string} email - The email address to validate.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @returns {Promise<boolean>} Returns `true` if the email is valid and not registered, otherwise `false`.
 */
async function validateMail(email, noticeField) {
  let emailField = document.getElementById("signup_email");

  if (!(await checkMailExists(email, noticeField, emailField))) {
    return false;
  }

  if (!checkEmailFormat(email, noticeField, emailField)) {
    return false;
  }

  return true;
}


/**
 * Checks if the provided email is already registered.
 * @async
 * @function checkMailExists
 * @param {string} email - The email address to check.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @param {HTMLElement} emailField - The DOM element representing the email input.
 * @returns {Promise<boolean>} Returns `true` if the email is not registered, otherwise `false`.
 */
async function checkMailExists(email, noticeField, emailField) {
  try {
    let emailExists = await isMailRegistered(email);
    if (emailExists) {
      emailField.classList.add("border-alert");
      noticeField.innerHTML += `<div>This email address is already registered.</div>`;
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error checking email existence:", error);
    return false;
  }
}


/**
 * Determines if the given email is present in the user database.
 * @async
 * @function isMailRegistered
 * @param {string} email - The email address to check.
 * @returns {Promise<boolean>} Returns `true` if the email exists in the database, otherwise `false`.
 */
async function isMailRegistered(email) {
  let users = await fetchData("users");
  if (!users) {
    return false;
  }
  return Object.values(users).some(
    (user) => user && user.email.toLowerCase() === email.toLowerCase()
  );
}


/**
 * Checks if the given email matches a valid email format.
 * @function checkEmailFormat
 * @param {string} email - The email address to check.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @param {HTMLElement} emailField - The DOM element representing the email input.
 * @returns {boolean} Returns `true` if the email format is valid, otherwise `false`.
 */
function checkEmailFormat(email, noticeField, emailField) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.error("Invalid email format.");
    emailField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Enter a valid e-mail address.</div>`;
    return false;
  }
  return true;
}


/**
 * Validates the given user name by checking if it's not empty and contains valid characters.
 * @function validateName
 * @param {string} name - The user's name to validate.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @returns {boolean} Returns `true` if the name is valid, otherwise `false`.
 */
function validateName(name, noticeField) {
  let isValidName = true;
  let nameField = document.getElementById("signup_name");

  if (!checkNameNotEmpty(name, noticeField, nameField)) {
    isValidName = false;
  }

  if (!checkNameCharacters(name, noticeField, nameField)) {
    isValidName = false;
  }
  return isValidName;
}


/**
 * Checks if the provided name is not empty (at least 3 letters).
 * @function checkNameNotEmpty
 * @param {string} name - The name to check.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @param {HTMLElement} nameField - The DOM element representing the name input.
 * @returns {boolean} Returns `true` if the name is non-empty, otherwise `false`.
 */
function checkNameNotEmpty(name, noticeField, nameField) {
  if (name.trim().length < 3) {
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Enter a name of at least 3 letters.</div>`;
    return false;
  }
  return true;
}


/**
 * Checks if the provided name contains only letters and spaces.
 * @function checkNameCharacters
 * @param {string} name - The name to check.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @param {HTMLElement} nameField - The DOM element representing the name input.
 * @returns {boolean} Returns `true` if the name contains only valid characters, otherwise `false`.
 */
function checkNameCharacters(name, noticeField, nameField) {
  let nameRegex = /^[A-Za-zÄäÖöÜüß\s]+$/;

  if (!nameRegex.test(name)) {
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your name should only contain letters and spaces.</div>`;
    return false;
  }
  return true;
}


/**
 * Validates the given password by checking its complexity and confirmation match.
 * @function validatePassword
 * @param {string} password - The user's password.
 * @param {string} cPassword - The user's confirmed password.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @returns {boolean} Returns `true` if the password passes all checks, otherwise `false`.
 */
function validatePassword(password, cPassword, noticeField) {
  let isValidPassword = true;
  let passwordField = document.getElementById("signup_password");
  let cPasswordField = document.getElementById("signup_c_password");
  if (!checkPasswordComplexity(password, noticeField, passwordField)) {
    isValidPassword = false;
  }

  if (
    !checkPasswordMatch(password, cPassword, noticeField, passwordField, cPasswordField)
  ) {
    isValidPassword = false;
  }
  return isValidPassword;
}


/**
 * Checks if the provided password meets complexity requirements.
 * @function checkPasswordComplexity
 * @param {string} password - The password to check.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @param {HTMLElement} passwordField - The DOM element representing the password input.
 * @returns {boolean} Returns `true` if the password meets complexity requirements, otherwise `false`.
 */
function checkPasswordComplexity(password, noticeField, passwordField) {
  let complexityRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?]).{8,}$/;

  if (!complexityRegex.test(password)) {
    passwordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your password must be at least 8 characters long and contain at least 1 upper case letter, 1 lower case letter, 1 number and 1 special character.</div>`;
    return false;
  }
  return true;
}


/**
 * Checks if the provided password and confirmation match.
 * @function checkPasswordMatch
 * @param {string} password - The password to compare.
 * @param {string} cPassword - The password confirmation to compare.
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @param {HTMLElement} passwordField - The DOM element representing the password input.
 * @param {HTMLElement} cPasswordField - The DOM element representing the confirmation password input.
 * @returns {boolean} Returns `true` if both passwords match, otherwise `false`.
 */
function checkPasswordMatch(password, cPassword, noticeField, passwordField, cPasswordField) {
  if (password !== cPassword) {
    passwordField.classList.add("border-alert");
    cPasswordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your passwords don't match. Please try again.</div>`;
    return false;
  }
  return true;
}


/**
 * Checks if the legal notice is accepted by the user.
 * @function checkLegalAcceptance
 * @param {HTMLElement} noticeField - The DOM element for displaying validation messages.
 * @returns {boolean} Returns `true` if the legal notice is accepted, otherwise `false`.
 */
function checkLegalAcceptance(noticeField) {
  let acceptedLegal = isLegalAccepted();
  if (!acceptedLegal) {
    let checkButton = document.getElementById("signup_check_off");
    noticeField.innerHTML += `<div>Please accept the Legal notice.</div>`;
    checkButton.classList.add("bg-alert");
    return false;
  }
  return true;
}


/**
 * Determines if the legal notice checkbox is in a checked state.
 * @function isLegalAccepted
 * @returns {boolean} Returns `true` if the legal notice is accepted, otherwise `false`.
 */
function isLegalAccepted() {
  let checkButton = document.getElementById("signup_check_off");
  let isChecked = checkButton.src.includes("true");
  return isChecked;
}


/**
 * Returns the initials from a given user name.
 * @function getUserInitials
 * @param {string} name - The full name from which to extract initials.
 * @returns {string} The user's initials in uppercase.
 */
function getUserInitials(name) {
  let words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  if (words.length >= 2) {
    return (
      words[0].charAt(0) + words[words.length - 1].charAt(0)
    ).toUpperCase();
  }
}
