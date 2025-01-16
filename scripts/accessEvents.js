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



// Wenn das Bild aktuell falsePath ist, auf 
// truePath setzen, sonst zurück zu falsePath
// Für Remember me & I accept the Legal notice

function toggleCheckbox(imageId) {
  const img = document.getElementById(imageId);
  const falsePath = './assets/img/png/check-button-false.png';
  const truePath  = './assets/img/png/check-button-true.png';

  if (img.src.includes("check-button-false.png")) {
    img.src = truePath;
  } else {
    img.src = falsePath;
  }
}
