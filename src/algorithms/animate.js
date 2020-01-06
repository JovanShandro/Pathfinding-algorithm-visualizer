import { bus } from "../events/eventbus";
/*
  Animate all visited Squares in order
*/

export function animateVisited(visited, shortestPath, start, target) {
  for (let i = 0; i <= visited.length; i++) {
    // If we reached the target
    if (i === visited.length) {
      if (shortestPath.length !== 1)
        setTimeout(() => {
          animateShortestPath(shortestPath);
        }, 10 * i);
      return;
    }
    // Animate visited squares
    setTimeout(() => {
      const node = visited[i];
      if (node !== start && node !== target) {
        bus.$emit("make-visible", node.row, node.col);
      }
    }, 10 * i);
  }
}

/*
  Animate the shortest path
*/
export function animateShortestPath(shortestPath) {
  for (let i = 0; i < shortestPath.length; i++) {
    setTimeout(() => {
      const node = shortestPath[i];
      bus.$emit("show-path", node.row, node.col);
    }, 50 * i);
  }
}

/*
  Get shortest path from start node to target
*/
export function getPath(target) {
  const path = [];
  for (let current = target; current; current = current.previousNode)
    path.unshift(current);

  return path;
}
