async function updateTasksOnBoard() {
  cleanBoard();
  await renderTasksInStatusArea();
}


function cleanBoard() {
  STATUSES.forEach((status) => {
    let statusColumn = document.getElementById(`kanban_${status}`);
    statusColumn.innerHTML = "";
  });
}


async function renderTasksInStatusArea() {
  let tasksToRender = await filterUserTasks();
  tasksToRender = filterSoughtTaskToRender(tasksToRender);
  noTaskFound(tasksToRender);
  let contacts = await fetchData("contacts");

  STATUSES.forEach((status) =>
    renderStatusArea(status, tasksToRender, contacts)
  );
}


async function filterUserTasks() {
  let userTasks = activeUser.tasks;
  let allTasks = await fetchData("tasks");

  let tasksToRender = allTasks.filter((task) => userTasks.includes(task.id));
  return tasksToRender;
}


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


function getSoughtTask() {
  let soughtedTaskDesktop = document.getElementById("sought_task").value;
  let soughtedTaskMobile =
    document.getElementById("sought_task_mobile").value;
  return (soughtedTaskDesktop || soughtedTaskMobile).toLowerCase();
}


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


function renderStatusTasks(tasks, area, contacts) {
  tasks.forEach((task) => {
    let shortDescription = shortenDescription(task.description);
    let categoryColor = task.category.replace(/\s+/g, "").toLowerCase();

    area.innerHTML += generateTasksOnBoard(task.id, task.title, shortDescription, task.category, categoryColor, task.priority);
    displaySubtasks(task);
    displayAssigneesForTask(task, contacts);
    displayStatusArrows(task);
  });
}


function shortenDescription(description) {
  let words = description.split(/\s+/);
  if (words.length <= 6) return description;
  return words.slice(0, 6).join(" ") + "...";
}


function displaySubtasks(task) {
  let subtaskArea = document.getElementById(`subtasks_${task.id}`);
  subtaskArea.innerHTML = "";
  subtaskArea.classList.add("d-none");

  addSubtasksOnBoardTasks(subtaskArea, task);
}


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


function updateSubtasksBar(taskId, sumDoneSubtasks, sumAllSubtasks) {
  let taskElement = document.getElementById(`task_${taskId}`);
  let subtasksBar = taskElement.querySelector(".task-subtasks-bar");

  let percentage = (sumDoneSubtasks / sumAllSubtasks) * 100;
  subtasksBar.style.setProperty("--progress", `${percentage}%`);
}


function displayAssigneesForTask(task, contacts) {
  let assignedField = document.getElementById(`assignees_task_${task.id}`);
  assignedField.innerHTML = "";
  let maxDisplayed = determineMaxDisplayed(task);
  let validContacts = contacts.filter(
    (contact) =>
      activeUser.contacts.includes(contact.id)
  );
  if (task.assigned) {
    let assignees = task.assigned.filter((data) => data !== null);
    displayAssignees(assignees, validContacts, assignedField, maxDisplayed);
    displayCount(task, assignees, maxDisplayed);
  }
  displayUser(task, assignedField);
}


function determineMaxDisplayed(task) {
  if (task.user === activeUser.id) {
    return 2;
  }
  return 3;
}


function displayAssignees(assignees, contacts, assignedField, maxDisplayed) {
  assignees
    .slice(0, maxDisplayed)
    .forEach((contactId) => renderAssignee(contactId, contacts, assignedField));
}


function renderAssignee(contactId, contacts, assignedField) {
  let contact = contacts.find((c) => c.id === contactId);

  if (contact) {
    assignedField.innerHTML += generateAssigneeField(contact);
  }
}


function displayCount(task, assignees, maxDisplayed) {
  let numberField = document.getElementById(`assignees_number_${task.id}`);
  numberField.innerHTML = "";

  if (assignees.length > maxDisplayed) {
    let remainingCount = assignees.length - maxDisplayed;
    numberField.innerHTML += generateAdditionallyAssigneeField(remainingCount);
  }
}


function displayUser(task, assignedField) {
  if (task.user === activeUser.id) {
    assignedField.innerHTML += generateUserField(activeUser);
  }
}


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


// Single Task
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


function displaySingleTask(singleTask, categoryColor) {
  let singleTaskArea = document.getElementById(`single_task`);
  singleTaskArea.innerHTML = "";

  singleTaskArea.innerHTML += generateSingleTasks(
    singleTask,
    categoryColor
  );
}


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


function displayRecipientsAndUsers(singleTask, contacts, assigneeField) {
  let hasUserAssignees = displayUserAsRecipients(singleTask, assigneeField);
  let hasContactAssignees = displayContactAsRecipients(
    singleTask,
    contacts,
    assigneeField
  );

  return hasUserAssignees || hasContactAssignees;
}


function displayUserAsRecipients(singleTask, assigneeField) {
  if (singleTask.user === activeUser.id) {
    assigneeField.innerHTML += generateSingleUserAsAssignee();
    return true;
  }
  return false;
}


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


function openDeleteDialog(taskId) {
  toggleOverlay("board_delete_overlay");

  let yesButton = document.getElementById("delete_yes_btn");
  yesButton.innerHTML = generateDeleteButton(taskId);
}


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


async function deleteTaskOnlyforUser(taskId, users) {
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => removeTaskFromUser(user, taskId));
  await postData("users", users);
}


function removeTaskFromUser(user, taskId) {
  if (user.id === activeUser.id) {
    return {
      ...user,
      tasks: user.tasks.filter((task) => task !== taskId),
    };
  }
  return user;
}


async function deleteTaskforAllUsers(taskId, users) {
  await deleteData("tasks", taskId);
  if (activeUser.id === 0) {
    return;
  }
  users = removeTaskFromUsers(users, taskId);
  await postData("users", users);
}


function removeTaskFromUsers(users, taskId) {
  return users.map((user) => ({
    ...user,
    tasks: user.tasks.filter((task) => task !== taskId),
  }));
}


function deleteTaskInLocalStorage(taskId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.tasks = activeUser.tasks.filter((task) => task !== taskId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}


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