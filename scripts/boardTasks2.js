/**************************************
 * Single Task Display and Management
 **************************************/

/**
 * Opens a detailed view of a single task, including its subtasks and recipients,
 * and displays it in an overlay.
 * @async
 * @function openSingleTask
 * @param {number} taskId - The unique identifier of the task to display.
 * @returns {Promise<void>}
 */
async function openSingleTask(taskId) {
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let categoryColor = singleTask.category.replace(/\s+/g, "").toLowerCase();
  let contacts = await fetchData("contacts");

  displaySingleTask(singleTask, categoryColor);
  displaySingleRecipients(singleTask, contacts);
  displaySingleSubtasks(singleTask.subtasks, taskId);
  toggleOverlay("board_task_overlay");
}

/**
 * Renders the main portion of the single task in the UI, including title, category, and description.
 * @function displaySingleTask
 * @param {Object} singleTask - The task object to display.
 * @param {string} categoryColor - A color class derived from the task's category.
 * @returns {void}
 */
function displaySingleTask(singleTask, categoryColor) {
  let singleTaskArea = document.getElementById(`single_task`);
  singleTaskArea.innerHTML = "";

  singleTaskArea.innerHTML += generateSingleTasks(
    singleTask,
    categoryColor
  );
}

/**
 * Displays all recipients (contacts and active user) assigned to the task.
 * If no assignees are found, renders a "no assignee" placeholder.
 * @function displaySingleRecipients
 * @param {Object} singleTask - The task object containing assignee data.
 * @param {Object[]} contacts - An array of contact objects to match assigned IDs against.
 * @returns {void}
 */
function displaySingleRecipients(singleTask, contacts) {
  let assigneeField = document.getElementById("single_assignee");
  assigneeField.innerHTML = "";
  let hasAssignees = displayRecipientsAndUsers(
    singleTask,
    contacts,
    assigneeField
  );

  if (!hasAssignees) {
    assigneeField.innerHTML = generateNoAssigneeField();
  }
}

/**
 * Displays both the active user (if applicable) and the contacts assigned to the task.
 * @function displayRecipientsAndUsers
 * @param {Object} singleTask - The task object containing user/assignee data.
 * @param {Object[]} contacts - An array of contact objects to match assigned IDs against.
 * @param {HTMLElement} assigneeField - The DOM element where assignee badges will be appended.
 * @returns {boolean} True if at least one user/contact is displayed; otherwise false.
 */
function displayRecipientsAndUsers(singleTask, contacts, assigneeField) {
  let hasUserAssignees = displayUserAsRecipients(singleTask, assigneeField);
  let hasContactAssignees = displayContactAsRecipients(
    singleTask,
    contacts,
    assigneeField
  );

  return hasUserAssignees || hasContactAssignees;
}

/**
 * Checks if the current active user is assigned to the task and, if so, renders the user's badge.
 * @function displayUserAsRecipients
 * @param {Object} singleTask - The task object to check against.
 * @param {HTMLElement} assigneeField - The container for rendering assignee badges.
 * @returns {boolean} True if the active user is assigned; otherwise false.
 */
function displayUserAsRecipients(singleTask, assigneeField) {
  if (singleTask.user === activeUser.id) {
    assigneeField.innerHTML += generateSingleUserAsAssignee();
    return true;
  }
  return false;
}

/**
 * Finds and displays any contacts assigned to the task who are also in the active user's contact list.
 * @function displayContactAsRecipients
 * @param {Object} singleTask - The task object containing assigned contact IDs.
 * @param {Object[]} contacts - An array of all available contact objects.
 * @param {HTMLElement} assigneeField - The container for rendering contact badges.
 * @returns {boolean} True if any contacts are displayed; otherwise false.
 */
function displayContactAsRecipients(singleTask, contacts, assigneeField) {
  let recipients = singleTask.assigned || [];
  let validContacts = contacts.filter(
    (contact) =>
      recipients.includes(contact.id) && activeUser.contacts.includes(contact.id)
  );

  validContacts.forEach(
    (contact) => (assigneeField.innerHTML += generateSingleAssignee(contact))
  );

  return validContacts.length > 0;
}

/**
 * Displays all subtasks of a task in the single task view. If no subtasks exist, shows a placeholder.
 * @function displaySingleSubtasks
 * @param {Object[]} subtasks - An array of subtask objects (if any).
 * @param {number} taskId - The unique identifier of the main task.
 * @returns {void}
 */
function displaySingleSubtasks(subtasks, taskId) {
  let subtaskField = document.getElementById("single_subtask");
  subtaskField.innerHTML = "";

  if (subtasks) {
    subtasks.forEach((subtask) => {
      subtaskField.innerHTML += generateSingleSubtasks(subtask, taskId);
    });
  } else {
    subtaskField.innerHTML = generateNoSubtaskField();
  }
}

/**
 * Toggles the completion status of a specific subtask and updates the database accordingly.
 * @async
 * @function updateSubtaskStatus
 * @param {number} taskId - The unique identifier of the main task.
 * @param {number} subId - The subtask's ID (used to locate it in the array).
 * @returns {Promise<void>}
 */
async function updateSubtaskStatus(taskId, subId) {
  toggleCheckButton(`task_${taskId}_subtask_${subId}`, "button");

  let checkButton = document.getElementById(
    `task_${taskId}_subtask_${subId}`
  );
  let isChecked = checkButton.src.includes("true");

  let tasks = await fetchData("tasks");
  let task = tasks.find((task) => task.id === taskId);

  task.subtasks[subId - 1].done = isChecked;

  await postUpdatedTask(task);
}

/**
 * Opens a confirmation dialog overlay to delete a specific task.
 * @function openDeleteDialog
 * @param {number} taskId - The ID of the task to be deleted.
 * @returns {void}
 */
function openDeleteDialog(taskId) {
  toggleOverlay("board_delete_overlay");

  let yesButton = document.getElementById("delete_yes_btn");
  yesButton.innerHTML = generateDeleteButton(taskId);
}

/**
 * Deletes a task globally or only for the active user, depending on the task's ID range.
 * Also cleans up references to the deleted task in local storage.
 * @async
 * @function deleteTask
 * @param {number} taskId - The unique identifier of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTask(taskId) {
  let users = await fetchData("users");
  if (taskId >= 1 && taskId <= 10) {
    await deleteTaskOnlyforUser(taskId, users);
  } else {
    await deleteTaskforAllUsers(taskId, users);
  }
  deleteTaskInLocalStorage(taskId);
  await showSuccessfullyDelete();
  toggleOverlay("board_delete_overlay");
  toggleOverlay("board_task_overlay");
  window.location.reload();
}

/**
 * Removes a task from the active user's task list in the database, but does not delete it globally.
 * @async
 * @function deleteTaskOnlyforUser
 * @param {number} taskId - The ID of the task to remove.
 * @param {Object[]} users - An array of all user objects fetched from the database.
 * @returns {Promise<void>}
 */
async function deleteTaskOnlyforUser(taskId, users) {
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => removeTaskFromUser(user, taskId));
  await postData("users", users);
}

/**
 * Returns a new user object with the specified task removed from their task list.
 * @function removeTaskFromUser
 * @param {Object} user - The user object to update.
 * @param {number} taskId - The ID of the task to remove from the user's tasks.
 * @returns {Object} A shallow copy of the user object with the updated task array.
 */
function removeTaskFromUser(user, taskId) {
  if (user.id === activeUser.id) {
    return {
      ...user,
      tasks: user.tasks.filter((task) => task !== taskId),
    };
  }
  return user;
}

/**
 * Removes a task entirely from the system, including from all users' task lists.
 * @async
 * @function deleteTaskforAllUsers
 * @param {number} taskId - The ID of the task to delete globally.
 * @param {Object[]} users - An array of all user objects fetched from the database.
 * @returns {Promise<void>}
 */
async function deleteTaskforAllUsers(taskId, users) {
  await deleteData("tasks", taskId);
  if (activeUser.id === 0) {
    return;
  }
  users = removeTaskFromUsers(users, taskId);
  await postData("users", users);
}

/**
 * Removes the specified task from every user's task list.
 * @function removeTaskFromUsers
 * @param {Object[]} users - An array of user objects to update.
 * @param {number} taskId - The ID of the task to remove from all users.
 * @returns {Object[]} A new array of user objects with the task removed from each.
 */
function removeTaskFromUsers(users, taskId) {
  return users.map((user) => ({
    ...user,
    tasks: user.tasks.filter((task) => task !== taskId),
  }));
}

/**
 * Removes references to the deleted task from the active user in localStorage.
 * @function deleteTaskInLocalStorage
 * @param {number} taskId - The ID of the task to remove from the active user's storage data.
 * @returns {void}
 */
function deleteTaskInLocalStorage(taskId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.tasks = activeUser.tasks.filter((task) => task !== taskId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

/**
 * Displays a brief confirmation overlay indicating that a task has been successfully deleted.
 * @async
 * @function showSuccessfullyDelete
 * @returns {Promise<void>} Resolves once the confirmation overlay has been shown and hidden again.
 */
function showSuccessfullyDelete() {
  return new Promise((resolve) => {
    let overlay = document.getElementById("successfully_delete_task");
    overlay.classList.remove("d-none");
    overlay.classList.add("active");
    setTimeout(() => {
      overlay.classList.add("visible");
      setTimeout(() => {
        overlay.classList.remove("active", "visible");
        overlay.classList.add("d-none");
        resolve();
      }, 1333);
    }, 50);
  });
}
