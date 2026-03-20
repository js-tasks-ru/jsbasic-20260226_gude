function makeDiagonalRed(table) {
  const rows = table.rows;
  for (let i = 0; i < rows.length; i++) {
    let cell = rows[i].cells[i];
    if (cell) cell.style.backgroundColor = 'red';
  }
}
