function openInput() {
    let searchField = document.querySelector('.searchField');
    let inputField = document.getElementById('findTask');
    searchField.classList.add('focus');
    inputField.focus();
    inputField.addEventListener('blur', () => {
        searchField.classList.remove('focus');
    });
}