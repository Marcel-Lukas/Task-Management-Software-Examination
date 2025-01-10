
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


function showUserMenu (){
  let userMenu = document.getElementById('user-menu');
  userMenu.classList.toggle('d-none');
  if(!userMenu.classList.contains('shift-in')) {
      userMenu.classList.add('shift-in');
  }else {
      userMenu.classList.remove('shift-in');
  }
}


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


function goBack() {
  window.history.back();
}