/**
 * Binds an event listener for DOMContentLoaded, then calls `renderContent` to initialize the page.
 * @event document:DOMContentLoaded
 */
document.addEventListener("DOMContentLoaded", () => {
  renderContent();
});

/**
 * Fetches and organizes user contacts into groups, then renders them on the page.
 * @async
 * @function renderContent
 * @returns {Promise<void>}
 */
async function renderContent() {
  const groupedContacts = await groupContacts();
  renderContactsList(groupedContacts);
}

/**
 * Retrieves and groups the active user's contacts by their first initial.
 * @async
 * @function groupContacts
 * @returns {Promise<Object>} An object keyed by first letter, each containing an array of contact objects.
 */
async function groupContacts() {
  userContacts = await filterUserContacts();
  return userContacts.reduce((acc, contact, index) => {
    if (contact && contact.initials) {
      let firstInitial = contact.initials.charAt(0).toUpperCase();
      if (!acc[firstInitial]) {
        acc[firstInitial] = [];
      }
      acc[firstInitial].push({ contact, initials: contact.initials, index });
    }
    return acc;
  }, {});
}

/**
 * Filters out only the active user's contacts from the global contacts database.
 * @async
 * @function filterUserContacts
 * @returns {Promise<Array>} An array containing the active user's contact objects.
 */
async function filterUserContacts() {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const data = await fetchData("contacts");
  const contacts = Object.values(data);
  const userContacts = contacts.filter((contact) =>
    activeUser.contacts.includes(contact.id)
  );
  return userContacts;
}

/**
 * Renders the contacts in the DOM by creating initial letter boxes and contact entries.
 * @async
 * @function renderContactsList
 * @param {Object} groupedContacts - An object grouping contacts by their initial.
 * @returns {Promise<void>}
 */
async function renderContactsList(groupedContacts) {
  const contactList = document.getElementById("contact_list");
  contactList.innerHTML = "";
  await initActiveUser(contactList);
  const sortedInitials = sortInitials(Object.keys(groupedContacts));
  sortedInitials.forEach((initial) => {
    initLetterBox(initial, contactList);
    renderContactsByInitial(groupedContacts[initial], contactList);
  });
}

/**
 * Initializes an entry for the active user at the top of the contact list if available.
 * @async
 * @function initActiveUser
 * @param {HTMLElement} contactList - The DOM element where contacts are rendered.
 * @returns {Promise<void>}
 */
async function initActiveUser(contactList) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  const user = await searchForUser(activeUser.id);
  if (user) {
    user.id = 0;
    contactList.innerHTML = generateActiveUserContact(user);
  }
}

/**
 * Sorts an array of initials alphabetically.
 * @function sortInitials
 * @param {string[]} initials - An array of single-letter strings.
 * @returns {string[]} The sorted array of initials.
 */
function sortInitials(initials) {
  return initials.sort();
}

/**
 * Renders each contact belonging to a particular initial group into the contact list.
 * @function renderContactsByInitial
 * @param {Array} contacts - An array of contact objects, each wrapped with its index and initials.
 * @param {HTMLElement} contactList - The DOM element to which the contact HTML is appended.
 * @returns {void}
 */
function renderContactsByInitial(contacts, contactList) {
  contacts.forEach(({ contact }) => {
    const contactHtml = generateContact(contact);
    contactList.innerHTML += contactHtml;
  });
}

/**
 * Renders a letter box for grouping contacts by their first initial.
 * @function initLetterBox
 * @param {string} initial - The letter corresponding to a group of contacts.
 * @param {HTMLElement} contactList - The DOM element where the letter box is placed.
 * @returns {void}
 */
function initLetterBox(initial, contactList) {
  const letterBoxHtml = generateLetterBox(initial);
  contactList.innerHTML += letterBoxHtml;
}

/**
 * Adds a new contact to the active user, then refreshes the page content and clears the form.
 * @async
 * @function addContact
 * @returns {Promise<void>}
 */
async function addContact() {
  const contactId = await postNewContact();
  addContactToUser(contactId, activeUser);
  addContactToUserLocal(contactId, activeUser);
  closeDialog();
  await openDialogSuccessfully('created');
  clearForm();
  renderContent();
}

/**
 * Creates a contact object with relevant fields like name, email, phone, color, and initials.
 * @function createContact
 * @param {string} name - The contact's name.
 * @param {string} email - The contact's email address.
 * @param {string} phone - The contact's phone number.
 * @param {number} contactId - A unique ID for the contact.
 * @returns {Object} A contact object containing user details.
 */
function createContact(name, email, phone, contactId) {
  return {
    id: contactId,
    name: name,
    email: email,
    phone: phone,
    color: generateRandomColor(),
    initials: getInitials(name),
  };
}

/**
 * Generates a random color in hex format for contact icons.
 * @function generateRandomColor
 * @returns {string} A randomly generated hex color code (e.g., "#A3B9C6").
 */
function generateRandomColor() {
  const darkLetters = "0123456789ABC";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += darkLetters[Math.floor(Math.random() * darkLetters.length)];
  }
  return color;
}

/**
 * Retrieves a contact's data and displays it in the contact info box. If on mobile, shows a mobile-specific view.
 * @async
 * @function displayContactInfo
 * @param {number} contactId - The unique identifier of the contact to display.
 * @returns {Promise<void>}
 */
async function displayContactInfo(contactId) {
  const contact = await getContact(contactId);
  if (window.innerWidth <= 777) {
    return displayContactInfoMobile(contactId);
  }
  const contactInfoDiv = document.querySelector(".contacts-info-box");
  const contactInfoButtons = document.getElementById("button_edit_dialog");
  contactInfoDiv.innerHTML = generateContactInfo(contact);
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  if (contact.id === 0) {
    document.getElementById("for_active_user").classList.add("letter-circel-user");
    document.getElementById("user_delete_display_info").classList.add("d-none");
  }
  highlightContact(contact);
}

/**
 * Obtains a contact object based on its ID. If the ID is 0, it is the active user, otherwise it's a normal contact.
 * @async
 * @function getContact
 * @param {number} contactId - The unique identifier of the contact to fetch.
 * @returns {Promise<Object>} The contact data object.
 */
async function getContact(contactId) {
  if (contactId === 0) {
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    const contact = await searchForUser(activeUser.id);
    contact.id = 0;
    return contact;
  } else {
    return await searchForContact(contactId);
  }
}

/**
 * Visually highlights a contact in the contact list to indicate it is currently selected.
 * @function highlightContact
 * @param {Object} contact - The contact data object.
 * @param {number} contact.id - The unique identifier of the contact.
 * @returns {void}
 */
function highlightContact(contact) {
  const contacts = document.getElementsByClassName("contacts");
  for (let i = 0; i < contacts.length; i++) {
    contacts[i].style.backgroundColor = "";
    contacts[i].style.color = "black";
  }
  document.getElementById(`contact${contact.id}`).style.backgroundColor =
    "#27364a";
  document.getElementById(`contact${contact.id}`).style.color = "white";
}

/**
 * Generates initials for a given name. For single names, returns the first character in uppercase.
 * For multiple names, returns the first character of the first and last names in uppercase.
 * @function getInitials
 * @param {string} name - The full name of the user or contact.
 * @returns {string} The generated initials (e.g., "JD").
 */
function getInitials(name) {
  const names = name.split(" ");
  if (names.length === 1) {
    return names[0].charAt(0).toUpperCase();
  }
  const firstInitial = names[0].charAt(0).toUpperCase();
  const lastInitial = names[names.length - 1].charAt(0).toUpperCase();
  return firstInitial + lastInitial;
}

/**
 * Truncates the given text to a specified length, adding ellipsis if necessary.
 * @function limitTextLength
 * @param {string} text - The original text to potentially truncate.
 * @param {number} [maxLength=25] - The maximum length before truncation.
 * @returns {string} The truncated text or the original if it's below the max length.
 */
function limitTextLength(text, maxLength = 25) {
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "...";
  }
  return text;
}

/**
 * Returns a promise that resolves after a specified number of milliseconds.
 * @function wait
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after `ms` milliseconds.
 */
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ======================= MOBILE ======================= */

/**
 * Displays a contact's information in a mobile-specific view by adjusting the layout
 * and adding buttons for editing or deleting.
 * @async
 * @function displayContactInfoMobile
 * @param {number} contactId - The contact's unique identifier.
 * @returns {Promise<void>}
 */
async function displayContactInfoMobile(contactId) {
  let infoDiv = document.getElementById("mobile_contact_info");
  infoDiv.classList.remove("d-none");
  infoDiv.classList.add("pos-abs");
  const contact = await getContact(contactId);
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  const contactInfoButtons = document.getElementById("button_edit_dialog");
  contactInfoDiv.innerHTML = generateContactInfo(contact);
  if (contact.id === 0) {
    document.getElementById("for_active_user").classList.add("letter-circel-user");
    document.getElementById("user_delete_display_info").classList.add("d-none");
  }
  contactInfoButtons.innerHTML = generateButtonsInContactInfo(contact);
  mobileEditContact();
  const menu = document.getElementById("mobile_menu");
  menu.innerHTML = generateMobileMenu(contact);
  if (contact.id === 0) {
    document.getElementById("user_delete_mobile").classList.add("d-none");
  }
}

/**
 * Disables the edit/delete button block when in mobile mode,
 * hiding it from the screen.
 * @function mobileEditContact
 * @returns {void}
 */
function mobileEditContact() {
  const contactMobileButton = document.querySelector(
    ".contact-box-edit-delete"
  );
  contactMobileButton.classList.add("d-none");
}

/**
 * Closes the mobile contact info view, returning the layout to its default state.
 * @function goBackMobile
 * @returns {void}
 */
function goBackMobile() {
  document.getElementById("mobile_contact_info").classList.add("d-none");
  document.getElementById("mobile_contact_info").classList.remove("pos-abs");
  const contactInfoDiv = document.querySelector(".mobile-contacts-info-box");
  contactInfoDiv.innerHTML = "";
}

/**
 * Opens the mobile menu and sets up a click listener to close it when clicking outside.
 * @function openMobileMenu
 * @returns {void}
 */
function openMobileMenu() {
  const menu = document.getElementById("mobile_menu");
  menu.classList.add("d-flex");
  const handleClickOutside = (event) => {
    if (!menu.contains(event.target)) {
      menu.classList.remove("d-flex");
      document.removeEventListener("click", handleClickOutside);
    }
  };
  setTimeout(() => {
    document.addEventListener("click", handleClickOutside);
  }, 0);
}

/* ======================= OPERATIONS ======================= */

/**
 * Creates a new contact on the server using form inputs for name, email, and phone.
 * @async
 * @function postNewContact
 * @returns {Promise<number|undefined>} The newly created contact's ID, or undefined if missing name/email.
 */
async function postNewContact() {
  const name = getInputValue("name");
  const email = getInputValue("email");
  const phone = getInputValue("phone");
  if (!name || !email) return;
  const contactId = await getNewId("contacts");
  const contactData = createContact(name, email, phone, contactId);
  await postData(`contacts/${contactId - 1}/`, contactData);
  return contactId;
}

/**
 * Adds a contact to the active user's contacts list in the backend if it's not already present.
 * @async
 * @function addContactToUser
 * @param {number} contactId - The ID of the contact to add.
 * @param {Object} activeUser - The active user's object containing at least an `id` and `contacts` array.
 * @returns {Promise<void>}
 */
async function addContactToUser(contactId, activeUser) {
  const user = await searchForUser(activeUser.id);
  if (user && !user.contacts.includes(contactId)) {
    user.contacts.push(contactId);
    await postData(`users/${user.id - 1}/`, { ...user });
  }
}

/**
 * Adds a contact to the localStorage record of the active user without updating the backend.
 * @function addContactToUserLocal
 * @param {number} contactId - The ID of the contact to add.
 * @returns {void}
 */
function addContactToUserLocal(contactId) {
  const activeUser = JSON.parse(localStorage.getItem("activeUser"));
  activeUser.contacts.push(contactId);
  localStorage.setItem("activeUser", JSON.stringify(activeUser));
}
