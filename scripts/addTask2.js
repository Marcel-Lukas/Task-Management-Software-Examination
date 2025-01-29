function selectPrio(priority) {
  let prios = ["low", "medium", "urgent"];
  prios.forEach((prio) => resetPrio(prio));
  setPrio(priority);
  selectedButton = priority;
  handleSelectedPriority(selectedButton);
}


function resetPrio(prio) {
  let prioButton = document.getElementById(`${prio}_span`);
  let prioColoredRef = document.getElementById(`prio_${prio}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${prio}_white`);
  prioButton.classList.remove(`clicked-${prio}`);
  prioButton.classList.add(`${prio}-button`);
  prioColoredRef.classList.remove("d-none");
  prioWhiteRef.classList.add("d-none");
}


function setPrio(priority) {
  let prioButton = document.getElementById(`${priority}_span`);
  let prioColoredRef = document.getElementById(`prio_${priority}_colored`);
  let prioWhiteRef = document.getElementById(`prio_${priority}_white`);
  prioButton.classList.remove(`${priority}-button`);
  prioButton.classList.add(`clicked-${priority}`);
  prioColoredRef.classList.add("d-none");
  prioWhiteRef.classList.remove("d-none");
}


function openSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_inactiv").classList.add("d-none");
    document.getElementById("assigned_activ").classList.remove("d-none");
  }
}


function closeSelect() {
  if ((onclick = true)) {
    document.getElementById("assigned_activ").classList.add("d-none");
    document.getElementById("assigned_inactiv").classList.remove("d-none");
  }
}


function openSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_inactiv").classList.add("d-none");
    document.getElementById("category_activ").classList.remove("d-none");
    document.getElementById("category_task_contant").innerHTML = showCategory();
  }
}


function closeSelectCategory() {
  if ((onclick = true)) {
    document.getElementById("category_activ").classList.add("d-none");
    document.getElementById("category_inactiv").classList.remove("d-none");
  }
}


function openSubtasks() {
  if ((onclick = true)) {
    document.getElementById("subtasks_inactiv_img").classList.add("d-none");
    document.getElementById("subtasks_activ_img").classList.remove("d-none");
  }
}


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


function addSubtasksManage() {
  toggleSubtaskIcons();
  let subtasksInput = document.getElementById("subtasks_input").value;

  if (subtasksInput.trim() !== "") {
    addSubtaskToList(subtasksInput);
    document.getElementById("subtasks_input").value = "";
  }
}


function toggleSubtaskIcons() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
}


function addSubtaskToList(subtasksInput) {
  subTasks.push(subtasksInput);
  let ids = subTasks.length;
  document.getElementById("subtasks_list").innerHTML += addSubtasksToList(
    subtasksInput,
    ids - 1
  );
}


function enterValue() {
  openSubtasks();
  let subtasksInput = document.getElementById("subtasks_input");
  subtasksInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      addSubtasksManage();
      document.getElementById("subtasks_inactiv_img").classList.add("d-none");
      document.getElementById("subtasks_activ_img").classList.remove("d-none");
    }
  });
}


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


function changeSubtasksImgPrevention(event) {
  event.stopPropagation();
}


function cancelSubtasks() {
  document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
  document.getElementById("subtasks_activ_img").classList.add("d-none");
  document.getElementById("subtasks_input").value = "";
}


function deleteSubtask(id) {
  document.getElementById(`listItem_${id}`).remove();
  document.getElementById(`listItem_input_${id}`).remove();
  subTasks.splice(id, 1);
  editSubTaskIndex = null;
}


function toggleSubtasksImgs(id) {
  document.getElementById(`list_imgs_activ_${id}`).classList.toggle("d-none");
  document.getElementById(`list_imgs_inactiv_${id}`).classList.toggle("d-none");
  document.getElementById(`listItem_${id}`).classList.toggle("d-none");
  document.getElementById(`listItem_${id}`).classList.toggle("list-item");
  document.getElementById(`input_subtask_${id}`).classList.toggle("d-none");
}


function enableButton() {
  let input = getInputValues();
  let category = getCategoryValue();
  if (isFormComplete(input, category)) {
    processValidForm();
  } else {
    processInvalidForm();
  }
}


function getInputValues() {
  return {
    input: document.getElementById("title_input").value.trim(),
    date: document.getElementById("due_date").value.trim(),
  };
}


function getCategoryValue() {
  return document.getElementById("category").innerText;
}


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


function processValidForm() {
  resetrequiredFields();
  createTask();
}


function processInvalidForm() {
  requiredFields();
}


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


function clearTemplate(clear) {
  if (clear === true) {
      document.getElementById('edit_task_template').innerHTML = "";
  } else if (clear === false) {
      document.getElementById('add_task_template').innerHTML = "";
  }
}

function renderEditButtons(){
  document.getElementById("content_order").classList.add("content-order");
  document.getElementById("content_order").classList.remove("edit-content-order");
  document.getElementById('bottom_button_order').classList.remove('edit-bottom-button-order');
  document.getElementById('create_button_div').classList.remove('edit-ok-button');
}


async function createTask() {
  let taskData = collectTaskFormData();
  let taskId = await getNewId("tasks");

  setTaskData(taskData, taskId);
  await manageTaskCreationCompletion(taskId);
}


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


async function updateUserTaskInDatabase(userId, taskId) {
  if (userId != 0) {
    let path = `users/${userId - 1}/tasks/${activeUser.tasks.length - 1}`;
    return postData(path, taskId);
  }
}


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
