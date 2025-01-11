// async function fetchContacts() {
//     let response = await fetch('https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/');
//     let responseAsJson = await response.json();
//     console.log(responseAsJson);

// }



async function fetchContacts() {
  try {
    let response = await fetch(`https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/contacts/.json`);
    let text = await response.text(); // Rohdaten als Text
    console.log("Rohe Antwort:", text);

    let datas = JSON.parse(text);
    console.log(datas);

  } catch (error) {
    console.error("Fehler:", error);
  }
}

fetchContacts();

