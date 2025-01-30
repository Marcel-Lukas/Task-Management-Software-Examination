/**
 * Possible task statuses in the workflow.
 * @constant {string[]}
 */
const STATUSES = ["todo", "inprogress", "awaitfeedback", "done"];

/**
 * Stores the current element (task) being dragged.
 * @type {number|undefined}
 */
let currentDraggedElement;

/**
 * Toggles the visibility of a specified overlay section. If the overlay is shown,
 * scrolling on the main page is disabled; otherwise, scrolling is restored.
 * @function toggleOverlay
 * @param {string} section - The ID of the overlay element to toggle.
 * @returns {void}
 */
function toggleOverlay(section) {
  let refOverlay = document.getElementById(section);
  refOverlay.classList.toggle("d-none");
  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      refOverlay.classList.add("active", "visible");
    }, 50);
  } else {
    document.body.style.overflow = "auto";
    refOverlay.classList.remove("active", "visible");
  }
}

/**
 * Moves a task to a new status based on its current status index and a directional step.
 * @async
 * @function moveToStatus
 * @param {number} taskId - The unique identifier of the task.
 * @param {string} status - The current status of the task.
 * @param {number} moveToDirection - The direction to move (1 for forward, -1 for backward).
 * @returns {Promise<void>}
 */
async function moveToStatus(taskId, status, moveToDirection) {
  let currentIndex = STATUSES.indexOf(status);
  let newIndex = currentIndex + moveToDirection;
  let newStatus = STATUSES[newIndex];

  currentDraggedElement = taskId;

  await moveTo(newStatus);
}

/**
 * Sets the currentDraggedElement to the specified task ID, indicating that dragging has started.
 * @function startDragging
 * @param {number} id - The ID of the task being dragged.
 * @returns {void}
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Allows a dragged element to be dropped on this element.
 * @function allowDrop
 * @param {DragEvent} ev - The drag event.
 * @returns {void}
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Adds a highlight effect to a specific kanban column when a draggable element is over it.
 * @function hightlight
 * @param {string} status - The status/column to highlight (e.g., "todo").
 * @returns {void}
 */
function hightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.add("kanban-tasks-highlight");
}

/**
 * Removes the highlight effect from a specific kanban column.
 * @function removeHightlight
 * @param {string} status - The status/column to remove the highlight from.
 * @returns {void}
 */
function removeHightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.remove("kanban-tasks-highlight");
}

/**
 * Moves the currently dragged task to a specified status, updates the database,
 * and refreshes the board.
 * @async
 * @function moveTo
 * @param {string} status - The new status to move the task to.
 * @returns {Promise<void>}
 */
async function moveTo(status) {
  let tasks = await fetchData("tasks");
  let movedTask = tasks.find((task) => task.id === currentDraggedElement);
  movedTask.status = status;
  await postUpdatedTask(movedTask);
  removeHightlight(status);
  updateTasksOnBoard();
}

/**
 * Posts updated task data to the server for storage and returns the updated task.
 * @async
 * @function postUpdatedTask
 * @param {Object} task - The task object to update.
 * @returns {Promise<Object|undefined>} The updated task data, or undefined if an error occurs.
 */
async function postUpdatedTask(task) {
  try {
    let updatedTask = await postData(`tasks/${task.id - 1}`, task);
    return updatedTask;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks:", error);
  }
}

/**
 * Clears the value of a specified search input field.
 * @function clearSearchField
 * @param {string} field - The ID of the search input field to clear.
 * @returns {void}
 */
function clearSearchField(field) {
  let searchFiel = document.getElementById(field);
  searchFiel.value = "";
}

/**
 * Opens the "Add Task" overlay and sets the global taskStatus to the specified status.
 * @function openAddTask
 * @param {string} status - The status to assign to the new task (e.g., "todo").
 * @returns {void}
 */
function openAddTask(status) {
  toggleOverlay("board_addtask_overlay");
  taskStatus = status;
}

/**
 * Opens the edit dialog overlay for a specific task, hiding irrelevant buttons
 * and updating the UI to edit mode.
 * @function openEditDialog
 * @param {number} taskId - The unique identifier of the task to edit.
 * @returns {void}
 */
function openEditDialog(taskId) {
  let editTaskButton = document.getElementById("create_button_div");
  document.getElementById("edit_task_overlay").classList.remove("d-none");
  document.getElementById("create_button").classList.add("d-none");
  document.getElementById("clear_button").classList.add("d-none");
  document.getElementById("alert_field").classList.add("d-none");
  document.getElementById("alert_field").classList.remove("alert-field");
  document.getElementById("dividing_bar").classList.add("d-none");
  document.getElementById("content_order").classList.remove("content-order");
  document.getElementById("content_order").classList.add("edit-content-order");
  document.getElementById("bottom_button_order").classList.add("edit-bottom-button-order");
  document.getElementById("create_button_div").classList.add("edit-ok-button");
  editTaskButton.innerHTML = editTaskTemplate(taskId);
}

/**
 * Fetches the data for a specific task and its related contacts, then sets values
 * in the edit form for that task.
 * @async
 * @function taskValuesToEditField
 * @param {number} taskId - The ID of the task to load into the edit form.
 * @returns {Promise<void>}
 */
async function taskValuesToEditField(taskId) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let contacts = await fetchData("contacts");
  setTaskBasicValues(singleTask);
  setTaskUser(singleTask);
  setTaskContacts(singleTask, contacts);
  setTaskPriority(singleTask);
  setTaskCategory(singleTask);
  setTaskSubtasks(singleTask);
}

/**
 * Sets basic form fields for editing, such as title, description, and due date.
 * @function setTaskBasicValues
 * @param {Object} singleTask - The task object containing basic data.
 * @returns {void}
 */
function setTaskBasicValues(singleTask) {
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value = singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
}

/**
 * Checks if the task is assigned to the active user, and if so, updates the assignment state in the UI.
 * @function setTaskUser
 * @param {Object} singleTask - The task object being edited.
 * @returns {void}
 */
function setTaskUser(singleTask) {
  if (singleTask.user === activeUser.id) {
    addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
  }
}

/**
 * Assigns the relevant contacts to the task in the UI based on the contact IDs provided.
 * @function setTaskContacts
 * @param {Object} singleTask - The task object containing assigned contact IDs.
 * @param {Object[]} contacts - An array of all available contacts fetched from the database.
 * @returns {void}
 */
function setTaskContacts(singleTask, contacts) {
  if (!singleTask.assigned) {
    return;
  }
  let userContacts = singleTask.assigned.filter((data) => data !== null);
  let contactsToRender = contacts.filter((contact) =>
    userContacts.includes(contact.id)
  );
  window.allContacts = contactsToRender;
  contactsToRender.forEach((contact) => {
    addContactToTask(
      `contact_to_task_${contact.id}`,
      "task",
      `bg_task_${contact.id}`,
      `${contact.id}`
    );
  });
}

/**
 * Sets the task's priority level in the UI.
 * @function setTaskPriority
 * @param {Object} singleTask - The task object containing priority information.
 * @returns {void}
 */
function setTaskPriority(singleTask) {
  selectPrio(singleTask.priority);
}

/**
 * Sets the task's category in the UI and adjusts display settings for category editing elements.
 * @function setTaskCategory
 * @param {Object} singleTask - The task object containing category information.
 * @returns {void}
 */
function setTaskCategory(singleTask) {
  document.getElementById("category").innerText = singleTask.category;
  document.getElementById("edit_category").classList.add("d-none");
  document.getElementById("edit_category").classList.remove("form-child-order");
}

/**
 * Populates the subtask list in the UI with existing subtasks from the fetched task object.
 * @function setTaskSubtasks
 * @param {Object} singleTask - The task object containing subtasks.
 * @returns {void}
 */
function setTaskSubtasks(singleTask) {
  let subtaskEdit = singleTask.subtasks;
  let subTaskField = document.getElementById("subtasks_list");
  subTaskField.innerHTML = "";
  if (subtaskEdit) {
    subtaskEdit.forEach((subtask) => {
      subTasks.push(subtask.subTaskName);
      let ids = subTasks.length;
      subTaskField.innerHTML += addSubtasksToList(subtask.subTaskName, ids - 1);
    });
  }
}

/**
 * Validates form fields to determine if editing can proceed, and updates the task if valid.
 * @function enableEditButton
 * @param {number} taskId - The ID of the task being edited.
 * @returns {void}
 */
function enableEditButton(taskId) {
  let input = getInputFields();
  let category = getCategory();
  if (isFormValid(input, category)) {
    handleValidForm(taskId);
  } else {
    handleInvalidForm();
  }
}

/**
 * Retrieves trimmed input values from the edit form fields (title and date).
 * @function getInputFields
 * @returns {Object} An object containing the trimmed title and date.
 * @property {string} input - The trimmed task title.
 * @property {string} date - The trimmed task date.
 */
function getInputFields() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}

/**
 * Retrieves the currently selected category text from the edit form.
 * @function getCategory
 * @returns {string} The selected category text.
 */
function getCategory() {
  return document.getElementById("category").innerText;
}

/**
 * Checks if the form fields are valid (non-empty title, non-empty date, and valid category).
 * @function isFormValid
 * @param {Object} input - Contains the user's entered title and date.
 * @param {string} category - The selected category text.
 * @returns {boolean} True if the form is valid; otherwise, false.
 */
function isFormValid(input, category) {
  return (
    input.input !== "" &&
    input.date !== "" &&
    (category === "Technical Task" || category === "User Story" || category === "Tutorial")
  );
}

/**
 * Resets any required field alerts and proceeds to edit the task if the form is valid.
 * @function handleValidForm
 * @param {number} taskId - The ID of the task being edited.
 * @returns {void}
 */
function handleValidForm(taskId) {
  resetrequiredFields();
  editTask(taskId);
}

/**
 * Triggers any necessary alerts or highlighting for invalid form fields.
 * @function handleInvalidForm
 * @returns {void}
 */
function handleInvalidForm() {
  requiredFields();
}

/**
 * Updates an existing task with new data from the form and handles post-update steps.
 * @async
 * @function editTask
 * @param {number} taskId - The unique identifier of the task to edit.
 * @returns {Promise<void>}
 */
async function editTask(taskId) {
  let taskData = collectTaskFormData();
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let userTaskId = userTest();
  let currenttaskStatus = singleTask.status;
  await updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus);
  await handleTaskEditCompletion(taskId);
}

/**
 * Sends the updated task data to the server (without changing the status) for storage.
 * @async
 * @function updateTaskContent
 * @param {Object} taskData - The updated task data from the form.
 * @param {number} taskId - The ID of the task to update.
 * @param {number|string} userTaskId - The user ID assigned to the task, if any.
 * @param {string} currenttaskStatus - The current status of the task.
 * @returns {Promise<void>}
 */
async function updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus) {
  await putEditTasksContent(
    taskData.title,
    taskData.description,
    taskData.dueDate,
    taskId,
    taskData.assignedTo,
    taskData.categorySeleced,
    userTaskId,
    currenttaskStatus
  );
}
