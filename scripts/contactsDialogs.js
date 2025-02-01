/**
 * Validates the given form fields against specified criteria such as regex patterns,
 * alerts, and maximum length, then returns whether all fields are valid.
 * @function validateFields
 * @param {Array<Object>} fields - An array of field definitions to validate.
 * @param {string} fields[].id - The DOM element ID of the input to validate.
 * @param {RegExp} fields[].regex - A regex pattern the input must match.
 * @param {string} fields[].alert - The ID of the alert element to display error messages.
 * @param {string} fields[].message - The error message to display upon validation failure.
 * @param {number} [fields[].maxLength] - An optional maximum length for the input value.
 * @returns {boolean} `true` if all fields are valid, otherwise `false`.
 */
function validateFields(fields) {
  return fields.every(({ id, regex, alert, message, maxLength }) =>
    validateInput(document.getElementById(id), regex, message, alert, maxLength)
  );
}

/**
 * Validates the form fields for creating a new contact. If valid, calls `addContact()`.
 * @async
 * @function validateForm
 * @returns {Promise<void>}
 */
async function validateForm() {
  const fields = [
    {
      id: "name",
      regex: /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/,
      alert: "field_alert_name",
      message: "⚠ Please enter at least two words and keep it under 23 characters.",
      maxLength: 23,
    },
    {
      id: "email",
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      alert: "field_alert_email",
      message: "⚠ Please enter a valid email address.",
    },
    {
      id: "phone",
      regex: /^\+?\d{1,3}?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/,
      alert: "field_alert_phone",
      message: "⚠ Please enter a phone number with 8 to 15 digits.",
      maxLength: 15,
    }
  ];
  const valid = validateFields(fields);
  if (valid) {
    await addContact();
  }
}

/**
 * Validates the form fields for editing an existing contact. If valid, calls `editContact(contactId)`.
 * @async
 * @function validateEditForm
 * @param {number} contactId - The unique identifier of the contact being edited.
 * @returns {Promise<void>}
 */
async function validateEditForm(contactId) {
  const fields = [
    {
      id: "inputEditName",
      regex: /^[A-Za-zÄäÖöÜüß]+(\s+[A-Za-zÄäÖöÜüß]+){1,}$/,
      alert: "edit_field_alert_name",
      message: "⚠ Please enter at least two words and keep it under 23 characters.",
      maxLength: 23,
    },
    {
      id: "inputEditEmail",
      regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      alert: "edit_field_alert_email",
      message: "⚠ Please enter a valid email address.",
    },
    {
      id: "inputEditPhone",
      regex: /^\+?\d{1,3}?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{3,4}$/,
      alert: "edit_field_alert_phone",
      message: "⚠ Please enter a phone number with 8 to 15 digits.",
      maxLength: 15,
    }
  ];
  const valid = validateFields(fields);
  if (valid) {
    await editContact(contactId);
  }
}

/**
 * Opens the dialog for adding a new contact, showing the background overlay and animating the dialog.
 * @async
 * @function openDialog
 * @returns {Promise<void>}
 */
async function openDialog() {
  const dialogContainer = document.getElementById("dialog_contacts");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  await wait(10);
  dialogContainer.classList.add("dialog-open");
  document.getElementById("grey_background").classList.remove("hidden");
}

/**
 * Opens the edit dialog for the specified contact, populates form fields,
 * hides mobile menu if open, and shows the background overlay.
 * @async
 * @function openDialogEdit
 * @param {number} contactId - The unique identifier of the contact to edit.
 * @returns {Promise<void>}
 */
async function openDialogEdit(contactId) {
  const contact = await getContact(contactId);
  const menu = document.getElementById("mobile_menu");
  if (menu.classList.contains("d-flex")) {
    menu.classList.remove("d-flex");
  }
  if (contact.id === 0) {
    document.getElementById("user_display_info").classList.add("d-none");
  }
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.open = true;
  dialogContainer.classList.add("d-flex");
  document.getElementById("grey_background").classList.remove("hidden");
  populateFormFields(contact);
  await wait(10);
  dialogContainer.classList.add("dialog-open");
  dialogBigLetterCircle(contact);
}

/**
 * Closes the add contact dialog, hides the background overlay, and clears the form inputs.
 * @async
 * @function closeDialog
 * @returns {Promise<void>}
 */
async function closeDialog() {
  const dialogContainer = document.getElementById("dialog_contacts");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey_background").classList.add("hidden");
  await wait(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
  clearForm();
}

/**
 * Closes the edit contact dialog, hides the background overlay, and clears the form inputs.
 * @async
 * @function closeDialogEdit
 * @returns {Promise<void>}
 */
async function closeDialogEdit() {
  const dialogContainer = document.getElementById("dialog_edit");
  dialogContainer.classList.remove("dialog-open");
  document.getElementById("grey_background").classList.add("hidden");
  await wait(300);
  dialogContainer.classList.remove("d-flex");
  dialogContainer.open = false;
  clearEditForm();
}

/**
 * Populates the edit form fields (name, email, phone) with existing contact data.
 * @function populateFormFields
 * @param {Object} contact - The contact data object containing name, email, and phone.
 * @returns {void}
 */
function populateFormFields(contact) {
  document.getElementById("inputEditName").value = contact.name;
  document.getElementById("inputEditEmail").value = contact.email;
  if (contact.phone === undefined) {
    contact.phone = "";
  }
  document.getElementById("inputEditPhone").value = contact.phone;
}

/**
 * Sets up the large letter circle with the contact's initials and adjusts styling if it's the active user.
 * @function dialogBigLetterCircle
 * @param {Object} contact - The contact data object.
 * @returns {void}
 */
function dialogBigLetterCircle(contact) {
  document.getElementById("big_letter_circle").innerHTML =
    generateBigLetterCircle(contact);
  if (contact.color === "#ffffff") {
    document
      .getElementById("for_active_use_dialog_circel")
      .classList.add("letter-circel-user");
  }
}

/**
 * Opens a temporary success dialog indicating the operation (created/edited/deleted) was completed.
 * @async
 * @function openDialogSuccessfully
 * @param {string} operation - A string describing the operation, such as "created" or "edited".
 * @returns {Promise<void>}
 */
async function openDialogSuccessfully(operation) {
  const dialogContainer = document.getElementById("succesfully_created");
  dialogContainer.innerHTML = generateSuccesssfullyHtml(operation);
  setTimeout(async () => {
    dialogContainer.open = true;
    await wait(300);
    dialogContainer.classList.add("dialog-open");
    dialogContainer.classList.add("d-flex");
    await wait(1500);
    dialogContainer.classList.remove("dialog-open");
    await wait(300);
    dialogContainer.classList.remove("d-flex");
    dialogContainer.open = false;
  }, 300);
}

/**
 * Retrieves the value of an input element by ID.
 * @function getInputValue
 * @param {string} id - The ID of the input element.
 * @returns {string} The value of the input element.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Displays an error message for a specific input element, sets the message in an alert element,
 * and applies the "error" class.
 * @function setError
 * @param {HTMLElement} inputElement - The input element that failed validation.
 * @param {string} message - The error message to display.
 * @param {string} alertElementId - The ID of the alert element to update.
 * @returns {void}
 */
function setError(inputElement, message, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = message;
  alertElement.style.display = "block";
  inputElement.classList.add("error");
}

/**
 * Clears any existing error message from a specific input element and removes the "error" class.
 * @function clearError
 * @param {HTMLElement} inputElement - The input element to clear.
 * @param {string} alertElementId - The ID of the alert element associated with the input.
 * @returns {void}
 */
function clearError(inputElement, alertElementId) {
  const alertElement = document.getElementById(alertElementId);
  alertElement.innerText = "";
  alertElement.style.display = "none";
  inputElement.classList.remove("error");
}

/**
 * Clears all inputs and errors in the add contact dialog form.
 * @function clearForm
 * @returns {void}
 */
function clearForm() {
  const nameInput = document.getElementById("name");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");
  nameInput.value = "";
  emailInput.value = "";
  phoneInput.value = "";
  clearError(nameInput, "field_alert_name");
  clearError(emailInput, "field_alert_email");
  clearError(phoneInput, "field_alert_phone");
}

/**
 * Clears all inputs and errors in the edit contact dialog form.
 * @function clearEditForm
 * @returns {void}
 */
function clearEditForm() {
  const nameEditInput = document.getElementById("inputEditName");
  const emailEditInput = document.getElementById("inputEditEmail");
  const phoneEditInput = document.getElementById("inputEditPhone");
  clearError(nameEditInput, "edit_field_alert_name");
  clearError(emailEditInput, "edit_field_alert_email");
  clearError(phoneEditInput, "edit_field_alert_phone");
}

/**
 * Validates a single input element against a regex pattern and optional max length,
 * displaying or clearing errors accordingly.
 * @function validateInput
 * @param {HTMLInputElement} input - The input element to validate.
 * @param {RegExp} regex - The regex pattern the input value must match.
 * @param {string} errorMsg - The error message to display if validation fails.
 * @param {string} errorId - The ID of the alert element for displaying the error message.
 * @param {number} [maxLength] - An optional maximum length for the input value.
 * @returns {boolean} `true` if the input is valid, otherwise `false`.
 */
function validateInput(input, regex, errorMsg, errorId, maxLength) {
  const valid = maxLength
    ? regex.test(input.value) && input.value.length <= maxLength
    : regex.test(input.value);
  if (!valid) {
    setError(input, errorMsg, errorId);
    // input.value = ""; // Habe diese Zeile entfernen, damit die Eingabe bestehen bleibt wie Herr Heller gesagt hat.
  } else {
    clearError(input, errorId);
  }
  return valid;
}


/**
 * Updates the close/cross icon image based on the current window width,
 * using a white icon below 1024px and a dark icon above 1024px.
 * @function updateCrossImage
 * @returns {void}
 */
function updateCrossImage() {
  const imgElements = document.querySelectorAll(".cross");
  imgElements.forEach((imgElement) => {
    if (window.innerWidth < 1024) {
      imgElement.src = "../assets/img/png/close-white.png";
    } else {
      imgElement.src = "../assets/img/png/close.png";
    }
  });
}

/**
 * Edits an existing contact with new data from the edit dialog form.
 * Handles both the active user (ID 0, color #ffffff) and normal contacts.
 * @async
 * @function editContact
 * @param {number} contactId - The unique identifier of the contact to edit.
 * @returns {Promise<void>}
 */
async function editContact(contactId) {
  const existingContact = await getContact(contactId);
  if (contactId === 0) {
    const activeUser = JSON.parse(localStorage.getItem("activeUser"));
    existingContact.id = activeUser.id;
  }
  const updatedContact = createUpdatedContact(existingContact);
  const endpoint =
    existingContact.color === "#ffffff"
      ? `users/${existingContact.id - 1}/`
      : `contacts/${existingContact.id - 1}/`;
  await postData(endpoint, updatedContact);
  closeDialogEdit();
  openDialogSuccessfully('edited');
  await renderContent();
  checkDisplayForInfo(existingContact);
}

/**
 * Adjusts the display state after editing a contact, closing the mobile info box if necessary,
 * or redisplaying the contact info in desktop view.
 * @function checkDisplayForInfo
 * @param {Object} existingContact - The contact object after editing.
 * @param {number} existingContact.id - The updated contact's ID.
 * @param {string} existingContact.color - The updated contact's color (indicates if it's the active user).
 * @returns {void}
 */
function checkDisplayForInfo(existingContact) {
  if (window.innerWidth <= 777) {
    const infoDiv = document.getElementById("mobile_contact_info");
    infoDiv.classList.add("d-none");
    infoDiv.classList.remove("pos-abs");
  } else {
    if (existingContact.color === "#ffffff") {
      existingContact.id = 0;
    }
    displayContactInfo(existingContact.id);
  }
}

/**
 * Creates a new contact object from the existing contact data and updated form fields.
 * @function createUpdatedContact
 * @param {Object} existingContact - The contact's original data object.
 * @returns {Object} A new contact data object with updated fields.
 */
function createUpdatedContact(existingContact) {
  const updatedName = document.getElementById("inputEditName").value;
  const updatedEmail = document.getElementById("inputEditEmail").value;
  const updatedPhone = document.getElementById("inputEditPhone").value;
  const updatedInitials = getInitials(updatedName);
  return {
    ...existingContact,
    name: updatedName,
    email: updatedEmail,
    phone: updatedPhone,
    initials: updatedInitials,
  };
}

/**
 * Sets up event listeners for updating the cross/close icon on page load and window resize.
 * @listens window:load
 * @listens window:resize
 */
window.addEventListener("load", updateCrossImage);
window.addEventListener("resize", updateCrossImage);
