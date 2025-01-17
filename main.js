
const BASE_URL = "https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/";


// Rendert das Template für die Navigation und Header rein
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


// Für den Blauen Pfeil auf der Help seite
function goBack() {
  window.history.back();
}


// Setzt in der Aside Navigation die active Background Color #091931
function extractFilename(url) {
  const urlObj = new URL(url);
  const pathname = urlObj.pathname;
  const filenameWithExtension = pathname.substring(pathname.lastIndexOf('/') + 1);
  const filename = filenameWithExtension.split('.').slice(0, -1).join('.');
  return filename;
} 

function activeLink() {
  setTimeout(() => {
    const url = window.location.href;
    const filename = extractFilename(url);
    if(document.querySelector(`#${filename}`)) {
        document.querySelector(`#${filename}`).classList.add('active');
    }
  }, 150);
}
activeLink();




// Coconut killswitch weil lustig :P
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
