/**
 * Generates an HTML string representing the currently active user in the assignment list,
 * including a color-coded icon and name badge.
 * @function showAssignedUser
 * @param {Object} activeUser - The active user's data.
 * @param {string} activeUser.id - The unique identifier of the user.
 * @param {string} activeUser.color - The background color associated with the user.
 * @param {string} activeUser.initials - The user's initials.
 * @param {string} activeUser.name - The user's full name.
 * @returns {string} An HTML string that displays the active user's name, color icon, and a label indicating ownership.
 */
function showAssignedUser(activeUser) {
  return `<div id="bg_task_0" onclick="addUserToTask('contact_to_task_0', 'task', 'bg_task_0', '${activeUser.id}')" class="contact-list padding-7-16 font-s-20 cursor-p d-flex-spbe-center">
            <div class="d-flex-center gap-16">
              <div class="user-icon d-flex-center" style="background-color: ${activeUser.color};">
                  <span>${activeUser.initials}</span>
              </div>
              <span id="task_name_${activeUser.id}">${activeUser.name}</span>
              <span>(You)</span>
            </div>
            <img id="contact_to_task_0" src="../assets/img/png/check-task-false.png" alt="Empty checkbox">
          </div>`;
}

/**
 * Generates an HTML string representing a contact within the assignment list,
 * including a color-coded icon and name badge.
 * @function showAssignedContactList
 * @param {Object} contact - The contact's data object.
 * @param {number} contact.id - The unique identifier of the contact.
 * @param {string} contact.color - The background color associated with the contact.
 * @param {string} contact.initials - The contact's initials.
 * @param {string} contact.name - The contact's full name.
 * @returns {string} An HTML string that displays the contact's icon, name, and a checkbox for assignment.
 */
function showAssignedContactList(contact) {
  return `<div id="bg_task_${contact.id}" onclick="addContactToTask('contact_to_task_${contact.id}', 'task', 'bg_task_${contact.id}', '${contact.id}')" class="contact-list padding-7-16 font-s-20 cursor-p d-flex-spbe-center">
            <div class="d-flex-center gap-16">
              <div class="contact-icon d-flex-center" style="background-color: ${contact.color};">
                  <span>${contact.initials}</span>
              </div>
              <span id="task_name_${contact.id}">${contact.name}</span>
            </div>
            <img id="contact_to_task_${contact.id}" src="../assets/img/png/check-task-false.png" alt="Empty checkbox">
          </div>`;
}

/**
 * Generates an HTML string to display an assigned user's icon,
 * typically shown under a task or project as a visual indicator.
 * @function assignedUser
 * @param {string} userInitials - The initials of the user.
 * @param {number} activUserID - The unique identifier of the user.
 * @param {string} userColor - The background color associated with the user icon.
 * @returns {string} An HTML string that displays the user's icon (initials and color).
 */
function assignedUser(userInitials, activUserID, userColor) {
  return `<div id="assigned_${activUserID}" class="user-icon d-flex-center" style="background-color: ${userColor};">
            <span>${userInitials}</span>
          </div>`;
}

/**
 * Generates an HTML string to display a contact's icon when assigned to a task.
 * @function assignedContacts
 * @param {Object} activeContacts - The assigned contact's data object.
 * @param {number} activeContacts.id - The unique identifier of the contact.
 * @param {string} activeContacts.color - The background color for the contact icon.
 * @param {string} activeContacts.initials - The contact's initials.
 * @returns {string} An HTML string that displays the assigned contact's icon (initials and color).
 */
function assignedContacts(activeContacts) {
  return `<div id="assigned_${activeContacts.id}" class="contact-icon d-flex-center" style="background-color: ${activeContacts.color};">
            <span>${activeContacts.initials}</span>
          </div>`;
}

/**
 * Generates an HTML string for displaying available task categories.
 * @function showCategory
 * @returns {string} An HTML string containing clickable category options.
 */
function showCategory() {
  return `<div class="category-list padding-7-16 font-s-20 cursor-p" onclick="selectCategory('Technical Task')">
            <span>Technical Task</span>
          </div>
          <div class="category-list padding-7-16 font-s-20 cursor-p" onclick="selectCategory('User Story')">
            <span>User Story</span>
          </div>`;
}

/**
 * Generates an HTML string representing a subtask in both editable and non-editable states.
 * This includes controls for editing, deleting, and saving subtasks.
 * @function addSubtasksToList
 * @param {string} subtasksInput - The text input for the subtask's description.
 * @param {number} id - The unique identifier for the subtask.
 * @returns {string} An HTML string displaying a subtask list item with associated edit/delete buttons.
 */
function addSubtasksToList(subtasksInput, id) {
  return `<div id="listItem_${id}" class="list-item pos-rel li-hover">
            <li id="list_subtask_${id}" ondblclick="editSubtask(this, ${id})">${subtasksInput}</li>
            <div id="list_imgs_activ_${id}" class="d-flex-center gap-4 pos-abs imgs-pos-activ list-imgs-activ">
              <img class="hover-circle-subtask-active" onclick="editSubtask(document.querySelector('#listItem_${id} li'), ${id})" src="../assets/img/png/subtasks-edit.png" alt="Edit pencil">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask-active" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="Delete cross">
            </div>
          </div>
          <div id="listItem_input_${id}" class="pos-rel li-hover">
            <input id="input_subtask_${id}" onkeydown="return checkEnterKey(event, ${id})" type="text" class="subtasks-input font-s-16 d-none">
            <div id="list_imgs_inactiv_${id}" class="d-flex-center gap-4 pos-abs imgs-pos d-none">
              <img class="hover-circle-subtask" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="Delete cross">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask" onclick="saveInput(${id})" src="../assets/img/png/subtasks-checkmark.png" alt="Checkmark">
            </div>
          </div>`;
}

/**
 * Generates an HTML string to show a feedback overlay when a task is successfully added to the board.
 * @function taskAddedToBoard
 * @returns {string} An HTML string indicating that a new task has been added to the board.
 */
function taskAddedToBoard() {
  document.getElementById('task_added_overlay').classList.remove('d-none');
  return `<div class="font-s-20 added-overlay d-flex-center gap-10">
            <span>Task added to board</span>
            <img src="../assets/img/png/board-white.png" alt="Board symbol">
          </div>`;
}

/**
 * Generates an HTML string representing an edit mode template for a specific task,
 * including an alert for required fields and an "Ok" button to confirm edits.
 * @function editTaskTemplate
 * @param {number} taskId - The unique identifier of the task to be edited.
 * @returns {string} An HTML string containing the edit template.
 */
function editTaskTemplate(taskId) {
  return `<div class="bottom-edit-order">
            <span class="alert-field">
              <span class="required-sign">*</span>
              This field is required
            </span>
            <button onclick="enableEditButton(${taskId})" id="create_button" class="create-task-button">
              <span>Ok</span>
              <img src="../assets/img/png/create-check-mark.png" alt="Checkmark" />
            </button>
          </div>`;
}
