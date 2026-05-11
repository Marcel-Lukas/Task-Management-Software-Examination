# 📋 Join – Task Management

This project was created in February 2025 as part of the Developer Academy Munich training programme. The aim was to deepen our knowledge of JavaScript whilst tackling the practical challenge of collaborative development using Git and GitHub within a small team. 
**Join** is a Kanban-based task management app – a streamlined alternative to tools such as Trello and Slack.

[🚀 Live Demo](https://join.marcel-lukas.com/)

---

## 📸 Preview

Organise your team's workflow with a clean, intuitive Kanban board. Create tasks, assign contacts, set priorities, and track progress through four status columns – all in real time.

---

## ✨ Features

- 🔐 **Authentication** – Register and log in with a personal account or use the guest access
- 📊 **Summary Dashboard** – Key metrics at a glance: task counts, urgent items, and upcoming deadlines
- 🗂️ **Kanban Board** – Four columns: *To Do*, *In Progress*, *Await Feedback*, *Done*
- ↕️ **Drag & Drop** – Move tasks between columns intuitively
- ➕ **Add Task** – Create tasks with title, description, due date, priority, subtasks, and assigned contacts
- ✏️ **Edit & Delete Tasks** – Inline editing with full update support via Firebase
- 👥 **Contact Manager** – Add, edit, and delete contacts; each with a personal colour avatar
- 🔍 **Task Search** – Filter tasks on the board by title or description
- 📱 **Fully Responsive** – Optimised for desktop, tablet, and mobile
- ☁️ **Firebase Backend** – All data is stored and synced in real time via Firebase Realtime Database

---

## 🏗️ Technical Architecture

The project uses exclusively **Vanilla JavaScript**, **HTML5**, and **CSS3** – no external frameworks or libraries.
Data persistence is handled by **Firebase Realtime Database** via a custom REST API wrapper.

### Project Structure

```
📁 Join
├── index.html                  – Entry point: Login & Sign-up
├── main.js                     – Firebase REST client (fetchData, postData, deleteData)
├── style.css                   – Global styles
├── 📁 html/
│   ├── summary.html            – Dashboard with key metrics
│   ├── board.html              – Kanban board with drag & drop
│   ├── addTask.html            – Standalone Add Task page
│   ├── contacts.html           – Contact manager
│   ├── help.html               – Help & documentation
│   ├── privacyPolicy.html      – Privacy policy
│   └── legalNotice.html        – Legal notice
├── 📁 scripts/
│   ├── loginAndSignup.js       – Auth logic (login, register, guest)
│   ├── loginEvents.js          – Login UI event handlers
│   ├── loginValidation.js      – Form validation
│   ├── summary.js              – Dashboard data & rendering
│   ├── boardMain.js            – Board initialisation & search
│   ├── boardTasksHandler.js    – Drag & drop logic
│   ├── boardEditHandler.js     – Task editing & deletion
│   ├── boardSingelTasks.js     – Single task overlay
│   ├── boardTemplates.js       – Board HTML templates
│   ├── addTask.js              – Task form logic
│   ├── addTaskHandler.js       – Task form event handlers
│   ├── addTaskDataHandler.js   – Task data processing & Firebase save
│   ├── addTaskTemplates.js     – Add task HTML templates
│   ├── contacts.js             – Contact list rendering
│   ├── contactManager.js       – CRUD operations for contacts
│   ├── contactsDialogs.js      – Add/edit contact dialogs
│   ├── contactsTemplates.js    – Contact HTML templates
│   └── desktopTemplate.js      – Sidebar & header template
├── 📁 styles/                  – Modular CSS files per page + media queries
└── 📁 assets/                  – Icons, images, fonts
```

---

## 👨‍💻 Authors

Developed by **Marcel Lukas** & **Nicolaus Feldtmann**
as part of the Developer Academy Munich curriculum.

