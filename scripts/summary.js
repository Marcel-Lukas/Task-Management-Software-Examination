
document.addEventListener("DOMContentLoaded", () => {
  greeting();
});


function greeting() {
  let greeting = document.getElementById("greetings");
  let greetingMassage = getGreetingMessage();
  greeting.innerHTML = "";
  greeting.innerHTML = greetingHtml(greetingMassage);
}


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


function greetingHtml(greetingMassage) {
  return `${greetingMassage}, <div class="greeting-user">Guest</div>`;
}


function navigatonToBoard() {
  window.location.href = "../html/board.html";
}