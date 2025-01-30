/**
 * Checks if the form is valid by ensuring title, date, and category are set appropriately
 * and that the date is not in the past.
 * @function isFormComplete
 * @param {Object} input - The object containing trimmed title and date.
 * @param {string} category - The category text.
 * @returns {boolean} True if the form is valid, otherwise false.
 */
function isFormComplete(input, category) {
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let selectedDate = new Date(input.date);
  selectedDate.setHours(0, 0, 0, 0);
  return (
    input.input !== "" &&
    input.date !== "" &&
    selectedDate >= today &&
    (category === "Technical Task" || category === "User Story")
  );
}

/**
 * Resets any required field alerts and proceeds to create the task if the form is valid.
 * @function processValidForm
 * @returns {void}
 */
function processValidForm() {
  resetrequiredFields();
  createTask();
}

/**
 * Calls the function to highlight required fields and show relevant alerts for an invalid form.
 * @function processInvalidForm
 * @returns {void}
 */
function processInvalidForm() {
  requiredFields();
}

/**
 * Sets the minimum selectable date in the date input field to today's date and clears the field value.
 * @function setDate
 * @returns {void}
 */
function setDate() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();
  let formattedDate = `${yyyy}-${mm}-${dd}`;
  let dueDateInput = document.getElementById("due_date");
  dueDateInput.setAttribute("min", formattedDate);
  dueDateInput.value = "";
}

/**
 * Fetches and loads an external HTML template for the task form, optionally clears it,
 * fetches the user's contacts, and sets initial date and form states.
 * @async
 * @function initTemplateAddTask
 * @param {string} domLocation - The ID of the DOM element where the template will be injected.
 * @param {boolean} clear - A flag indicating whether to clear the template or not.
 * @returns {Promise<void>}
 */
async function initTemplateAddTask(domLocation, clear) {
  let response = await fetch("../assets/templates/taskTemplate.html");
  let data = await response.text();
  document.getElementById(domLocation).innerHTML = data;
  clearTemplate(clear);
  getContacts();
  setDate();
  if (clear) {
    clearButton();
    renderEditButtons();
  }
}

/**
 * Clears either the edit task template or the add task template depending on the boolean argument.
 * @function clearTemplate
 * @param {boolean} clear - If true, clears the edit task template; if false, clears the add task template.
 * @returns {void}
 */
function clearTemplate(clear) {
  if (clear === true) {
    document.getElementById("edit_task_template").innerHTML = "";
  } else if (clear === false) {
    document.getElementById("add_task_template").innerHTML = "";
  }
}

/**
 * Adjusts the UI classes for the edit mode buttons if the form is cleared.
 * @function renderEditButtons
 * @returns {void}
 */
function renderEditButtons() {
  document.getElementById("content_order").classList.add("content-order");
  document.getElementById("content_order").classList.remove("edit-content-order");
  document.getElementById("bottom_button_order").classList.remove("edit-bottom-button-order");
  document.getElementById("create_button_div").classList.remove("edit-ok-button");
}

/**
 * Creates a new task by collecting form data and assigning a new ID, then updates the database.
 * @async
 * @function createTask
 * @returns {Promise<void>}
 */
async function createTask() {
  let taskData = collectTaskFormData();
  let taskId = await getNewId("tasks");

  setTaskData(taskData, taskId);
  await manageTaskCreationCompletion(taskId);
}

/**
 * Constructs the task data object and posts it to the database.
 * Also assigns the task to the current user.
 * @function setTaskData
 * @param {Object} taskData - The task-related data (title, description, date, etc.).
 * @param {number} taskId - The unique ID for this task.
 * @returns {void}
 */
function setTaskData(taskData, taskId) {
  putTasksContent(
    taskData.title,
    taskData.description,
    taskData.dueDate,
    taskId,
    taskData.assignedTo,
    taskData.categorySeleced
  );
  putTaskToUser(taskId);
}

/**
 * Posts a new task ID to the currently active user's tasks, then updates the database record.
 * If an error occurs, it reverts the change.
 * @async
 * @function putTaskToUser
 * @param {number} taskId - The unique ID of the newly created task.
 * @returns {Promise<void>}
 */
async function putTaskToUser(taskId) {
  if (!activeUser.tasks.includes(taskId)) {
    activeUser.tasks.push(taskId);
    localStorage.setItem("activeUser", JSON.stringify(activeUser));
    try {
      await updateUserTaskInDatabase(activeUser.id, taskId);
    } catch (error) {
      console.error("Fehler beim Hinzufügen des Tasks:", error);
      activeUser.tasks.pop();
      localStorage.setItem("activeUser", JSON.stringify(activeUser));
    }
  }
}

/**
 * Updates the user's task list in the database by adding the new task ID, if the user is not a guest.
 * @async
 * @function updateUserTaskInDatabase
 * @param {number} userId - The ID of the currently active user.
 * @param {number} taskId - The ID of the newly created task to add.
 * @returns {Promise<void|any>} A promise resolving to the result of posting the new task, or void.
 */
async function updateUserTaskInDatabase(userId, taskId) {
  if (userId != 0) {
    let path = `users/${userId - 1}/tasks/${activeUser.tasks.length - 1}`;
    return postData(path, taskId);
  }
}

/**
 * Posts task content data to the database, including title, description, date, priority, and more.
 * @function putTasksContent
 * @param {string} title - The task title.
 * @param {string} description - The task description.
 * @param {string} dueDate - The task's due date.
 * @param {number} taskId - The unique ID for this task.
 * @param {number[]} assignedTo - An array of contact IDs assigned to this task.
 * @param {string} categorySeleced - The category text selected for this task.
 * @returns {void}
 */
function putTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced) {
  postData(`tasks/${taskId - 1}/`, {
    title: title,
    description: description,
    date: dueDate,
    priority: selectedPrio,
    category: categorySeleced,
    id: taskId,
    subtasks: collectSubtasks(),
    assigned: assignedTo,
    status: taskStatus,
    user: Number(userId[0]),
  });
}

/**
 * Fetches the logged-in user's contacts from the database, filters them based on the active user's contact IDs,
 * and displays them.
 * @async
 * @function getContacts
 * @returns {Promise<void>}
 */
async function getContacts() {
  document.getElementById("contact_contant").innerHTML = "";
  let contacts = await fetchData("contacts");
  let userContacts = activeUser.contacts;
  let contactsToRender = contacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  showContacts(contactsToRender);
}

/**
 * Updates the display of selected contacts (the badges under the task form), fetching new data if needed.
 * @async
 * @function updateSelectedContactsDisplay
 * @returns {Promise<void>}
 */
async function updateSelectedContactsDisplay() {
  let newContacts = await fetchData("contacts");
  let selectedList = document.getElementById("selected_contacts");
  selectedList.innerHTML = "";
  let userContacts = activeUser.contacts;
  let contactsToRender = newContacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  displaySelectedContacts(contactsToRender, selectedList);
}
