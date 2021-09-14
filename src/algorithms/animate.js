/*
  Get shortest path from start node to target
*/
export function getPath(target) {
  const path = [];
  for (let current = target; current; current = current.previousNode)
    path.unshift(current);

  return path;
}
