function toggleActive(clickedElement) {
    let prioButtons = document.querySelectorAll('.prioButton');
    let isActive = clickedElement.classList.contains('active');
    prioButtons.forEach((button) => {
        button.classList.remove('active');
    });
    if (!isActive) {
        clickedElement.classList.add('active');
    }
}

  function showPicker() {
    document.getElementById('dateIcon');
    let dateInput = document.getElementById('dateInput');
    if (dateInput) {
        dateInput.showPicker();
    }
  }