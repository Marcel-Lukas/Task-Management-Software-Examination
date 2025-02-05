/**
 * Updates the task board by clearing it and re-rendering tasks in their respective status columns.
 * @async
 * @function updateTasksOnBoard
 * @returns {Promise<void>}
 */
async function updateTasksOnBoard() {
  cleanBoard();
  await renderTasksInStatusArea();
}

/**
 * Clears (empties) all columns on the task board based on their statuses.
 * @function cleanBoard
 * @returns {void}
 */
function cleanBoard() {
  STATUSES.forEach((status) => {
    let statusColumn = document.getElementById(`kanban_${status}`);
    statusColumn.innerHTML = "";
  });
}

/**
 * Fetches and filters the user's tasks, searches for matching tasks if applicable,
 * and renders them in the appropriate columns on the board.
 * @async
 * @function renderTasksInStatusArea
 * @returns {Promise<void>}
 */
async function renderTasksInStatusArea() {
  let tasksToRender = await filterUserTasks();
  tasksToRender = filterSoughtTaskToRender(tasksToRender);
  noTaskFound(tasksToRender);
  let contacts = await fetchData("contacts");

  STATUSES.forEach((status) =>
    renderStatusArea(status, tasksToRender, contacts)
  );
}

/**
 * Retrieves tasks belonging to the currently active user.
 * @async
 * @function filterUserTasks
 * @returns {Promise<Array>} An array of task objects that belong to the active user.
 */
async function filterUserTasks() {
  let userTasks = activeUser.tasks;
  let allTasks = await fetchData("tasks");

  let tasksToRender = allTasks.filter((task) => userTasks.includes(task.id));
  return tasksToRender;
}

/**
 * Filters tasks based on a search query (entered by the user). 
 * Only tasks with titles or descriptions that match the query are returned.
 * @function filterSoughtTaskToRender
 * @param {Array} tasksToRender - The array of task objects to filter.
 * @returns {Array} An array of tasks matching the search query.
 */
function filterSoughtTaskToRender(tasksToRender) {
  let soughtTask = getSoughtTask();
  if (soughtTask.length != 0) {
    return tasksToRender.filter(
      (task) =>
        task.title.toLowerCase().includes(soughtTask) ||
        task.description.toLowerCase().includes(soughtTask)
    );
  }
  return tasksToRender;
}

/**
 * Retrieves the current search query from either the desktop or mobile input field.
 * @function getSoughtTask
 * @returns {string} The search query, converted to lowercase.
 */
function getSoughtTask() {
  let soughtedTaskDesktop = document.getElementById("sought_task").value;
  let soughtedTaskMobile = document.getElementById("sought_task_mobile").value;
  return (soughtedTaskDesktop || soughtedTaskMobile).toLowerCase();
}

/**
 * Displays a "no tasks found" message if the filtered tasks array is empty; otherwise, shows the kanban board.
 * @function noTaskFound
 * @param {Array} tasksToRender - The array of task objects after filtering.
 * @returns {void}
 */
function noTaskFound(tasksToRender){
  let noTaskField = document.getElementById("task_not_found");
  let kanbanField = document.getElementById("kanban_board");
  noTaskField.classList.add('d-none');
  kanbanField.classList.remove('d-none');

  if (tasksToRender.length == 0) {
    noTaskField.classList.remove('d-none');
    kanbanField.classList.add('d-none');
  }  
}

/**
 * Renders all tasks belonging to a specific status in the corresponding column.
 * If there are no tasks for that status, displays a "no tasks" field.
 * @function renderStatusArea
 * @param {string} status - The status of the tasks to render (e.g., "todo").
 * @param {Array} tasks - The array of task objects to be displayed.
 * @param {Array} contacts - The array of contact objects fetched from the database.
 * @returns {void}
 */
function renderStatusArea(status, tasks, contacts) {
  let statusArea = document.getElementById(`kanban_${status}`);
  statusArea.innerHTML = "";
  let statusTasks = tasks.filter((task) => task.status == status);

  if (statusTasks == "") {
    statusArea.innerHTML = generateNoTaskField();
  } else {
    renderStatusTasks(statusTasks, statusArea, contacts);
  }
}

/**
 * Renders multiple tasks within a given status column, including their description, subtasks, and assignees.
 * @function renderStatusTasks
 * @param {Array} tasks - An array of task objects to render in the column.
 * @param {HTMLElement} area - The DOM element that represents the column.
 * @param {Array} contacts - The array of contact objects used to display assignee details.
 * @returns {void}
 */
function renderStatusTasks(tasks, area, contacts) {
  tasks.forEach((task) => {
    let shortDescription = shortenDescription(task.description);
    let categoryColor = task.category.replace(/\s+/g, "").toLowerCase();

    area.innerHTML += generateTasksOnBoard(
      task.id,
      task.title,
      shortDescription,
      task.category,
      categoryColor,
      task.priority
    );
    displaySubtasks(task);
    displayAssigneesForTask(task, contacts);
    displayStatusArrows(task);
  });
}

/**
 * Shortens a task description to a maximum of 6 words, appending '...' if truncated.
 * @function shortenDescription
 * @param {string} description - The original task description.
 * @returns {string} The shortened description.
 */
function shortenDescription(description) {
  let words = description.split(/\s+/);
  if (words.length <= 6) return description;
  return words.slice(0, 6).join(" ") + "...";
}

/**
 * Manages the display of a task's subtasks, toggling visibility based on whether subtasks exist.
 * @function displaySubtasks
 * @param {Object} task - The task object whose subtasks should be displayed.
 * @returns {void}
 */
function displaySubtasks(task) {
  let subtaskArea = document.getElementById(`subtasks_${task.id}`);
  subtaskArea.innerHTML = "";
  subtaskArea.classList.add("d-none");

  addSubtasksOnBoardTasks(subtaskArea, task);
}

/**
 * Renders the subtask area within a task card, including the number of completed and total subtasks.
 * @function addSubtasksOnBoardTasks
 * @param {HTMLElement} subtaskArea - The DOM element where subtasks will be displayed.
 * @param {Object} task - The task object containing subtask data.
 * @returns {void}
 */
function addSubtasksOnBoardTasks(subtaskArea, task) {
  if (task.subtasks || Array.isArray(task.subtasks)) {
    subtaskArea.classList.remove("d-none");
    let sumAllSubtasks = task.subtasks.length;
    let sumDoneSubtasks = task.subtasks.filter(
      (subtask) => subtask.done
    ).length;

    subtaskArea.innerHTML = generateSubtasks(sumDoneSubtasks, sumAllSubtasks);

    updateSubtasksBar(task.id, sumDoneSubtasks, sumAllSubtasks);
  }
}

/**
 * Updates the progress bar within the task card to reflect the ratio of completed subtasks.
 * @function updateSubtasksBar
 * @param {number} taskId - The unique identifier for the task.
 * @param {number} sumDoneSubtasks - The number of subtasks marked as completed.
 * @param {number} sumAllSubtasks - The total number of subtasks for the task.
 * @returns {void}
 */
function updateSubtasksBar(taskId, sumDoneSubtasks, sumAllSubtasks) {
  let taskElement = document.getElementById(`task_${taskId}`);
  let subtasksBar = taskElement.querySelector(".task-subtasks-bar");

  let percentage = (sumDoneSubtasks / sumAllSubtasks) * 100;
  subtasksBar.style.setProperty("--progress", `${percentage}%`);
}

/**
 * Displays the assigned contacts (assignees) for a given task, as well as the active user if applicable.
 * @function displayAssigneesForTask
 * @param {Object} task - The task object with assigned contact IDs.
 * @param {Array} contacts - The array of contact objects, used to match names or details.
 * @returns {void}
 */
function displayAssigneesForTask(task, contacts) {
  let assignedField = document.getElementById(`assignees_task_${task.id}`);
  assignedField.innerHTML = "";
  let maxDisplayed = determineMaxDisplayed(task);
  let validContacts = contacts.filter(
    (contact) => activeUser.contacts.includes(contact.id)
  );
  if (task.assigned) {
    let assignees = task.assigned.filter((data) => data !== null);
    displayAssignees(assignees, validContacts, assignedField, maxDisplayed);
    displayCount(task, assignees, maxDisplayed);
  }
  displayUser(task, assignedField);
}

/**
 * Determines the maximum number of assignee icons to display before grouping the remainder into a count bubble.
 * @function determineMaxDisplayed
 * @param {Object} task - The task object to inspect for user assignment.
 * @returns {number} The maximum number of assignees to show before displaying a count bubble.
 */
function determineMaxDisplayed(task) {
  if (task.user === activeUser.id) {
    return 2;
  }
  return 3;
}

/**
 * Displays the initial subset of assigned contacts (up to the maximum permitted), rendering each contact's badge.
 * @function displayAssignees
 * @param {Array<number>} assignees - An array of contact IDs assigned to the task.
 * @param {Array} contacts - The array of all contact objects.
 * @param {HTMLElement} assignedField - The DOM element where assignee badges should be rendered.
 * @param {number} maxDisplayed - The maximum number of assignees to display.
 * @returns {void}
 */
function displayAssignees(assignees, contacts, assignedField, maxDisplayed) {
  assignees
    .slice(0, maxDisplayed)
    .forEach((contactId) => renderAssignee(contactId, contacts, assignedField));
}

/**
 * Finds a contact by their ID and appends a badge for them in the UI.
 * @function renderAssignee
 * @param {number} contactId - The ID of the contact to display.
 * @param {Array} contacts - The array of all contact objects.
 * @param {HTMLElement} assignedField - The DOM element where the contact badge should be added.
 * @returns {void}
 */
function renderAssignee(contactId, contacts, assignedField) {
  let contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    assignedField.innerHTML += generateAssigneeField(contact);
  }
}

/**
 * Displays the number of additional assignees if the total exceeds the maximum displayed.
 * @function displayCount
 * @param {Object} task - The task object containing assigned contacts.
 * @param {Array<number>} assignees - An array of assigned contact IDs.
 * @param {number} maxDisplayed - The maximum number of assignees to display before counting the rest.
 * @returns {void}
 */
function displayCount(task, assignees, maxDisplayed) {
  let numberField = document.getElementById(`assignees_number_${task.id}`);
  numberField.innerHTML = "";

  if (assignees.length > maxDisplayed) {
    let remainingCount = assignees.length - maxDisplayed;
    numberField.innerHTML += generateAdditionallyAssigneeField(remainingCount);
  }
}

/**
 * If a task is assigned to the active user, displays an icon or badge to represent them.
 * @function displayUser
 * @param {Object} task - The task object which may or may not include the active user.
 * @param {HTMLElement} assignedField - The DOM element where the user badge should be rendered.
 * @returns {void}
 */
function displayUser(task, assignedField) {
  if (task.user === activeUser.id) {
    assignedField.innerHTML += generateUserField(activeUser);
  }
}

/**
 * Displays navigation arrows for moving a task to the previous or next status (if applicable).
 * @function displayStatusArrows
 * @param {Object} task - The task object to which the arrows may be added.
 * @returns {void}
 */
function displayStatusArrows(task) {
  let taskCard = document.getElementById(`task_card_${task.id}`);
  let arrowTop = document.getElementById(`arrow_area_top_${task.id}`);
  let arrowBottom = document.getElementById(`arrow_area_bottom_${task.id}`);
  if (task.status != "todo") {
    arrowTop.innerHTML = generateArrowTop(task);
    taskCard.classList.add("task-arrow-top");
  }
  if (task.status != "done") {
    arrowBottom.innerHTML = generateArrowBottom(task);
    taskCard.classList.add("task-arrow-bottom");
  }
}
