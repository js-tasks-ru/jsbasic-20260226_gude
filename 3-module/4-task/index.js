function showSalary(users, age) {
  let usersFiltered = users.filter((user) => user.age <= age);
  let result = usersFiltered.map((user) => `${user.name}, ${user.balance}`).join('\n');

  return result;
}
