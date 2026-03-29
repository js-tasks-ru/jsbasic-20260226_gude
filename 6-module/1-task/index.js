export default class UserTable {
  constructor(rows) {
    this.elem = document.createElement('table');

    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    const headers = ['Имя', 'Возраст', 'Зарплата', 'Город', ''];
    const columns = ['name', 'age', 'salary', 'city'];
    
    for (const headerText of headers) {
      const th = document.createElement('th');
      th.textContent = headerText;
      headerRow.appendChild(th);
    }
    thead.appendChild(headerRow);
    this.elem.appendChild(thead);

    const tbody = document.createElement('tbody');

    tbody.addEventListener('click', (event) => {
      const button = event.target.closest('button[data-action="remove"]');
      if (!button || !tbody.contains(button)) return;

      const row = button.closest('tr');
      if (row) row.remove();
    });

    for (const person of rows) {
      const row = document.createElement('tr');

      for (const column of columns) {
        const cell = document.createElement('td');
        cell.textContent = person[column];
        row.appendChild(cell);
      }

      const buttonCell = document.createElement('td');
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.dataset.action = 'remove';
      buttonCell.appendChild(deleteButton);
      row.appendChild(buttonCell);
      tbody.appendChild(row);
    }
    this.elem.appendChild(tbody);
  }
}
