const BASE_URL = "https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/";

let activeUser = getActiveUser();

/**
 * Downloads the data from the database depending on the deposit and ID.
 * 
 * @param {string} path - The path in the database from where to load the data.
 * @returns {Array} - Downloaded data.
 */
async function fetchData(path = "") {
  let response = await fetch(`${BASE_URL}/${path}/.json`);
  let datas = await response.json();
  if(datas === null){
    return null;
  };
  let dataArray = Array.isArray(datas) ? datas : Object.values(datas);
  return dataArray.filter(data => data !== null);
}

/**
 * Uploads the data from the database depending on the deposit and ID.
 * 
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @param {*} data - Data to be uploaded
 */
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

/**
 * Deletes the data from the database depending on the deposit and the ID.
 * 
 * @param {string} path - The path in the database for which a new ID should be generated.
 * @param {*} id - Id of the element to be deleted
 */
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

/**
 * Fetches data from the specified path and generates a new unique ID.
 * 
 * @param {string} path - The API endpoint path
 * @returns {Number} - New ID
 */


/**
 * Calculates the next available ID based on the last entry in the response.
 * 
 * @param {Object} responseToJson - The JSON response object containing existing entries
 * @returns {number} - The next available ID
 */
function countId(responseToJson) {
  let keys = Object.keys(responseToJson);
  let lastKey = keys[keys.length - 1];
  let countId = responseToJson[lastKey].id;
  countId++;
  return countId;
}

/**
 * Loads the user's data for the activeUser into the LocalStorage.
 * 
 * @returns {Objekt} - ActiveUser data 
 */
function getActiveUser() {
  try {
    const STORED_USER = localStorage.getItem("activeUser");
    if (STORED_USER) {
      return JSON.parse(STORED_USER);
    } else {
      return {};
    }
  } catch (error) {
    console.error("Fehler beim Abrufen des activeUser:", error);
    return {};
  }
}

/**
 * Resets the default tasks and contacts in the database.
 */
async function resetTheDatabase() {
  for (let index = 0; index < dbBackupTask.length; index++) {
      await postData(`tasks/${index}/`, dbBackupTask[index]);
      await postData(`contacts/${index}/`, dbBackupContacts[index]);
  }  
}

/**
 * Changes the image of the check button.
 * 
 * @param {number} CheckButtonId - Id of the check-button
 * @param {HTMLElement} CheckTaskButton - The HTML element where the button is displayed
 */
function toggleCheckButton(CheckButtonId, CheckTaskButton) {
  let checkButton = document.getElementById(CheckButtonId);
  let isChecked = checkButton.src.includes("true");
  checkButton.src = `../assets/img/png/check-${CheckTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}

/**
 * Opens a specified URL in a new browser tab.
 * 
 * @param {string} LinkToSide - The URL to be opened in a new tab.
 */
function openLegal(LinkToSide) {
  let targetUrl = LinkToSide;
  window.open(targetUrl, "_blank");
}

/**
 * Navigates the browser to the previous page in history.
 */
function goBack() {
  window.history.back();
}

/**
 * Prevents event bubbling up the DOM tree.
 * 
 * @param {Event} event - The event object
 */
function bubblingPrevention(event) {
  event.stopPropagation();
}

/**
 * Deletes the activeUser data and redirects to the log in page
 */
function logOut() {
  localStorage.removeItem("activeUser");
  window.location.href = "../index.html";  
}

/**
 * This is a little easteregg function based on this funny story (to read under the following url)
 * https://www.thegamer.com/this-coconut-jpg-in-team-fortress-2s-game-files-if-deleted-breaks-the-game-and-no-one-knows-why/
 * This function attempts to load the 'coconut.jpg' image by creating a new Image instance.
 * If loading fails (onerror event), it sets the display style of the entire HTML document 
 * to 'none', effectively hiding the page when 'coconut.jpg' cannot be found or loaded.
 * So do not touch the coconut.jpg! xD
 */
function checkCoconutMeme() {
  const img = new Image();
  img.onerror = () => document.documentElement.style.display = 'none';
  img.src = '../assets/img/coconut.jpg';
}
checkCoconutMeme();