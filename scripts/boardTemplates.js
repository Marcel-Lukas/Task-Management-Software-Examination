/**
 * Generates an HTML template for displaying a task on the board, including its category, title,
 * short description, priority icon, and placeholders for subtasks and assignees.
 * @function generateTasksOnBoard
 * @param {number} id - The unique identifier of the task.
 * @param {string} title - The title of the task.
 * @param {string} shortDescription - A shortened version of the task's description.
 * @param {string} category - The category the task belongs to (e.g., "Technical Task").
 * @param {string} categoryColor - A color string derived from the category (e.g., "technicaltask").
 * @param {string} prio - The priority level of the task (e.g., "low", "medium", "urgent").
 * @returns {string} An HTML string to be rendered as a task card on the board.
 */
function generateTasksOnBoard(id, title, shortDescription, category, categoryColor, prio) {
  return `  <div
              class="task-card-area d-flex-column-center"
              id="task_${id}"
              draggable="true"
              ondragstart="startDragging(${id}, event)"
            >
              <div class="w-100" id="arrow_area_top_${id}"></div>
              
              <div id="task_card_${id}" class="task-card d-flex-column" onclick="openSingleTask(${id}); initTemplateAddTask('edit_task_template', false)">
                <div class="task-category font-c-white bg-category-${categoryColor}">
                  ${category}
                </div>
                <div class="d-flex-column gap-8">
                  <div class="task-title font-w-700">
                  ${title}
                  </div>
                  <div class="task-description">
                  ${shortDescription}
                  </div>
                </div>
                <div id="subtasks_${id}" class="task-subtasks d-flex-spbe-center"></div>

                <div class="d-flex-spbe-center">
                  <div class="d-flex-center">
                    <div id="assignees_task_${id}" class="d-flex-center"></div>
                    <div id="assignees_number_${id}" class="d-flex-center"></div>
                  </div>
                  <img src="../assets/img/png/prio-${prio}.png" />
                </div>
              </div>

              <div class="w-100" id="arrow_area_bottom_${id}"></div>
            </div>
          `;
}

/**
 * Generates a placeholder HTML element indicating that no tasks are available for the current status.
 * @function generateNoTaskField
 * @returns {string} An HTML string stating that there are no tasks to do.
 */
function generateNoTaskField() {
  return `<div class="task-none d-flex-center"></div>`;
}

/**
 * Constructs the HTML to display a progress bar for subtasks along with the ratio of completed to total subtasks.
 * @function generateSubtasks
 * @param {number} sumDoneSubtasks - The number of completed subtasks.
 * @param {number} sumAllSubtasks - The total number of subtasks for this task.
 * @returns {string} An HTML snippet containing the progress bar and subtasks count.
 */
function generateSubtasks(sumDoneSubtasks, sumAllSubtasks) {
  return `
      <div class="task-subtasks-bar"></div>
      <span class="task-subtasks-text font-c-black"
      >${sumDoneSubtasks}/${sumAllSubtasks} Subtasks
      </span>`;
}

/**
 * Creates an HTML element representing a single contact assigned to a task, displayed as a small badge.
 * @function generateAssigneeField
 * @param {Object} contact - The contact object containing data for display.
 * @param {string} contact.color - The background color for the contact's badge.
 * @param {string} contact.initials - The initials of the contact.
 * @returns {string} An HTML string for displaying the contact's initials on a colored badge.
 */
function generateAssigneeField(contact) {
  return `<span class="assignee font-s-12 font-c-white mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${contact.color};">${contact.initials}
      </span>`;
}

/**
 * Creates an HTML element showing the number of additional assignees if they exceed a displayed limit.
 * @function generateAdditionallyAssigneeField
 * @param {number} remainingCount - The number of assignees beyond the displayed limit.
 * @returns {string} An HTML snippet with a badge indicating how many additional assignees there are.
 */
function generateAdditionallyAssigneeField(remainingCount) {
  return `<span class="additionally-assignee wh-32 d-flex-center">
        +${remainingCount}
      </span>`;
}

/**
 * Creates an HTML snippet representing the active user as an assignee in a single-task view.
 * @function generateUserField
 * @param {Object} activeUser - The active user's data object.
 * @param {string} activeUser.color - The background color for the user's badge.
 * @param {string} activeUser.initials - The user's initials.
 * @returns {string} An HTML string for displaying the user badge in a single-task view.
 */
function generateUserField(activeUser) {
  return `<span class="user font-s-12 mar-r-8 wh-32 d-flex-center" 
            style="background-color: ${activeUser.color};">${activeUser.initials}
      </span>`;
}

/**
 * Creates an upward arrow icon HTML element to allow moving a task to the previous status (if possible).
 * @function generateArrowTop
 * @param {Object} task - The task data needed to manage status changes.
 * @param {number} task.id - The unique identifier of the task.
 * @param {string} task.status - The current status of the task.
 * @returns {string} An HTML string containing the top arrow icon and an onclick handler.
 */
function generateArrowTop(task) {
  return `<img class="task-arrow cursor-p" onclick="moveToStatus(${task.id}, '${task.status}', -1)" 
            src="../assets/img/png/arrow-drop-up.png"/>`;
}

/**
 * Creates a downward arrow icon HTML element to allow moving a task to the next status (if possible).
 * @function generateArrowBottom
 * @param {Object} task - The task data needed to manage status changes.
 * @param {number} task.id - The unique identifier of the task.
 * @param {string} task.status - The current status of the task.
 * @returns {string} An HTML string containing the bottom arrow icon and an onclick handler.
 */
function generateArrowBottom(task) {
  return `<img class="task-arrow cursor-p" onclick="moveToStatus(${task.id}, '${task.status}', 1)" 
            src="../assets/img/png/arrow-drop-down.png"/>`;
}

/**
 * Creates an HTML snippet for displaying a single-task view overlay with detailed information,
 * including category, priority, assigned users, subtasks, and buttons to edit or delete the task.
 * @function generateSingleTasks
 * @param {Object} singleTask - The full data object for the task.
 * @param {number} singleTask.id - The task's unique identifier.
 * @param {string} singleTask.category - The task's category name.
 * @param {string} singleTask.title - The task's title.
 * @param {string} singleTask.description - The full description of the task.
 * @param {string} singleTask.date - The due date of the task.
 * @param {string} singleTask.priority - The priority level of the task.
 * @param {string} categoryColor - A color string derived from the category (e.g., "technicaltask").
 * @returns {string} An HTML string representing the detailed single-task view.
 */
function generateSingleTasks(singleTask, categoryColor) {
  return `
            <div
                class="litte-button singel-task-close-btn wh-24 d-flex-center"
                onclick="toggleOverlay('board_task_overlay'); updateTasksOnBoard(); clearButton()">
                <img src="../assets/img/png/close.png" alt="" />
            </div>        
          <div class="single-task-content d-flex-column gap-24">
            
            <div class="single-task-category font-c-white bg-category-${categoryColor}">
              ${singleTask.category}
            </div>

            <h2>${singleTask.title}</h2>

            <div class="font-c-black">
              ${singleTask.description}
            </div>

            <div class="single-task-meta">
              Due date:
              <div class="font-c-black">${singleTask.date}</div>
            </div>

            <div class="single-task-meta">
              Priority:
              <img class="single-task-prio" src="../assets/img/png/prio-${singleTask.priority}-text.png" alt="" />
            </div>

            <div class="w-100 d-flex-column gap-8 assignedTo">
              Assigned To:

              <div id="single_assignee" class="single-task-lines d-flex-column gap-4 font-c-black assigneRegister">

                <div class="single-task-assignee">
                  <span
                    class="assignee font-c-white wh-42 d-flex-center bg-255-122-0">EM</span>
                    Alex Kaljuzhin
                </div>

              </div>
            </div>

            <div class="w-100 d-flex-column gap-8">
              Subtasks:
              <div id="single_subtask" class="single-task-lines d-flex-column gap-4 font-s-16 font-c-black"></div>
            </div>

            <div class="single-task-edit">
              <div class="delete cursor-p">
                <img
                  class="img-delete"
                  onclick="openDeleteDialog(${singleTask.id})"
                  src="../assets/img/png/delete-default.png"
                  alt=""/>
              </div>

              <div class="dividing-line"></div>

              <div class="edit cursor-p">
                <img
                  class="img-edit"
                  onclick="openEditDialog(${singleTask.id}); taskValuesToEditField(${singleTask.id});"
                  src="../assets/img/png/edit-default.png"
                  alt=""/>
              </div>
            </div>
          </div>`;
}

/**
 * Generates HTML for displaying the currently active user as an assignee in a single-task view overlay.
 * @function generateSingleUserAsAssignee
 * @returns {string} An HTML snippet showing the active user's icon and name.
 */
function generateSingleUserAsAssignee() {
  return `
         <div class="single-task-assignee">
                  <span
                    class="user font-s-12 wh-42 d-flex-center" style="background-color: ${activeUser.color};">${activeUser.initials}</span>
                    ${activeUser.name}
          </div>`;
}

/**
 * Generates HTML for displaying a contact as an assignee in a single-task view overlay.
 * @function generateSingleAssignee
 * @param {Object} contact - The contact object containing data to display.
 * @param {string} contact.color - The background color of the contact's badge.
 * @param {string} contact.initials - The initials of the contact.
 * @param {string} contact.name - The full name of the contact.
 * @returns {string} An HTML snippet showing the contact's icon and name.
 */
function generateSingleAssignee(contact) {
  return `
          <div class="single-task-assignee">
                  <span
                    class="assignee font-s-12 font-c-white wh-42 d-flex-center" style="background-color: ${contact.color};">${contact.initials}</span>
                    ${contact.name}
          </div>`;
}

/**
 * Generates HTML for each subtask in a single-task view overlay, allowing toggling of its completion status.
 * @function generateSingleSubtasks
 * @param {Object} subtask - The subtask object to display.
 * @param {number} subtask.subId - The unique identifier of the subtask within the task.
 * @param {string} subtask.subTaskName - The name or description of the subtask.
 * @param {boolean} subtask.done - Indicates whether the subtask is completed.
 * @param {number} id - The unique identifier of the main task to which this subtask belongs.
 * @returns {string} An HTML snippet showing the subtask with a checkmark icon reflecting its done state.
 */
function generateSingleSubtasks(subtask, id) {
  return `
          <div onclick="updateSubtaskStatus(${id}, ${subtask.subId})" class="single-task-subtasks cursor-p">
            <img            
            id="task_${id}_subtask_${subtask.subId}"
            class="litte-button"
            src="../assets/img/png/check-button-${subtask.done}.png"
            alt=""/>
            ${subtask.subTaskName}
          </div>`;
}

/**
 * Generates HTML indicating that no assignees have been selected for the task in a single-task view overlay.
 * @function generateNoAssigneeField
 * @returns {string} An HTML snippet stating that no assignees are selected.
 */
function generateNoAssigneeField() {
  return `<div class="single-task-subtasks font-s-16">
            No assignee have been selected yet.
          </div>`;
}

/**
 * Generates HTML indicating that no subtasks have been created for the task in a single-task view overlay.
 * @function generateNoSubtaskField
 * @returns {string} An HTML snippet stating that no subtasks are present.
 */
function generateNoSubtaskField() {
  return `<div class="single-task-subtasks">
            No subtasks have been created yet.
          </div>`;
}

/**
 * Generates a "YES" button for confirming task deletion, calling the deleteTask function upon click.
 * @function generateDeleteButton
 * @param {number} taskId - The unique identifier of the task to delete.
 * @returns {string} An HTML button for confirming the deletion of a task.
 */
function generateDeleteButton(taskId) {
  return `<button class="clear-button"
           onclick="deleteTask(${taskId})">YES
      </button>`;
}
