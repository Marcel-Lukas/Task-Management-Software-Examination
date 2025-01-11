// async function fetchContacts() {
//     let response = await fetch('https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/');
//     let responseAsJson = await response.json();
//     console.log(responseAsJson);

// }


async function fetchContacts() {
  try {
    const response = await fetch('https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/contacts/.json');
    if (!response.ok) {
      throw new Error(`Fehler beim Laden der Kontakte: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

  } catch (error) {
    console.error('Fehler:', error);
  }
}

fetchContacts();
