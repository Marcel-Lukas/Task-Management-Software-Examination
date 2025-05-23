/**
 * An array of backup task objects used for restoring or initializing the tasks on the board.
 * Each object represents a task with properties such as title, description, status, subtasks, and assigned contacts.
 *
 * @constant
 * @type {Array<Object>}
 * @property {number}         .id             - The unique identifier of the task.
 * @property {string}         .title          - The title or name of the task.
 * @property {string}         .description    - A brief explanation of what the task entails.
 * @property {string}         .category       - The category under which this task falls (e.g., "Tutorial").
 * @property {string}         .date           - The due date for the task (in YYYY-MM-DD format).
 * @property {string}         .priority       - The task's priority level (e.g., "low", "medium", "urgent").
 * @property {string}         .status         - The current status of the task (e.g., "todo", "inprogress", "awaitfeedback", "done").
 * @property {Array<number>}  .assigned       - An array of contact IDs assigned to this task.
 * @property {string|number}  .user           - A reference to the user (or user ID) primarily responsible for this task; can be empty if none is set.
 * @property {Array<Object>}  .subtasks       - An array of subtask objects belonging to this task.
 * @property {boolean}        .subtasks[].done         - Indicates whether the subtask is completed (`true`) or not (`false`).
 * @property {number}         .subtasks[].subId        - A unique identifier for the subtask within the task.
 * @property {string}         .subtasks[].subTaskName  - The name or description of the subtask.
 */

let backupTask = [
  {
    assigned: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    category: "Tutorial",
    date: "2025-07-05",
    description: "Welcome to Join! Here you can find your default board. This board represents your project and contains four default lists: \"To do\", \"In progress\", \"Await feedback\" and \"Done\".",
    id: 1,
    priority: "low",
    status: "todo",
    subtasks: [
      {
        done: true,
        subId: 1,
        subTaskName: "Find the board.",
      },
      {
        done: false,
        subId: 2,
        subTaskName: "First read all tutorials.",
      },
    ],
    title: "1. Exploring Join",
    user: "",
  },
  {
    assigned: [1, 2, 3, 4],
    category: "Tutorial",
    date: "2025-07-03",
    description: "In your Join you will find 5 tasks and 10 contacts to try out. If you delete them, they are permanently removed from your Join board.",
    id: 2,
    priority: "urgent",
    status: "todo",
    title: "2. Sample Tasks and Contacts",
    user: "",
  },
  {
    assigned: [4, 5, 6],
    category: "Tutorial",
    date: "2025-07-20",
    description: "You can freely edit your cards and move tasks between sections as needed.",
    id: 3,
    priority: "low",
    status: "inprogress",
    subtasks: [
      {
        done: false,
        subId: 1,
        subTaskName: "Change the title of a task.",
      },
      {
        done: false,
        subId: 2,
        subTaskName: "Add an assignee to the task.",
      },
      {
        done: false,
        subId: 3,
        subTaskName: "Add yourself to the task as an assignee.",
      },
      {
        done: false,
        subId: 4,
        subTaskName: "Move a task to another section.",
      },
      {
        done: false,
        subId: 5,
        subTaskName: "Delete a task.",
      },
    ],
    title: "3. Edit Cards",
    user: "",
  },
  {
    assigned: [6, 7, 8],
    category: "Tutorial",
    date: "2025-11-10",
    description: "Cards represent individual tasks. Click the \"+\" above the list to create a new task, or use the \"Add Task\" option in the main menu.",
    id: 4,
    priority: "medium",
    status: "awaitfeedback",
    subtasks: [
      {
        done: false,
        subId: 1,
        subTaskName: "Go to \"Add Task\" in the main menu and add a new task.",
      },
      {
        done: false,
        subId: 2,
        subTaskName: "Add a task directly under \"In progress\".",
      },
    ],
    title: "4. Adding Cards",
    user: "",
  },
  {
    assigned: [7, 8, 9],
    category: "Tutorial",
    date: "2025-07-29",
    description: "You can add new contacts to your projects by navigating to \"Contacts\" in the main menu and clicking \"Add new contact\". Once added, these contacts can be assigned tasks and edit them as needed.",
    id: 5,
    priority: "medium",
    status: "done",
    subtasks: [
      {
        done: false,
        subId: 1,
        subTaskName: "Go to \"Contacts\" in the menu and add a new contact.",
      },
      
    ],
    title: "5. Creating Contacts",
    user: "",
  },
  {
    assigned: [1, 2, 3, 4, 5, 6, 7, 8, 9],
    category: "Tutorial",
    date: "2025-07-04",
    description: "Welcome to Join! Here you can find your default board. This board represents your project and contains four default lists: \"To do\", \"In progress\", \"Await feedback\" and \"Done\".",
    id: 6,
    priority: "low",
    status: "todo",
    subtasks: [
      {
        done: true,
        subId: 1,
        subTaskName: "Find the board.",
      },
      {
        done: false,
        subId: 2,
        subTaskName: "First read all tutorials.",
      },
    ],
    title: "1. Exploring Join",
    user: "",
  },
  {
    assigned: [1, 2, 3, 4],
    category: "Tutorial",
    date: "2025-07-04",
    description: "In your Join you will find 5 tasks and 10 contacts to try out. If you delete them, they are permanently removed from your Join board.",
    id: 7,
    priority: "urgent",
    status: "todo",
    title: "2. Sample Tasks and Contacts",
    user: "",
  },
  {
    assigned: [4, 5, 6],
    category: "Tutorial",
    date: "2025-07-23",
    description: "You can freely edit your cards and move tasks between sections as needed.",
    id: 8,
    priority: "low",
    status: "inprogress",
    subtasks: [
      {
        done: false,
        subId: 1,
        subTaskName: "Change the title of a task.",
      },
      {
        done: false,
        subId: 2,
        subTaskName: "Add an assignee to the task.",
      },
      {
        done: false,
        subId: 3,
        subTaskName: "Add yourself to the task as an assignee.",
      },
      {
        done: false,
        subId: 4,
        subTaskName: "Move a task to another section.",
      },
      {
        done: false,
        subId: 5,
        subTaskName: "Delete a task.",
      },
    ],
    title: "3. Edit Cards",
    user: "",
  },
  {
    aassigned: [6, 7, 8],
    category: "Tutorial",
    date: "2025-07-11",
    description: "Cards represent individual tasks. Click the \"+\" above the list to create a new task, or use the \"Add Task\" option in the main menu.",
    id: 9,
    priority: "medium",
    status: "awaitfeedback",
    subtasks: [
      {
        done: false,
        subId: 1,
        subTaskName: "Go to \"Add Task\" in the main menu and add a new task.",
      },
      {
        done: false,
        subId: 2,
        subTaskName: "Add a task directly under \"In progress\".",
      },
    ],
    title: "4. Adding Cards",
    user: "",
  },
  {
    assigned: [7, 8, 9],
    category: "Tutorial",
    date: "2025-07-29",
    description: "You can add new contacts to your projects by navigating to \"Contacts\" in the main menu and clicking \"Add new contact\". Once added, these contacts can be assigned tasks and edit them as needed.",
    id: 10,
    priority: "medium",
    status: "done",
    subtasks: [
      {
        done: false,
        subId: 1,
        subTaskName: "Go to \"Contacts\" in the menu and add a new contact.",
      },
      
    ],
    title: "5. Creating Contacts",
    user: "",
  },
];
