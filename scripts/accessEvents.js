// Für die Join Logo Animation

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

});



// Funktion um die Sichtbarkeit zwischen Anmelde- 
// und Registrierungsfenster umzuschalten.

function toggleAccessWindow() {
  let logIn = document.getElementById("loginSection");
  let signUp = document.getElementById("signUpSection");

  logIn.classList.toggle("d-none");
  signUp.classList.toggle("d-none");
}



// Um die png zu wechseln von Remember me & accept the Legal notice
// und für Passwort Anzeigen (Auge und Schloss)

function toggleCheckbox(imageId) {
  const img = document.getElementById(imageId);
  const falsePath = './assets/img/png/check-button-false.png';
  const truePath = './assets/img/png/check-button-true.png';
  const lockPath = './assets/img/png/lock.png';
  const visibilityPath = './assets/img/png/visibility.png';

  // Überprüfe, welcher Typ aktuell verwendet wird (Checkbox oder Lock/Visibility)
  if (img.src.includes("check-button")) {
    // Umschalten zwischen truePath und falsePath
    img.src = img.src.includes("check-button-false.png") ? truePath : falsePath;
  } else if (img.src.includes("lock") || img.src.includes("visibility")) {
    // Umschalten zwischen lockPath und visibilityPath
    img.src = img.src.includes("lock.png") ? visibilityPath : lockPath;
  }
}



// Um den Input Typ zu wechseln wegen Passwort Anzeigen lassen

function toggleShowPassword() {
  const passwordInput = document.getElementById("inputPassword");
  const passwordsignUp = document.getElementById("signUpPassword");
  
  if (passwordInput.type === 'password') {
    passwordInput.type = 'text';
    passwordsignUp.type = 'text';
  } else {
    passwordInput.type = 'password';
    passwordsignUp.type = 'password';
  }
}



function loginAsGuest() {
  window.location.href = "html/summary.html";
}