function makeFriendsList(friends) {
  const friendsUL = document.createElement('ul');

  for (let friend of friends) {
    const li = document.createElement('li');
    li.textContent = `${friend.firstName} ${friend.lastName}`;
    friendsUL.append(li);
  }
  return friendsUL;
}
