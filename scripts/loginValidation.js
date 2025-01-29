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


async function isMailRegistered(email) {
  let users = await fetchData("users");
  if (!users) {
    return false;
  }
  return Object.values(users).some(
    (user) => user && user.email.toLowerCase() === email.toLowerCase()
  );
}


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


function checkNameNotEmpty(name, noticeField, nameField) {
  if (name.trim().length < 3) {
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Enter a name of at least 3 letters.</div>`;
    return false;
  }
  return true;
}


function checkNameCharacters(name, noticeField, nameField) {
  let nameRegex = /^[A-Za-zÄäÖöÜüß\s]+$/;

  if (!nameRegex.test(name)) {
    nameField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your name should only contain letters and spaces.</div>`;
    return false;
  }
  return true;
}


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


function checkPasswordMatch(password, cPassword, noticeField, passwordField, cPasswordField) {
  if (password !== cPassword) {
    passwordField.classList.add("border-alert");
    cPasswordField.classList.add("border-alert");
    noticeField.innerHTML += `<div>Your passwords don't match. Please try again.</div>`;
    return false;
  }
  return true;
}


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


function isLegalAccepted() {
  let checkButton = document.getElementById("signup_check_off");
  let isChecked = checkButton.src.includes("true");
  return isChecked;
}


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
