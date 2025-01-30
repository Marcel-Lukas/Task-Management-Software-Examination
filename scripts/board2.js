/**
 * Completes the task editing process by clearing subtasks, showing a feedback dialog,
 * and eventually reopening the single task view.
 * @async
 * @function handleTaskEditCompletion
 * @param {number} taskId - The ID of the edited task.
 * @returns {Promise<void>}
 */
async function handleTaskEditCompletion(taskId) {
  subTasks = [];
  openAddTaskDialogFeedback();
  await wait(1500);
  toggleTaskOverlays();
  closeAddTaskDialogFeedback();
  openSingleTask(taskId);
}

/**
 * Toggles both the edit overlay and the task overlay to hide them.
 * @function toggleTaskOverlays
 * @returns {void}
 */
function toggleTaskOverlays() {
  toggleOverlay("edit_task_overlay");
  toggleOverlay("board_task_overlay");
}

/**
 * Checks if the global userId array has an ID; if so, returns it. Otherwise, returns an empty string.
 * @function userTest
 * @returns {number|string} The user ID if present; otherwise, an empty string.
 */
function userTest() {
  if (userId[0]) {
    let userTaskId = Number(userId[0]);
    return userTaskId;
  } else {
    let userTaskId = "";
    return userTaskId;
  }
}

/**
 * Sends edited task content to the server. Maintains the task's current status
 * and sets the user ID if specified.
 * @async
 * @function putEditTasksContent
 * @param {string} title - The updated title of the task.
 * @param {string} description - The updated description of the task.
 * @param {string} dueDate - The updated due date for the task.
 * @param {number} taskId - The unique identifier for this task.
 * @param {number[]} assignedTo - An array of contact IDs assigned to the task.
 * @param {string} categorySeleced - The updated category of the task.
 * @param {number|string} userTaskId - The updated user ID for the task, if any.
 * @param {string} currenttaskStatus - The current status of the task (unchanged).
 * @returns {Promise<void>}
 */
async function putEditTasksContent(
  title,
  description,
  dueDate,
  taskId,
  assignedTo,
  categorySeleced,
  userTaskId,
  currenttaskStatus
) {
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

/**
 * Constructs an updated list of subtasks for editing by comparing new data with existing data.
 * @async
 * @function getEditSubtasks
 * @param {number} taskId - The ID of the task whose subtasks are being edited.
 * @returns {Promise<Array<Object>>} An array of subtask objects containing name, ID, and done status.
 */
async function getEditSubtasks(taskId) {
  let tasks = await fetchData("tasks");
  let editSingleTask = tasks.find((task) => task.id === taskId);
  let filteredSubtasks = editSingleTask.subtasks?.filter(data => data !== null) || [];
  if (subTasks.length === 0) return [];
  return subTasks.map((subName, index) => 
    createSubtaskObject(subName, index, filteredSubtasks)
  );
}

/**
 * Creates a subtask object for editing, preserving the 'done' state if it already existed.
 * @function createSubtaskObject
 * @param {string} subName - The subtask's text.
 * @param {number} index - The subtask's index.
 * @param {Object[]} filteredSubtasks - The existing subtasks from the database.
 * @returns {Object} An object with the subtask name, ID, and done status.
 */
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

/**
 * Closes the "Task Added" feedback overlay, resetting it and removing its visible state.
 * @function closeAddTaskDialogFeedback
 * @returns {void}
 */
function closeAddTaskDialogFeedback() {
  let slidingDiv = document.getElementById("task_added_overlay");
  slidingDiv.innerHTML = "";
  slidingDiv.classList.toggle("visible");
}
