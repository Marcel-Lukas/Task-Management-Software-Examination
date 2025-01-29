function init() {
  setupRememberMe();
  loginPassword();
  signupPassword();
  signupConfirmPassword();
  resetDatabase();
}


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


function loginPassword() {
  let passwordField = document.getElementById("login_password");
  let lockIcon = document.getElementById("login_lock_icon");
  let togglePassword = document.getElementById("login_toggle_password");

  setupPasswordField(passwordField, lockIcon, togglePassword);

  updateConspicuity(passwordField, lockIcon, togglePassword);
}


function signupPassword() {
  let passwordField = document.getElementById("signup_password");
  let lockIcon = document.getElementById("signup_lock_icon");
  let togglePassword = document.getElementById("signup_toggle_password");

  setupPasswordField(passwordField, lockIcon, togglePassword);

  updateConspicuity(passwordField, lockIcon, togglePassword);
}


function signupConfirmPassword() {
  let passwordField = document.getElementById("signup_c_password");
  let lockIcon = document.getElementById("signup_c_lock_icon");
  let togglePassword = document.getElementById("signup_c_toggle_password");

  setupPasswordField(passwordField, lockIcon, togglePassword);

  updateConspicuity(passwordField, lockIcon, togglePassword);
}


async function resetDatabase() {
  for (let index = 0; index < dbBackupTask.length; index++) {
      await postData(`tasks/${index}/`, dbBackupTask[index]);
      await postData(`contacts/${index}/`, dbBackupContacts[index]);
  }  
}


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


function toggleAdmissionWindow() {
  let logIn = document.getElementById("Login");
  let signUp = document.getElementById("Signup");
  let changeAccess = document.getElementById("change_access");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
  changeAccess.classList.toggle("d-none");
}


function setupPasswordField(passwordField,lockIcon,togglePassword) {
  setupInputListener(passwordField, lockIcon, togglePassword);
  setupMouseListener(passwordField, togglePassword);
  setupTouchListeners(passwordField, togglePassword);
}


function setupInputListener(passwordField, lockIcon, togglePassword) {
  passwordField.addEventListener("input", () =>
    updateConspicuity(passwordField, lockIcon, togglePassword)
  );
}


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


function updateConspicuity(passwordField, lockIcon, togglePassword) {
  let isEmpty = passwordField.value.length === 0;
  lockIcon.classList.toggle("d-none", !isEmpty);
  togglePassword.classList.toggle("d-none", isEmpty);
}


function showPassword(passwordField, togglePassword) {
  passwordField.type = "text";
  togglePassword.src = "./assets/img/png/visibility.png";
}


function hidePassword(passwordField, togglePassword) {
  passwordField.type = "password";
  togglePassword.src = "./assets/img/png/visibility_off.png";
}



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


function resetLoginAlert() {
  let noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("login_email").classList.remove("border-alert");
  document.getElementById("login_password").classList.remove("border-alert");
}


async function successfulLogin(user) {
  operateRememberMe(user);

  let userData = await loadUserData(user);

  localStorage.setItem("activeUser", JSON.stringify(userData));
  localStorage.setItem("greetingShown", "false");
  resetLoginFormInputs();
  window.location.href = "./html/summary.html";
}


async function operateRememberMe(user) {
  if (rememberMeChecked()) {
    let saveData = await batchRememberMeData(user);
    localStorage.setItem("rememberMeData", JSON.stringify(saveData));
  }

  if (!rememberMeChecked()) {
    localStorage.removeItem("rememberMeData");
  }
}


function rememberMeChecked() {
  let checkButton = document.getElementById("login_check_off");
  let isChecked = checkButton.src.includes("true");
  return isChecked;
}


async function batchRememberMeData(user) {
  return {
    email: user.email,
    password: user.password,
  };
}


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


function resetLoginFormInputs() {
  document.getElementById("login_email").value = "";
  document.getElementById("login_password").value = "";

  let legalButton = document.getElementById("login_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
}


function manageLoginError() {
  let noticeField = document.getElementById("login_notice_field");
  noticeField.innerHTML += `<div>Check your email and password. Please try again.</div>`;
  document.getElementById("login_email").classList.add("border-alert");
  document.getElementById("login_password").classList.add("border-alert");
  console.error(errorMessage);
}


function signUp() {
  let email = document.getElementById("signup_email").value.trim();
  let name = document.getElementById("signup_name").value.trim();
  let password = document.getElementById("signup_password").value;
  let cPassword = document.getElementById("signup_c_password").value;

  signUpProcedure(email, name, password, cPassword);
}


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


function resetSignupAlert() {
  let noticeField = document.getElementById("signup_notice_field");
  noticeField.innerHTML = "";

  document.getElementById("signup_email").classList.remove("border-alert");
  document.getElementById("signup_name").classList.remove("border-alert");
  document.getElementById("signup_password").classList.remove("border-alert");
  document.getElementById("signup_c_password").classList.remove("border-alert");
}


async function addUser(email, name, password, initials) {
  let userId = await getNewId("users");
  let userData = createUserData(name, initials, email, password, userId);

  try {
    let result = await postData(`users/${userId - 1}/`, userData);
  } catch (error) {
    console.error("Error during registration:", error);
  }
}


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


function resetSignupFormInputs() {
  document.getElementById("signup_email").value = "";
  document.getElementById("signup_name").value = "";
  document.getElementById("signup_password").value = "";
  document.getElementById("signup_c_password").value = "";

  let legalButton = document.getElementById("signup_check_off");
  legalButton.src = `./assets/img/png/check-button-false.png`;
  legalButton.classList.remove("bg-alert");
}


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


function removeNoticeButtonBg() {
  let checkButton = document.getElementById("signup_check_off");
  checkButton.classList.remove("bg-alert");
}