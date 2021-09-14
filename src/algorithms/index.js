export * from "./greedy";
export * from "./bfs";
export * from "./astar";
export * from "./dijkstra";

/*
  Get the path that leads to the target node
*/
export function getPath(target) {
  const path = [];
  for (let current = target; current; current = current.previousNode)
    path.unshift(current);
  return path;
}
