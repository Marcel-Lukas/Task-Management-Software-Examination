/**
 * Returns an HTML string displaying the currently active user in an assignment list,
 * including a color-coded user icon, name, and indication that this user is "You".
 * @function showAssignedUser
 * @param {Object} activeUser - The data object for the currently active user.
 * @param {string} activeUser.id - The unique identifier of the active user.
 * @param {string} activeUser.color - The color associated with the active user's icon.
 * @param {string} activeUser.initials - The initials of the active user.
 * @param {string} activeUser.name - The full name of the active user.
 * @returns {string} HTML markup that presents the active user in a clickable contact list format.
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
 * Returns an HTML string displaying a contact in an assignment list,
 * including a color-coded contact icon, name, and a checkbox.
 * @function showAssignedContactList
 * @param {Object} contact - The data object for the contact.
 * @param {number} contact.id - The unique identifier of the contact.
 * @param {string} contact.color - The color associated with the contact's icon.
 * @param {string} contact.initials - The initials of the contact.
 * @param {string} contact.name - The full name of the contact.
 * @returns {string} HTML markup that presents a single contact in a clickable contact list format.
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
 * Generates HTML to display an assigned user under a task, showing their icon (initials and color).
 * @function assignedUser
 * @param {string} userInitials - The initials of the assigned user.
 * @param {number} activUserID - The unique identifier of the assigned user.
 * @param {string} userColor - The background color associated with the assigned user.
 * @returns {string} HTML markup representing the user's icon in a circular badge.
 */
function assignedUser(userInitials, activUserID, userColor) {
  return `<div id="assigned_${activUserID}" class="user-icon d-flex-center" style="background-color: ${userColor};">
            <span>${userInitials}</span>
          </div>`;
}

/**
 * Generates HTML to display a contact's icon (initials and color) under a task when assigned.
 * @function assignedContacts
 * @param {Object} activeContacts - The data object representing an assigned contact.
 * @param {number} activeContacts.id - The unique identifier of the contact.
 * @param {string} activeContacts.color - The background color associated with the contact.
 * @param {string} activeContacts.initials - The initials of the contact.
 * @returns {string} HTML markup for the assigned contact icon.
 */
function assignedContacts(activeContacts) {
  return `<div id="assigned_${activeContacts.id}" class="contact-icon d-flex-center" style="background-color: ${activeContacts.color};">
            <span>${activeContacts.initials}</span>
          </div>`;
}

/**
 * Returns an HTML string representing two clickable category options that the user can select for a task.
 * @function showCategory
 * @returns {string} HTML markup with two category options: "Technical Task" and "User Story".
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
 * Creates HTML to display a single subtask, including controls for editing and deleting,
 * as well as a hidden input field for editing mode.
 * @function addSubtasksToList
 * @param {string} subtasksInput - The text or description of the subtask.
 * @param {number} id - The unique identifier of this subtask.
 * @returns {string} HTML markup containing the subtask item, edit, and delete icons.
 */
function addSubtasksToList(subtasksInput, id) {
  return `<div id="listItem_${id}" class="list-item pos-rel li-hover">
            <li id="list_subtask_${id}" ondblclick="editSubtask(this, ${id})">${subtasksInput}</li>
            <div id="list_imgs_activ_${id}" class="d-flex-center gap-4 pos-abs imgs-pos-activ list-imgs-activ">
              <img class="hover-circle-subtask-active" onclick="editSubtask(document.querySelector('#listItem_${id} li'), ${id})" src="../assets/img/png/subtasks-edit.png" alt="Edit pencil">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask-active" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="Delet cross">
            </div>
          </div>
          <div id="listItem_input_${id}" class="pos-rel li-hover">
            <input id="input_subtask_${id}" onkeydown="return checkEnterKey(event, ${id})" type="text" class="subtasks-input font-s-16 d-none">
            <div id="list_imgs_inactiv_${id}" class="d-flex-center gap-4 pos-abs imgs-pos d-none">
              <img class="hover-circle-subtask" onclick="deleteSubtask(${id})" src="../assets/img/png/subtasks-delete.png" alt="Delet cross">
              <div class="dividing-border"></div>
              <img class="hover-circle-subtask" onclick="saveInput(${id})" src="../assets/img/png/subtasks-checkmark.png" alt="Checkmark">
            </div>
          </div>`;
}

/**
 * Reveals an overlay indicating a task was successfully added to the board, and returns the HTML markup for that message.
 * @function taskAddedToBoard
 * @returns {string} HTML markup containing a notification that the task has been added, including an icon.
 */
function taskAddedToBoard() {
  document.getElementById('task_added_overlay').classList.remove('d-none');
  return `<div class="font-s-20 added-overlay d-flex-center gap-10">
            <span>Task added to board</span>
            <img src="../assets/img/png/board-white.png" alt="Board symbol">
          </div>`;
}

/**
 * Returns an HTML snippet for editing a task, showing a required field alert and an "Ok" button
 * that triggers the editing process when clicked.
 * @function editTaskTemplate
 * @param {number} taskId - The unique identifier of the task to be edited.
 * @returns {string} The HTML markup for the edit task template.
 */
function editTaskTemplate(taskId) {
  return `<div class="bottom-edit-order">
            <span class="alert-field">
              <span class="required-sign">*</span>
            This field is required</span>
            <button onclick="enableEditButton(${taskId})" id="create_button" class="create-task-button">
              <span>Ok</span>
              <img src="../assets/img/png/create-check-mark.png" alt="Checkmark" />
            </button>
          </div>`;
}
