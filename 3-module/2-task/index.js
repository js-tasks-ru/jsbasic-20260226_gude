function filterRange(arr, a, b) {
  const low = Math.min(a, b);
  const high = Math.max(a, b);
  return arr.filter(item => item >= low && item <= high);
}
