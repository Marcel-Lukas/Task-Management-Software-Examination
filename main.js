
const BASE_URL = "https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/";


async function fetchData(path = "") {
  let response = await fetch(`${BASE_URL}/${path}/.json`);
  let datas = await response.json();
  if(datas === null){
    return null;
  };
  let dataArray = Array.isArray(datas) ? datas : Object.values(datas);
  return dataArray.filter(data => data !== null);
}


async function postData(path = "", data = {}) {
  let response = await fetch(`${BASE_URL}/${path}/.json`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}


async function deleteData(path = "", id) {
  let url = `${BASE_URL}/${path}/${id - 1}.json`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return await response.json();
}











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