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
