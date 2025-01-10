
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