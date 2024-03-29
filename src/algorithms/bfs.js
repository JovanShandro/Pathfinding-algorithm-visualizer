export function bfs(board, start, target) {
  const queue = [];
  const visited = [];
  queue.push(start);
  visited.push(start);
  start.distance = 0;

  while (queue.length) {
    const u = queue.shift();
    if (u === target) break;
    for (const v of adj(u, board)) {
      if (v.isWall) continue;
      if (v.distance === Infinity) {
        v.distance = u.distance + 1;
        v.previousNode = u;
        queue.push(v);
        if (v === target) {
          visited.push(v);
          return visited;
        }
      }
      visited.push(v);
      v.isVisited = true;
    }
  }
  return visited;
}

const adj = (u, board) => {
  const { row, col } = u;
  const adjacent = [];
  if (row > 0) adjacent.push(board[row - 1][col]);
  // West
  if (col > 0) adjacent.push(board[row][col - 1]);
  // South
  if (row < board.length - 1) adjacent.push(board[row + 1][col]);
  // East
  if (col < board[0].length - 1) adjacent.push(board[row][col + 1]);
  return adjacent;
};
