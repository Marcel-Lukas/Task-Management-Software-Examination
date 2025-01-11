const BASE_URL =
"https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/";

let activeUser = getActiveUser();


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


function countId(responseToJson) {
let keys = Object.keys(responseToJson);
let lastKey = keys[keys.length - 1];
let countId = responseToJson[lastKey].id;
countId++;
return countId;
}


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


async function resetTheDatabase() {
for (let index = 0; index < dbBackupTask.length; index++) {
    await postData(`tasks/${index}/`, dbBackupTask[index]);
    await postData(`contacts/${index}/`, dbBackupContacts[index]);
}  
}


function toggleCheckButton(CheckButtonId, CheckTaskButton) {
let checkButton = document.getElementById(CheckButtonId);
let isChecked = checkButton.src.includes("true");
checkButton.src = `../assets/img/png/check-${CheckTaskButton}-${
  isChecked ? "false" : "true"
}.png`;
}


function openLegal(LinkToSide) {
let targetUrl = LinkToSide;
window.open(targetUrl, "_blank");
}


function goBack() {
window.history.back();
}


function bubblingPrevention(event) {
event.stopPropagation();
}


function logOut() {
localStorage.removeItem("activeUser");
window.location.href = "../index.html";  
}