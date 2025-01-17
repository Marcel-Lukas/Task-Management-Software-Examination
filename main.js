
const BASE_URL = "https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/";



async function includeHTML() {
  let includeElements = document.querySelectorAll('[w3-include-html]');
  for (let i = 0; i < includeElements.length; i++) {
      const element = includeElements[i];
      let file = element.getAttribute("w3-include-html");
      let resp = await fetch(file);
      if (resp.ok) {
          element.innerHTML = await resp.text();
      } else {
          element.innerHTML = 'Page not found';
      }
  }
}



function goBack() {
  window.history.back();
}




// https://www.thegamer.com/this-coconut-jpg-in-team-fortress-2s-game-files-if-deleted-breaks-the-game-and-no-one-knows-why/

function coconutMemeFunction() {
  const imageUrl = '../assets/img/coconut.jpg';
  const testImage = new Image();
  testImage.onerror = function() {
    document.documentElement.style.display = 'none';
  };
  testImage.src = imageUrl;
}
coconutMemeFunction();
