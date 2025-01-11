async function updateTasksOnBoard() {
  cleanBoard();
  await renderTasksInStatusArea();
}