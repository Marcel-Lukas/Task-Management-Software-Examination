/**
 * Deletes a contact from the system, updates the page, and closes the mobile menu if necessary.
 * @async
 * @function deleteContact
 * @param {number} contactId - The unique identifier of the contact to remove.
 * @returns {Promise<void>}
 */
async function deleteContact(contactId) {
  await deleteContactInData(contactId);
  openDialogSuccessfully('deleted');
  await renderContent();
  document.querySelector(".contacts-info-box").innerHTML = "";
  if (window.innerWidth < 777) {
    document.getElementById("mobile_menu").classList.remove("d-flex");
    goBackMobile();
  }
}

/**
 * Removes a contact from the database for all or just the active user, updates relevant tasks,
 * and removes references from localStorage.
 * @async
 * @function deleteContactInData
 * @param {number} contactId - The unique identifier of the contact to remove.
 * @returns {Promise<void>}
 */
async function deleteContactInData(contactId) {
  let users = await fetchData("users");
  if (contactId >= 1 && contactId <= 10) {
    await deleteContactOnlyforUser(contactId, users);
  } else {
    await deleteContactforAllUsers(contactId, users);
  }
  await deleteContactFromTasks(contactId);
  deleteContactInLocalStorage(contactId);
}

/**
 * Removes a contact from only the active user's contacts if it falls within a protected range (1-10).
 * @async
 * @function deleteContactOnlyforUser
 * @param {number} contactId - The ID of the contact to remove.
 * @param {Array<Object>} users - An array of user objects to modify.
 * @returns {Promise<void>}
 */
async function deleteContactOnlyforUser(contactId, users) {
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => {
    if (user.id === activeUser.id) {
      return {
        ...user,
        contacts: user.contacts.filter((contact) => contact !== contactId),
      };
    }
    return user;
  });
  await postData("users", users);
}

/**
 * Removes the specified contact from the assigned arrays of all tasks in the database.
 * @async
 * @function deleteContactFromTasks
 * @param {number} contactId - The ID of the contact to remove from tasks.
 * @returns {Promise<void>}
 */
async function deleteContactFromTasks(contactId) {
  const allTasks = await fetchData("tasks");
  const updatedTasks = allTasks.map((task) => {
    if (task.assigned && Array.isArray(task.assigned)) {
      return {
        ...task,
        assigned: task.assigned.filter((id) => id !== contactId),
      };
    }
    return task;
  });
  await postData("tasks", updatedTasks);
}

/**
 * Removes a contact entirely from the system, including from all users' contact lists, if it is not protected (ID > 10).
 * @async
 * @function deleteContactforAllUsers
 * @param {number} contactId - The ID of the contact to remove.
 * @param {Array<Object>} users - An array of user objects.
 * @returns {Promise<void>}
 */
async function deleteContactforAllUsers(contactId, users) {
  await deleteData("contacts", contactId);
  if (activeUser.id === 0) {
    return;
  }
  users = users.map((user) => ({
    ...user,
    contacts: user.contacts.filter((contact) => contact !== contactId),
  }));
  await postData("users", users);
}

/**
 * Removes the deleted contact from the active user's localStorage record.
 * @function deleteContactInLocalStorage
 * @param {number} contactId - The unique ID of the contact to remove.
 * @returns {void}
 */
function deleteContactInLocalStorage(contactId) {
  let activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts = activeUser.contacts.filter(
    (contact) => contact !== contactId
  );
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}

/**
 * Searches for a contact in the "contacts" database object by its ID.
 * @async
 * @function searchForContact
 * @param {number} contactId - The contact's unique identifier.
 * @returns {Promise<Object|undefined>} A contact object if found, otherwise undefined.
 */
async function searchForContact(contactId) {
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c && c.id === contactId);
  return contact;
}

/**
 * Searches for a user in the "users" database object by their ID.
 * @async
 * @function searchForUser
 * @param {number} contactId - The user's unique identifier.
 * @returns {Promise<Object|undefined>} A user object if found, otherwise undefined.
 */
async function searchForUser(contactId) {
  const data = await fetchData("users");
  const contacts = Object.values(data);
  const contact = contacts.find((c) => c && c.id === contactId);
  return contact;
}

/**
 * Opens the confirmation overlay for deleting a contact, inserting a "YES" button that triggers deletion.
 * @function openDeleteDialog
 * @param {number} contactId - The unique identifier of the contact to delete.
 * @returns {void}
 */
function openDeleteDialog(contactId) {
  toggleOverlay("contact_delete_overlay");
  let yesButton = document.getElementById("delete_yes_btn");
  yesButton.innerHTML = generateDeleteButton(contactId);
}

/**
 * Toggles the visibility of an overlay element, preventing page scrolling while the overlay is displayed.
 * @function toggleOverlay
 * @param {string} section - The ID of the overlay DOM element to toggle.
 * @returns {void}
 */
function toggleOverlay(section) {
  let refOverlay = document.getElementById(section);
  refOverlay.classList.toggle("d-none");
  if (!refOverlay.classList.contains("d-none")) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      refOverlay.classList.add("active", "visible");
    }, 50);
  } else {
    document.body.style.overflow = "auto";
    refOverlay.classList.remove("active", "visible");
  }
}
