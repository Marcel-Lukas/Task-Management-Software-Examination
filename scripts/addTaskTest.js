function dropDown() {
    document.getElementById("dropMenu").classList.toggle("show");
  }
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      let dropdowns = document.getElementsByClassName("dropdownContent");
      let i;
      for (i = 0; i < dropdowns.length; i++) {
        let openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }

  function selectPriority(element) {
    const boxes = document.querySelectorAll('.prioBox');
    boxes.forEach(box => box.classList.remove('active'));
    element.classList.add('active');
  }
