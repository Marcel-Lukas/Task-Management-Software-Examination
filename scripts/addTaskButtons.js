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


function addSubtasksHandle() {
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
      addSubtasksHandle();
      document.getElementById("subtasks_inactiv_img").classList.add("d-none");
      document.getElementById("subtasks_activ_img").classList.remove("d-none");
    }
  });
}


function changeSubtasksImagesClick(event) {
  if (
    event.target.id === "add_task_board" ||
    "edit_task_board" ||
    "add_task_content"
  ) {
    document.getElementById("subtasks_inactiv_img").classList.remove("d-none");
    document.getElementById("subtasks_activ_img").classList.add("d-none");
  }
}


function changeSubtasksImagesClickPrevention(event) {
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
  return (
    input.input !== "" &&
    input.date !== "" &&
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


function setDate(){
let today = new Date();
let dd = String(today.getDate()).padStart(2, "0");
let mm = String(today.getMonth() + 1).padStart(2, "0");
let yyyy = today.getFullYear();
let formattedDate = `${yyyy}-${mm}-${dd}`;
document.getElementById("due_date").setAttribute("min", formattedDate);
}