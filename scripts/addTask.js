let selectedContacts = [];
let userId = [];
let selectedPrio = "medium";
let subTasks = [];
let editSubTaskIndex = null;
let taskStatus = "todo";
let selectedButton = "medium";


async function openAddTaskDialogFeedback() {
  let overlayFeedback = document.getElementById("task_added_overlay");
  overlayFeedback.innerHTML ="";
  overlayFeedback.innerHTML = taskAddedToBoard();
  await sleep(10);
  let slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.classList.toggle("visible");
}


function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


function getTaskFormData() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let assignedTo = selectedContacts.map(Number);

  return { title, description, dueDate, categorySeleced, assignedTo };
}


async function handleTaskCreationCompletion() {
  openAddTaskDialogFeedback();
  await sleep(1500);
  window.location.href = "../html/board.html";
}


function getSubtasks() {  
  return subTasks.map((subName, index) => ({
    subTaskName: subName,
    subId: index + 1,
    done: false,
  }));
}


function displayContacts(contacts) {
  document.getElementById("contact_contant").innerHTML = "";
  let userHtml = showAssignedUser(activeUser);
  document.getElementById("contact_contant").innerHTML = userHtml;
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  for (let contact of contacts) {
    let contactHtml = showAssignedContactList(contact);
    document.getElementById("contact_contant").innerHTML += contactHtml;
  }
}


function addContactToTask(CheckButtonId, CheckTaskButton, bgChange, contactId) {  
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  let existingContactIndex = selectedContacts.indexOf(contactId);
  if (existingContactIndex === -1) {
    addContactAssigned(contactId);
  } else {
    removeContactAssigned(existingContactIndex);
  }
}


function addUserToTask(CheckButtonId, CheckTaskButton, bgChange, activUserId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  let existingUserIndex = userId.indexOf(activUserId);
  if (existingUserIndex === -1) {
    addUserAssigned(activUserId);
  } else {
    removeUserAssigned(existingUserIndex);
  }
}


function addContactAssigned(contactId) {
  if (!selectedContacts.some((contact) => contact.contactId === contactId)) {
    selectedContacts.push(contactId);
    updateSelectedContactsDisplay(contactId);
  }
}


function addUserAssigned(activUserId) {
  if (!userId.some((user) => user.activUserId === activUserId)) {
    userId.push(activUserId);
    updateSelectedUserDisplay();
  }
}


function removeContactAssigned(index) {
  if (index > -1) {
    selectedContacts.splice(index, 1);
    updateSelectedContactsDisplay(index);
  }
}


function removeUserAssigned(index) {
  if (index > -1) {
    userId = [];
    let selectedList = document.getElementById("activ_user");
    selectedList.innerHTML = "";
  }
}


function updateSelectedUserDisplay() {
  let selectedList = document.getElementById("activ_user");
  selectedList.innerHTML = "";
  let userInitials = activeUser.initials;
  let activUserID = activeUser.id;
  let userColor = activeUser.color;
  selectedList.innerHTML += assignedUser(userInitials, activUserID, userColor);
}


function displaySelectedContacts(newContacts, selectedList) {
  for (let i = 0; i < Math.min(selectedContacts.length); i++) {
    let contactId = Number(selectedContacts[i]);
    let activeContacts = newContacts.find(
      (contact) => contact.id === contactId
    );
    selectedList.innerHTML += assignedContacts(activeContacts);
  }
}


function searchContact() {
  let searContact = document.getElementById("assigned_to").value.toLowerCase();
  let filteredContacts = window.allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searContact)
  );
  displayContacts(filteredContacts);
}


function handleSelectedPriority(priority) {
  selectedPrio = `${priority}`;
}


function selectCategory(category) {
  document.getElementById("category").innerText = category;
  closeSelectCategory();
  resetrequiredCategory();
}


function saveInput(index) {
  let subInput = document.getElementById(`input_subtask_${index}`).value;
  document.getElementById(`list_subtask_${index}`).innerText = subInput;
  toggleSubtasksImgs(index);
  handleInputBlur(subInput, index);
  editSubTaskIndex = null;
  // if (subInput == "") {
  //   deleteSubtask(index);
  // }
}


function editSubtask(li, index) {
  let currentText = li.innerText;
  let subInput = document.getElementById(`input_subtask_${index}`);
  handlePreviousEdit(index);
  editSubTaskIndex = index;
  handlePreviousEdit(index);
  subInput.value = currentText;
  toggleSubtasksImgs(index);
  subInput.focus();
}


function handlePreviousEdit(index) {
  if (editSubTaskIndex !== null && editSubTaskIndex !== index) {
    toggleSubtasksImgs(editSubTaskIndex);
  }
}


function checkEnterKey(event, index) {
  let subInput = document.getElementById(`input_subtask_${index}`);
  if (event.key === "Enter") {
    subInput.blur();
    saveInput(index);
    return false;
  }
  return true;
}


function handleInputBlur(li, index) {
  let input = document.getElementById(`list_subtask_${index}`).innerText;
  if (input.trim() !== "") {
    saveChanges(li, index);
  } else {
    removeSubtask(index);
    return;
  }
}


function saveChanges(subtasksInput, index) {
  let newValue = subtasksInput;
  subTasks[index] = newValue;
}


function removeSubtask(index) {
  deleteSubtask(index) 
  subTasks.splice(index, 1);
}


function requiredFields() {
  requiredTitle();
  requiredDate();
  requiredCategory();
}


function requiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  if (title.value.trim() == "") {
    title.classList.add("alert-border");
    alertTitle.classList.remove("d-none");
  }
}


function requiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  if (date.value.trim() == "") {
    date.classList.add("alert-border");
    alertDate.classList.remove("d-none");
  }
}


function requiredCategory() {
  let categoryValue = document.getElementById("category");
  let category = document.getElementById("category_contant");
  let alertCategory = document.getElementById("category_field_alert");
  if (categoryValue.innerText === "Select task category") {
    category.classList.add("alert-border");
    alertCategory.classList.remove("d-none");
    category.classList.remove("category-container");
  }
}


function resetrequiredFields() {
  resetrequiredTitle();
  resetrequiredDate();
  resetrequiredCategory();
}


function resetrequiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  title.classList.remove("alert-border");
  alertTitle.classList.add("d-none");
}


function resetrequiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  date.classList.remove("alert-border");
  alertDate.classList.add("d-none");
}


function resetrequiredCategory() {
  let categoryValue = document.getElementById("category");
  let category = document.getElementById("category_contant");
  let alertCategory = document.getElementById("category_field_alert");
  if ((categoryValue.innerText === "Technical Task" || "User Story")) {
    category.classList.remove("alert-border");
    alertCategory.classList.add("d-none");
    category.classList.add("category-container");
  }
}


function closeTaskIfOutside(event) {
  if (event.target.id === 'add_task_board'||'edit_task_board'||'add_task_content') {
    closeSelect();
    closeSelectCategory();
  }
}