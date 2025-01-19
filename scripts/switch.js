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