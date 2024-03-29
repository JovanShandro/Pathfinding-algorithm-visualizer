/*
  Returns the squares in the order they were visited by Dijkstra's algorithm
  !! An array is used instead of a min priority queue
*/
export function dijkstra(board, start, target) {
  // Initialization
  const visited = [];
  let unvisited = [];
  start.distance = 0;

  for (const row of board) {
    for (const square of row) {
      unvisited.push(square);
    }
  }

  while (unvisited.length) {
    // Sort unvisited square by distance
    unvisited.sort((a, b) => a.distance - b.distance);
    // Get the closest square
    const current = unvisited.shift();
    // If wall skip
    if (current.isWall) continue;
    // If no path exists
    else if (current.distance === Infinity) return visited;
    // update current and visited
    current.isVisited = true;
    visited.push(current);
    // If target reached
    if (current === target) return visited;
    // change the 4-neighborhood of current
    let neighbors = [];
    const { col, row } = current;
    // North
    if (row > 0) neighbors.push(board[row - 1][col]);
    // West
    if (col > 0) neighbors.push(board[row][col - 1]);
    // South
    if (row < board.length - 1) neighbors.push(board[row + 1][col]);
    // East
    if (col < board[0].length - 1) neighbors.push(board[row][col + 1]);
    // Get only unvisited neighbors
    neighbors = neighbors.filter((neighbor) => !neighbor.isVisited);

    // update neighbors
    for (const neighbor of neighbors) {
      neighbor.distance = current.distance + neighbor.weight;
      neighbor.previousNode = current;
    }
  }
}
