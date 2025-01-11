async function fetchContacts() {
    let response = await fetch('https://join-marcel-lukas-default-rtdb.europe-west1.firebasedatabase.app/');
    let responseAsJson = await response.json();
    console.log(responseAsJson);
    
}