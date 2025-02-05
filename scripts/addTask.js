/***********************
 * Global variables
 ***********************/
let selectedContacts = [];
let userId = [];
let selectedPrio = "medium";
let subTasks = [];
let editSubTaskIndex = null;
let taskStatus = "todo";
let selectedButton = "medium";

/**
 * Displays an overlay indicating a task has been added to the board, waits briefly,
 * and applies a sliding animation effect.
 * @async
 * @function openAddTaskDialogFeedback
 * @returns {Promise<void>} A promise that resolves once the overlay is made visible.
 */
async function openAddTaskDialogFeedback() {
  let overlayFeedback = document.getElementById("task_added_overlay");
  overlayFeedback.innerHTML = "";
  overlayFeedback.innerHTML = taskAddedToBoard();
  await wait(10);
  let slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.classList.toggle("visible");
}

/**
 * Pauses execution for a specified number of milliseconds.
 * @function wait
 * @param {number} ms - The duration to wait, in milliseconds.
 * @returns {Promise<void>} A promise that resolves after the given time has elapsed.
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Gathers input data from the task form fields.
 * @function collectTaskFormData
 * @returns {Object} An object containing task-related data.
 * @property {string} title - The task title.
 * @property {string} description - The task description.
 * @property {string} dueDate - The due date for the task.
 * @property {string} categorySeleced - The selected category text.
 * @property {number[]} assignedTo - The IDs of contacts assigned to the task.
 */
function collectTaskFormData() {
  let title = document.getElementById("title_input").value;
  let description = document.getElementById("description_textarea").value;
  let dueDate = document.getElementById("due_date").value;
  let categorySeleced = document.getElementById("category").innerText;
  let assignedTo = selectedContacts.map(Number);

  return { title, description, dueDate, categorySeleced, assignedTo };
}

/**
 * Manages the completion of task creation by showing feedback, waiting, and then
 * redirecting the user to the board page.
 * @async
 * @function manageTaskCreationCompletion
 * @returns {Promise<void>} A promise that resolves after the user is redirected.
 */
async function manageTaskCreationCompletion() {
  openAddTaskDialogFeedback();
  await wait(1111);
  window.location.href = "../html/board.html";
}

/**
 * Compiles an array of subtask objects from the global `subTasks` array.
 * @function collectSubtasks
 * @returns {Array<Object>} An array of subtask objects, each containing:
 *  - {string} subTaskName: The subtask name
 *  - {number} subId: The subtask's ID
 *  - {boolean} done: The completion status
 */
function collectSubtasks() {
  return subTasks.map((subName, index) => ({
    subTaskName: subName,
    subId: index + 1,
    done: false,
  }));
}

/**
 * Renders and displays the list of contacts, along with the active user, sorted alphabetically.
 * @function showContacts
 * @param {Object[]} contacts - An array of contact objects.
 * @returns {void}
 */
function showContacts(contacts) {
  document.getElementById("contact_contant").innerHTML = "";
  let userHtml = showAssignedUser(activeUser);
  document.getElementById("contact_contant").innerHTML = userHtml;
  contacts.sort((a, b) => a.name.localeCompare(b.name));
  for (let contact of contacts) {
    let contactHtml = showAssignedContactList(contact);
    document.getElementById("contact_contant").innerHTML += contactHtml;
  }
}

/**
 * Toggles a contact's assignment status to the task. Updates styles and global arrays accordingly.
 * @function addContactToTask
 * @param {string} CheckButtonId - The ID of the check button element.
 * @param {string} CheckTaskButton - The base name for the check button graphic.
 * @param {string} bgChange - The ID of the DOM element to change background styling.
 * @param {number} contactId - The unique identifier of the contact to add or remove.
 * @returns {void}
 */
function addContactToTask(CheckButtonId, CheckTaskButton, bgChange, contactId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  let existingContactIndex = selectedContacts.indexOf(contactId);
  if (existingContactIndex === -1) {
    addContactAssign(contactId);
  } else {
    removeContactAssign(existingContactIndex);
  }
}

/**
 * Toggles the active user's assignment status to the task. Updates styles and global arrays.
 * @function addUserToTask
 * @param {string} CheckButtonId - The ID of the check button element.
 * @param {string} CheckTaskButton - The base name for the check button graphic.
 * @param {string} bgChange - The ID of the DOM element to change background styling.
 * @param {number} activUserId - The unique identifier of the active user.
 * @returns {void}
 */
function addUserToTask(CheckButtonId, CheckTaskButton, bgChange, activUserId) {
  toggleCheckButton(CheckButtonId, CheckTaskButton);
  let colorChange = document.getElementById(bgChange);
  colorChange.classList.toggle("assigned-color-change");
  colorChange.classList.toggle("contact-list");
  let existingUserIndex = userId.indexOf(activUserId);
  if (existingUserIndex === -1) {
    addUserAssign(activUserId);
  } else {
    removeUserAssigned(existingUserIndex);
  }
}

/**
 * Adds a contact to the global `selectedContacts` array if not already present,
 * and updates the assigned contacts display.
 * @function addContactAssign
 * @param {number} contactId - The ID of the contact to add.
 * @returns {void}
 */
function addContactAssign(contactId) {
  if (!selectedContacts.some((contact) => contact.contactId === contactId)) {
    selectedContacts.push(contactId);
    updateSelectedContactsDisplay(contactId);
  }
}

/**
 * Adds the active user ID to the global `userId` array if not already present,
 * and updates the displayed user assignment.
 * @function addUserAssign
 * @param {number} activUserId - The ID of the active user.
 * @returns {void}
 */
function addUserAssign(activUserId) {
  if (!userId.some((user) => user.activUserId === activUserId)) {
    userId.push(activUserId);
    updateSelectedUserDisplay();
  }
}

/**
 * Removes a contact from the global `selectedContacts` array and updates the display.
 * @function removeContactAssign
 * @param {number} index - The index of the contact within `selectedContacts`.
 * @returns {void}
 */
function removeContactAssign(index) {
  if (index > -1) {
    selectedContacts.splice(index, 1);
    updateSelectedContactsDisplay(index);
  }
}

/**
 * Removes the active user assignment by clearing the global `userId` array and the associated display.
 * @function removeUserAssigned
 * @param {number} index - The index of the user within `userId`.
 * @returns {void}
 */
function removeUserAssigned(index) {
  if (index > -1) {
    userId = [];
    let selectedList = document.getElementById("activ_user");
    selectedList.innerHTML = "";
  }
}

/**
 * Updates the display of the selected user (active user) to show their initials and color badge.
 * @function updateSelectedUserDisplay
 * @returns {void}
 */
function updateSelectedUserDisplay() {
  let selectedList = document.getElementById("activ_user");
  selectedList.innerHTML = "";
  let userInitials = activeUser.initials;
  let activUserID = activeUser.id;
  let userColor = activeUser.color;
  selectedList.innerHTML += assignedUser(userInitials, activUserID, userColor);
}

/**
 * Displays the currently selected contacts by rendering their badges in a given container.
 * @function displaySelectedContacts
 * @param {Object[]} newContacts - An array of contact objects.
 * @param {HTMLElement} selectedList - The DOM element where contact badges will be displayed.
 * @returns {void}
 */
function displaySelectedContacts(newContacts, selectedList) {
  for (let i = 0; i < Math.min(selectedContacts.length); i++) {
    let contactId = Number(selectedContacts[i]);
    let activeContacts = newContacts.find(
      (contact) => contact.id === contactId
    );
    selectedList.innerHTML += assignedContacts(activeContacts);
  }
}

/**
 * Filters and displays contacts in the contact list based on user input in the search field.
 * @function searchContact
 * @returns {void}
 */
function searchContact() {
  let searContact = document.getElementById("assigned_to").value.toLowerCase();
  let filteredContacts = window.allContacts.filter((contact) =>
    contact.name.toLowerCase().includes(searContact)
  );
  showContacts(filteredContacts);
}

/**
 * Sets the global priority level for the task.
 * @function handleSelectedPriority
 * @param {string} priority - The selected priority (e.g., "urgent", "medium", "low").
 * @returns {void}
 */
function handleSelectedPriority(priority) {
  selectedPrio = `${priority}`;
}

/**
 * Updates the displayed task category and closes the category dropdown.
 * @function selectCategory
 * @param {string} category - The chosen category text (e.g., "Technical Task").
 * @returns {void}
 */
function selectCategory(category) {
  document.getElementById("category").innerText = category;
  closeSelectCategory();
  resetrequiredCategory();
}

/**
 * Saves the edited input of a subtask and closes the editing mode.
 * @function saveInput
 * @param {number} index - The index of the subtask in the `subTasks` array.
 * @returns {void}
 */
function saveInput(index) {
  let subInput = document.getElementById(`input_subtask_${index}`).value;
  document.getElementById(`list_subtask_${index}`).innerText = subInput;
  toggleSubtasksImgs(index);
  inputBlur(subInput, index);
  editSubTaskIndex = null;
}

/**
 * Enables editing of a specific subtask, populating an input field with current text and focusing it.
 * @function editSubtask
 * @param {HTMLElement} li - The list item element containing the subtask text.
 * @param {number} index - The index of the subtask in the `subTasks` array.
 * @returns {void}
 */
function editSubtask(li, index) {
  let currentText = li.innerText;
  let subInput = document.getElementById(`input_subtask_${index}`);
  operatePreviousEdit(index);
  editSubTaskIndex = index;
  operatePreviousEdit(index);
  subInput.value = currentText;
  toggleSubtasksImgs(index);
  subInput.focus();
}

/**
 * Restores the previous subtask edit state by toggling relevant icons, if another edit was in progress.
 * @function operatePreviousEdit
 * @param {number} index - The index of the subtask being edited.
 * @returns {void}
 */
function operatePreviousEdit(index) {
  if (editSubTaskIndex !== null && editSubTaskIndex !== index) {
    toggleSubtasksImgs(editSubTaskIndex);
  }
}

/**
 * Checks if the 'Enter' key was pressed, saves the subtask, and prevents default form behavior.
 * @function checkEnterKey
 * @param {KeyboardEvent} event - The keydown event object.
 * @param {number} index - The index of the subtask in the `subTasks` array.
 * @returns {boolean} Returns `false` if the Enter key was pressed to prevent default behavior, otherwise `true`.
 */
function checkEnterKey(event, index) {
  let subInput = document.getElementById(`input_subtask_${index}`);
  if (event.key === "Enter") {
    subInput.blur();
    saveInput(index);
    return false;
  }
  return true;
}

/**
 * Blurs the input field of a subtask and removes it if the input is empty, otherwise saves changes.
 * @function inputBlur
 * @param {string} li - The current subtask value from the input field.
 * @param {number} index - The index of the subtask in the `subTasks` array.
 * @returns {void}
 */
function inputBlur(li, index) {
  let input = document.getElementById(`list_subtask_${index}`).innerText;
  if (input.trim() !== "") {
    saveChanges(li, index);
  } else {
    removeSubtask(index);
    return;
  }
}

/**
 * Updates the subtask array with the newly edited subtask text.
 * @function saveChanges
 * @param {string} subtasksInput - The edited subtask text.
 * @param {number} index - The index of the subtask in the `subTasks` array.
 * @returns {void}
 */
function saveChanges(subtasksInput, index) {
  let newValue = subtasksInput;
  subTasks[index] = newValue;
}

/**
 * Removes the specified subtask from the array and updates the display.
 * @function removeSubtask
 * @param {number} index - The index of the subtask in the `subTasks` array.
 * @returns {void}
 */
function removeSubtask(index) {
  deleteSubtask(index);
  subTasks.splice(index, 1);
}

/**
 * Validates required task fields such as title, date, and category before task creation.
 * @function requiredFields
 * @returns {void}
 */
function requiredFields() {
  requiredTitle();
  requiredDate();
  requiredCategory();
}

/**
 * Checks if the title field is empty and applies visual alert styles if necessary.
 * @function requiredTitle
 * @returns {void}
 */
function requiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  if (title.value.trim() == "") {
    title.classList.add("alert-border");
    alertTitle.classList.remove("d-none");
  }
}
