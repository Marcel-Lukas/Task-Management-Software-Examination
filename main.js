const BASE_URL = "https://kanban-board-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/";

let activeUser = getActiveUser();


/**
 * Fetches data from the specified database path.
 *
 * @async
 * @function fetchData
 * @param {string} [path=""] - The relative path in the database to fetch from.
 * @returns {Promise<Array|null>} - Resolves to an array of data entries or null if no data is found.
 */
async function fetchData(path = "") {
  const response = await fetch(`${BASE_URL}/${path}/.json`);
  const data = await response.json();

  if (data === null) {
    return null;
  }

  const dataArray = Array.isArray(data) ? data : Object.values(data);
  return dataArray.filter(item => item !== null);
}


/**
 * Uploads data to the specified database path using a PUT request.
 *
 * @async
 * @function postData
 * @param {string} [path=""] - The database path where the data will be stored.
 * @param {*} [data={}] - The data to upload.
 * @returns {Promise<Object>} - Resolves to the JSON response from the server.
 * @throws {Error} - If the HTTP request fails.
 */
async function postData(path = "", data = {}) {
  const response = await fetch(`${BASE_URL}/${path}/.json`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  return response.json();
}


/**
 * Deletes data from the specified database path and ID.
 *
 * @async
 * @function deleteData
 * @param {string} [path=""] - The database path from which data will be deleted.
 * @param {*} id - The identifier of the element to be deleted.
 * @returns {Promise<Object>} - Resolves to the JSON response from the server.
 * @throws {Error} - If the HTTP request fails.
 */
async function deleteData(path = "", id) {
  const url = `${BASE_URL}/${path}/${id - 1}.json`;
  const response = await fetch(url, { method: "DELETE" });

  if (!response.ok) {
    throw new Error(`Error! Status: ${response.status}`);
  }

  return response.json();
}


/**
 * Fetches data from the specified path and generates a new unique ID.
 *
 * @async
 * @param {string} [path=""] - The API endpoint path.
 * @returns {number} A newly generated ID.
 */
async function getNewId(path = "") {
  let response = await fetch(`${BASE_URL}/${path}/.json`);
  let responseToJson = await response.json();
  let newUserId;
  if (responseToJson == null) {
    newUserId = 1;
  } else {
    newUserId = countId(responseToJson);
  }
  return newUserId;
}


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
 * Retrieves the active user's data from local storage.
 *
 * @returns {object} The active user's data.
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
    console.error("Error retrieving active user:", error);
    return {};
  }
}


/**
 * Toggles the check button image between "true" and "false" states.
 *
 * @param {string} checkButtonId - The ID of the check button element in the DOM.
 * @param {string} checkTaskButton - The identifier or name used in the image path.
 */
function toggleCheckButton(checkButtonId, checkTaskButton) {
  const checkButton = document.getElementById(checkButtonId);
  const isChecked = checkButton.src.includes("true");
  checkButton.src = `../assets/img/png/check-${checkTaskButton}-${
    isChecked ? "false" : "true"
  }.png`;
}


/**
 * Opens a specified URL in a new browser tab.
 *
 * @param {string} linkToSide - The URL to be opened in a new tab.
 */
function openLegal(linkToSide) {
  window.open(linkToSide, "_blank");
}


/**
 * Navigates the browser to the previous page in history.
 */
function goBack() {
  window.history.back();
}


/**
 * Prevents the event from propagating up the DOM tree.
 *
 * @param {Event} event - The event object.
 */
function bubblingPrevention(event) {
  event.stopPropagation();
}


/**
 * Removes the active user's data from local storage and redirects to the login page.
 */
function logOut() {
  localStorage.removeItem("activeUser");
  window.location.href = "../index.html";
}
