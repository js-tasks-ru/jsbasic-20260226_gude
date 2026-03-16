function getMinMax(str) {
  let items = str.split(' ');
  let numbers = items.filter((item) => !isNaN(Number(item))).map((item) => Number(item));
  let min = Math.min(...numbers);
  let max = Math.max(...numbers);

  return { min, max };
}
