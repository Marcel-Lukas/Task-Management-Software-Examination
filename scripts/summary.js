/**
 * Initializes the application once the DOM is fully loaded.
 * Executes the greeting, renders tasks, and conditionally 
 * checks and displays the mobile greeting if the screen width 
 * is 770 pixels or less.
 */
document.addEventListener("DOMContentLoaded", initializeApp);

function initializeApp() {
  greeting();
  renderTasks();
  if (window.innerWidth <= 770) {
    handleFirstTimeGreeting();
  }
}


/**
 * Updates and displays the greeting message in both desktop and mobile views.
 *
 * @function greeting
 */
function greeting() {
  let greeting = document.getElementById("greetings");
  let greetingMobile = document.getElementById("greeting_mobile");
  let greetingUser = getNameFromLocalStorage();
  let greetingMassage = getGreetingMessage();
  greeting.innerHTML = "";
  greetingMobile.innerHTML = "";
  greeting.innerHTML = greetingHtml(greetingMassage, greetingUser);
  greetingMobile.innerHTML = greetingHtml(greetingMassage, greetingUser);
}


/**
 * Retrieves the active user's name from local storage.
 *
 * @returns {string} The name of the logged-in user, or an empty string if not found.
 */
function getNameFromLocalStorage() {
  let activeUser = localStorage.getItem("activeUser");
  const loggedInUser = JSON.parse(activeUser);
  return loggedInUser.name;
}


/**
 * Returns a greeting message based on the current time.
 *
 * @returns {string} A greeting message: "Good morning", "Good afternoon", or "Good evening".
 */
function getGreetingMessage() {
  const currentHour = new Date().getHours();
  if (currentHour < 12) {
    return "Good morning";
  } else if (currentHour < 18) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}


/**
 * Generates the HTML for the greeting.
 *
 * @param {string} greetingMessage - The greeting message.
 * @param {string} greetingUser - The user's name.
 * @returns {string} The HTML representation of the greeting.
 */
function greetingHtml(greetingMassage, greetingUser) {
  return `${greetingMassage}, <div class="greeting-user">${greetingUser}</div>`;
}


/**
 * Renders tasks and updates various counters.
 *
 * @async
 * @function renderTasks
 * @returns {Promise<void>} Resolves when the tasks have been loaded and counters updated.
 */
async function renderTasks() {
  const tasks = await loadTasks();
  countToDo(tasks);
  countDone(tasks);
  countUrgent(tasks);
  deadlineDate(tasks);
  countTaskInBoard(tasks);
  countTaskInProgress(tasks);
  countTaskInFeedback(tasks);
}


/**
 * Loads the active user's tasks from local storage.
 *
 * @async
 * @function loadTasks
 * @returns {Promise<Array>} An array of the active user's tasks, or an empty array if none are found.
 */
async function loadTasks() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  if (activeUser && activeUser.tasks) {
    const taskIds = activeUser.tasks;
    const tasks = await Promise.all(
      taskIds.map(async (taskId) => {
        const allTasks = await fetchData("tasks");
        return allTasks.find((t) => t.id === taskId) || null;
      })
    );
    return tasks.filter((task) => task !== null);
  }
  return [];
}


/**
 * Counts the number of tasks with the status "todo" and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countToDo(tasks) {
  let toDo = document.getElementById("count_to_do");
  let count = tasks.filter((task) => task.status === "todo").length;
  toDo.innerHTML = `${count}`;
}


/**
 * Counts the number of completed tasks and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countDone(tasks) {
  let done = document.getElementById("count_done");
  let count = tasks.filter((task) => task.status === "done").length;
  done.innerHTML = `${count}`;
}


/**
 * Counts the number of tasks with a due date and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countUrgent(tasks) {
  let urgent = document.getElementById("count_priority_urgent");
  let count = tasks.filter((task) => task.priority === "urgent").length;
  urgent.innerHTML = `${count}`;
}


/**
 * Counts the total number of tasks and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countTaskInBoard(tasks) {
  let taskInBoard = document.getElementById("count_tasks");
  let count = tasks.length;
  taskInBoard.innerHTML = `${count}`;
}


/**
 * Counts the number of tasks in the "in progress" status and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countTaskInProgress(tasks) {
  let taskInProgress = document.getElementById("count_progress");
  let count = tasks.filter((task) => task.status === "inprogress").length;
  taskInProgress.innerHTML = `${count}`;
}


/**
 * Counts the number of tasks in the "await feedback" status and updates the display.
 * @param {Array} tasks - The list of tasks.
 */
function countTaskInFeedback(tasks) {
  let taskInFeedback = document.getElementById("count_feedback");
  let count = tasks.filter((task) => task.status === "awaitfeedback").length;
  taskInFeedback.innerHTML = `${count}`;
}


/**
 * Displays the nearest due date among the provided tasks in a formatted string.
 *
 * @param {Array} tasks - The list of tasks, each possibly containing a "date" property (YYYY-MM-DD).
 */
function deadlineDate(tasks) {
  const tasksWithDueDate = tasks.filter((task) => task.date);
  tasksWithDueDate.sort((a, b) => new Date(a.date) - new Date(b.date));
  const nextDueDate = tasksWithDueDate[0]?.date; 
  const [year, month, day] = nextDueDate.split("-");
  const dateObj = new Date(year, month - 1, day);
  const formattedDate = dateObj.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const deadlineElement = document.getElementById("deadline_date");
  deadlineElement.innerHTML = `${formattedDate}`;
}


/**
 * Navigates the user to the board page.
 *
 * @function navigateToBoard
 */
function navigateToBoard() {
  window.location.href = "../html/board.html";
}


/**
 * Displays a mobile greeting and hides it after 2.2 seconds.
 *
 * @function mobileGreeting
 */
function mobileGreeting() {
  const greetingDialog = document.getElementById("greeting_mobile");
  if (greetingDialog) {
    greetingDialog.classList.remove("d-none");
    setTimeout(() => {
      greetingDialog.classList.add("d-none");
      greetingDialog.close();
    }, 2222); 
  }
}


/**
 * Checks whether the mobile greeting has been displayed, and shows it if necessary.
 *
 * @function handleFirstTimeGreeting
 */
function handleFirstTimeGreeting() {
  const greetingShown = localStorage.getItem("greetingShown");
  if (greetingShown === "false" || !greetingShown) {
    mobileGreeting();
    localStorage.setItem("greetingShown", "true");
  }
}
