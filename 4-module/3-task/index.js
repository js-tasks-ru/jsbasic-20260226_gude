function highlight(table) {
  const rows = table.querySelectorAll('tbody tr');
  for (const row of rows) {
    const [nameCell, ageCell, genderCell, statusCell] = row.cells;
    
    if (statusCell) {
      const value = statusCell.dataset.available;
      if (value === undefined) {
        row.hidden = true;
      } else {
        row.classList.add(value === 'true' ? 'available' : 'unavailable');
      }
    }

    if (genderCell) {
      const gender = genderCell.textContent.trim();
      if (gender === 'm') row.classList.add('male');
      if (gender === 'f') row.classList.add('female');
    }

    if (ageCell) {
      const age = Number(ageCell.textContent);
      if (age < 18) row.style.textDecoration = 'line-through';
    }
  }
}