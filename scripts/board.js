const STATUSES = ["todo", "inprogress", "awaitfeedback", "done"];
let currentDraggedElement;


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


async function moveToStatus(taskId, status, moveToDirection) {
  let currentIndex = STATUSES.indexOf(status);
  let newIndex = currentIndex + moveToDirection;
  let newStatus = STATUSES[newIndex];

  currentDraggedElement = taskId;

  await moveTo(newStatus);
}


function startDragging(id) {
  currentDraggedElement = id;
}


function allowDrop(ev) {
  ev.preventDefault();
}


function hightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.add("kanban-tasks-highlight");
}


function removeHightlight(status) {
  document
    .getElementById(`kanban_${status}`)
    .classList.remove("kanban-tasks-highlight");
}


async function moveTo(status) {
  let tasks = await fetchData("tasks");
  let movedTask = tasks.find((task) => task.id === currentDraggedElement);
  movedTask.status = status;
  await postUpdatedTask(movedTask);
  removeHightlight(status);
  updateTasksOnBoard();
}


async function postUpdatedTask(task) {
  try {
    let updatedTask = await postData(`tasks/${task.id - 1}`, task);
    return updatedTask;
  } catch (error) {
    console.error("Fehler beim Aktualisieren des Tasks:", error);
  }
}


function clearSearchField(field) {
  let searchFiel = document.getElementById(field);
  searchFiel.value = "";
}


function openAddTask(status) {
  toggleOverlay('board_addtask_overlay');
  taskStatus = status;
}


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
  document.getElementById('bottom_button_order').classList.add('edit-bottom-button-order');
  document.getElementById('create_button_div').classList.add('edit-ok-button');
  editTaskButton.innerHTML = editTaskTemplate(taskId);
}


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


function setTaskBasicValues(singleTask) {
  document.getElementById("title_input").value = singleTask.title;
  document.getElementById("description_textarea").value =
    singleTask.description;
  document.getElementById("due_date").value = singleTask.date;
}


function setTaskUser(singleTask) {
  if (singleTask.user === activeUser.id) {
    addUserToTask("contact_to_task_0", "task", "bg_task_0", `${activeUser.id}`);
  }
}


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


function setTaskPriority(singleTask) {
  selectPrio(singleTask.priority);
}


function setTaskCategory(singleTask) {
  document.getElementById("category").innerText = singleTask.category;
  document.getElementById("edit_category").classList.add("d-none");
  document.getElementById("edit_category").classList.remove("form-child-order");
}


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


function enableEditButton(taskId) {
  let input = getInputFields();
  let category = getCategory();
  if (isFormValid(input, category)) {
    handleValidForm(taskId);
  } else {
    handleInvalidForm();
  }
}


function getInputFields() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}


function getCategory() {
  return document.getElementById("category").innerText;
}


function isFormValid(input, category) {
  return (
    input.input !== "" &&
    input.date !== "" &&
    (category === "Technical Task" || category === "User Story" || category === "Tutorial")
  );
}


function handleValidForm(taskId) {
  resetrequiredFields();
  editTask(taskId);
}


function handleInvalidForm() {
  requiredFields();
}


async function editTask(taskId) {
  let taskData = collectTaskFormData();
  let tasks = await fetchData("tasks");
  let singleTask = tasks.find((task) => task.id === taskId);
  let userTaskId = userTest();
  let currenttaskStatus = singleTask.status;
  await updateTaskContent(taskData, taskId, userTaskId, currenttaskStatus);
  await handleTaskEditCompletion(taskId);
}


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


async function handleTaskEditCompletion(taskId) {
  subTasks = [];
  openAddTaskDialogFeedback();
  await wait(1500);
  toggleTaskOverlays();
  closeAddTaskDialogFeedback();
  openSingleTask(taskId);
}


function toggleTaskOverlays() {
  toggleOverlay("edit_task_overlay");
  toggleOverlay("board_task_overlay");
}


function userTest() {
  if (userId[0]) {
    let userTaskId = Number(userId[0]);
    return userTaskId;
  } else {
    let userTaskId = "";
    return userTaskId;
  }
}


async function putEditTasksContent(title, description, dueDate, taskId, assignedTo, categorySeleced, userTaskId, currenttaskStatus) {
  postData(`tasks/${taskId - 1}/`, {
    title: title,
    description: description,
    date: dueDate,
    priority: selectedPrio,
    category: categorySeleced,
    id: taskId,
    subtasks: await getEditSubtasks(taskId),
    assigned: assignedTo,
    status: currenttaskStatus,
    user: userTaskId,
  });
}


async function getEditSubtasks(taskId) {
  let tasks = await fetchData("tasks");
  let editSingleTask = tasks.find((task) => task.id === taskId);
  let filteredSubtasks = editSingleTask.subtasks?.filter(data => data !== null) || [];
  if (subTasks.length === 0) return [];
  return subTasks.map((subName, index) => 
    createSubtaskObject(subName, index, filteredSubtasks)
  );
}


function createSubtaskObject(subName, index, filteredSubtasks) {
  let foundSubtask = filteredSubtasks.find(
    (filteredTask) => filteredTask.subTaskName === subName
  );
  return {
    subTaskName: subName,
    subId: index + 1,
    done: foundSubtask ? foundSubtask.done : false
  };
}


function closeAddTaskDialogFeedback() {
  let slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.innerHTML = "";
  slidingDiv.classList.toggle("visible");
}