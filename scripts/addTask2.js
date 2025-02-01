/**
 * Checks if the due date is valid and not in the past, applying visual alerts if invalid.
 * @function requiredDate
 * @returns {boolean} Returns `true` if the date is valid, otherwise `false`.
 */
function requiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  let today = new Date();
  if (date.value.trim() == "" || new Date(date.value) < today) {
    date.classList.add("alert-border");
    alertDate.classList.remove("d-none");
    return false;
  } else {
    date.classList.remove("alert-border");
    alertDate.classList.add("d-none");
    return true;
  }
}

/**
 * Checks if a task category has been selected; applies visual alerts if not.
 * @function requiredCategory
 * @returns {void}
 */
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

/**
 * Resets all alert styles for required fields (title, date, category).
 * @function resetrequiredFields
 * @returns {void}
 */
function resetrequiredFields() {
  resetrequiredTitle();
  resetrequiredDate();
  resetrequiredCategory();
}

/**
 * Removes the alert styling from the title field.
 * @function resetrequiredTitle
 * @returns {void}
 */
function resetrequiredTitle() {
  let title = document.getElementById("title_input");
  let alertTitle = document.getElementById("title_field_alert");
  title.classList.remove("alert-border");
  alertTitle.classList.add("d-none");
}

/**
 * Removes the alert styling from the date field.
 * @function resetrequiredDate
 * @returns {void}
 */
function resetrequiredDate() {
  let date = document.getElementById("due_date");
  let alertDate = document.getElementById("date_field_alert");
  date.classList.remove("alert-border");
  alertDate.classList.add("d-none");
}

/**
 * Resets category selection styling if a valid category is set.
 * @function resetrequiredCategory
 * @returns {void}
 */
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

/**
 * Closes select dropdowns if the user clicks outside certain task elements.
 * @function closeTaskIfOutside
 * @param {Event} event - The DOM click event.
 * @returns {void}
 */
function closeTaskIfOutside(event) {
  if (event.target.id === 'add_task_board' || 'edit_task_board' || 'add_task_content') {
    closeSelect();
    closeSelectCategory();
  }
}


/**
 * Selects a priority level for a task and updates the UI to reflect the chosen priority.
 * @function selectPrio
 * @param {string} priority - The chosen priority (e.g., "low", "medium", "urgent").
 * @returns {void}
 */
function selectPrio(priority) {
  let prios = ["low", "medium", "urgent"];
  prios.forEach((prio) => resetPrio(prio));
  setPrio(priority);
  selectedButton = priority;
  handleSelectedPriority(selectedButton);
}

/**
 * Resets the priority button styling to its default (non-clicked) state.
 * @function resetPrio
 * @param {string} prio - The priority level to reset (e.g., "low", "medium", "urgent").
 * @returns {void}
 */
function resetPrio(prio) {
  let prioButton = document.getElementById(`${prio}_span`);
  let prioColoredRef = document.getElementById(`prio_${prio}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${prio}_white`);
  prioButton.classList.remove(`clicked-${prio}`);
  prioButton.classList.add(`${prio}-button`);
  prioColoredRef.classList.remove("d-none");
  prioWhiteRef.classList.add("d-none");
}

/**
 * Applies styling to indicate the newly selected priority and toggles relevant icons.
 * @function setPrio
 * @param {string} priority - The priority level to set (e.g., "low", "medium", "urgent").
 * @returns {void}
 */
function setPrio(priority) {
  let prioButton = document.getElementById(`${priority}_span`);
  let prioColoredRef = document.getElementById(`prio_${priority}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${priority}_white`);
  prioButton.classList.remove(`${priority}-button`);
  prioButton.classList.add(`clicked-${priority}`);
  prioColoredRef.classList.add("d-none");
  prioWhiteRef.classList.remove("d-none");
}

/**
 * Opens the "Assigned" dropdown menu for selecting contacts.
 * @function openSelect
 * @returns {void}
 */
function openSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_inactiv").classList.add("d-none");
    document.getElementById("assigned_activ").classList.remove("d-none");
  }
}

/**
 * Closes the "Assigned" dropdown menu.
 * @function closeSelect
 * @returns {void}
 */
function closeSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_activ").classList.add("d-none");
    document.getElementById("assigned_inactiv").classList.remove("d-none");
  }
}

/**
 * Opens the category selection dropdown and populates it with category options.
 * @function openSelectCategory
 * @returns {void}
 */
function openSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_inactiv").classList.add("d-none");
    document.getElementById("category_activ").classList.remove("d-none");
    document.getElementById("category_task_contant").innerHTML = showCategory();
  }
}

/**
 * Closes the category selection dropdown.
 * @function closeSelectCategory
 * @returns {void}
 */
function closeSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_activ").classList.add("d-none");
    document.getElementById("category_inactiv").classList.remove("d-none");
  }
}

/**
 * Opens the subtask input area to allow the user to add subtasks.
 * @function openSubtasks
 * @returns {void}
 */
function openSubtasks() {
  if ((onclick = true)) {
    document.getElementById("subtasks_inactiv_img").classList.add("d-none");
    document.getElementById("subtasks_activ_img").classList.remove("d-none");
  }
}

/**
 * Clears all input fields and resets certain global variables related to the task form.
 * @function clearButton
 * @returns {void}
 */
function clearButton() {
  document.getElementById("title_input").value = "";
  document.getElementById("description_textarea").value = "";
  document.getElementById("due_date").value = "";
  let existingUserIndex = userId.map(Number);
  removeUserAssigned(existingUserIndex);
  selectedContacts.length = 0;
  updateSelectedContactsDisplay();
  getContacts();
  selectPrio("medium");
  document.getElementById("category").innerText = "Select task category";
  subTasks.length = 0;
  document.getElementById("subtasks_list").innerHTML = "";
}

/**
 * Manages the addition of a subtask, including toggling icons and clearing the input field.
 * @function addSubtasksManage
 * @returns {void}
 */
function addSubtasksManage() {
  toggleSubtaskIcons();
  let subtasksInput = document.getElementById("subtasks_input").value;

  if (subtasksInput.trim() !== "") {
    addSubtaskToList(subtasksInput);
    document.getElementById("subtasks_input").value = "";
  }
}

/**
 * Toggles subtask icons between active and inactive states.
 * @function toggleSubtaskIcons
 * @returns {void}
 */
function toggleSubtaskIcons() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
}

/**
 * Adds a new subtask to the global `subTasks` array and renders it in the subtask list.
 * @function addSubtaskToList
 * @param {string} subtasksInput - The text of the new subtask.
 * @returns {void}
 */
function addSubtaskToList(subtasksInput) {
  subTasks.push(subtasksInput);
  let ids = subTasks.length;
  document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
    subtasksInput,
    ids - 1
  );
}

/**
 * Executes actions related to subtasks by opening the subtasks interface,
 * managing additional subtasks setup, and toggling the visibility of subtasks images.
 *
 * This function calls external functions `openSubtasks()` and `addSubtasksManage()`,
 * then hides the element with the ID "subtasks_inactiv_img" and shows the element with the ID "subtasks_activ_img".
 *
 * @function handleSubtasks
 */
function handleSubtasks() {
  openSubtasks();
  addSubtasksManage();
  document.getElementById("subtasks_inactiv_img").classList.add("d-none");
  document.getElementById("subtasks_activ_img").classList.remove("d-none");
}

/**
 * Initializes event listeners for the subtasks input field and inactive subtasks image.
 *
 * This function sets up a keydown listener on the element with the ID "subtasks_input" that listens
 * for the Enter key. When the Enter key is pressed, it prevents the default behavior and triggers the subtasks handling.
 * Additionally, it sets up a click listener on the element with the ID "subtasks_inactiv_img" to trigger the same actions.
 *
 * @function enterValue
 */
function enterValue() {
  document.getElementById("subtasks_input")
    .addEventListener("keydown", e => e.key === "Enter" && (e.preventDefault(), handleSubtasks()));
  document.getElementById("subtasks_inactiv_img")
    .addEventListener("click", handleSubtasks);
}

/**
 * Resets subtask icons to inactive if the user clicks outside the subtask area.
 * @function changeSubtasksImages
 * @param {Event} event - The DOM click event.
 * @returns {void}
 */
function changeSubtasksImages(event) {
  if (
    event.target.id === "add_task_board" ||
    "edit_task_board" ||
    "add_task_content"
  ) {
    document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
    document.getElementById("subtasks_activ_img").classList.add("d-none");
  }
}

/**
 * Prevents further propagation of a click event, often used to stop unwanted side effects.
 * @function changeSubtasksImgPrevention
 * @param {Event} event - The DOM event to stop propagating.
 * @returns {void}
 */
function changeSubtasksImgPrevention(event) {
  event.stopPropagation();
}

/**
 * Cancels any subtask input operation, resets icons, and clears the input field.
 * @function cancelSubtasks
 * @returns {void}
 */
function cancelSubtasks() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
  document.getElementById("subtasks_input").value = "";
}

/**
 * Removes a subtask from the global `subTasks` array and the DOM.
 * @function deleteSubtask
 * @param {number} id - The index of the subtask to delete.
 * @returns {void}
 */
function deleteSubtask(id) {
  document.getElementById(`listItem_${id}`).remove();
  document.getElementById(`listItem_input_${id}`).remove();
  subTasks.splice(id, 1);
  editSubTaskIndex = null;
}

/**
 * Toggles between active and inactive UI states for a specific subtask (text or input field).
 * @function toggleSubtasksImgs
 * @param {number} id - The index of the subtask to toggle.
 * @returns {void}
 */
function toggleSubtasksImgs(id) {
  document.getElementById(`list_imgs_activ_${id}`).classList.toggle("d-none");
  document.getElementById(`list_imgs_inactiv_${id}`).classList.toggle("d-none");
  document.getElementById(`listItem_${id}`).classList.toggle("d-none");
  document.getElementById(`listItem_${id}`).classList.toggle("list-item");
  document.getElementById(`input_subtask_${id}`).classList.toggle("d-none");
}

/**
 * Validates the required form inputs and either processes or rejects the form submission accordingly.
 * @function enableButton
 * @returns {void}
 */
function enableButton() {
  let input = getInputValues();
  let category = getCategoryValue();
  if (isFormComplete(input, category)) {
    processValidForm();
  } else {
    processInvalidForm();
  }
}

/**
 * Retrieves trimmed input values from the form fields (title and date).
 * @function getInputValues
 * @returns {Object} An object containing the trimmed title and date.
 * @property {string} input - The trimmed task title.
 * @property {string} date - The trimmed task date.
 */
function getInputValues() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}

/**
 * Retrieves the currently selected category text.
 * @function getCategoryValue
 * @returns {string} The selected category text.
 */
function getCategoryValue() {
  return document.getElementById("category").innerText;
}

