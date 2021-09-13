/*
    Return visited squares in order
*/
export function astar(board, start, target) {
  // Initialization
  let open = [];
  const closed = [];
  const h = manhattanDist(target);

  start.g = 0;
  start.f = h(start);
  open.push(start);

  // Main Loop
  while (open.length) {
    // Sort unvisited square by f
    open.sort((a, b) => a.f-b.f)
    // Visit the closest square
    const v_visit = open.shift();
    if (v_visit.isWall) continue;
    // Add square to visited
    closed.push(v_visit);
    v_visit.isVisited = true;
    // Stop in target reached
    if (v_visit === target) {
      return closed;
    }
    // Generate all successors of v_visit
    const s = [];
    const { row, col } = v_visit;
    // North
    if (row > 0) s.push(board[row - 1][col]);
    // West
    if (col > 0) s.push(board[row][col - 1]);
    // South
    if (row < board.length - 1) s.push(board[row + 1][col]);
    // East
    if (col < board[0].length - 1) s.push(board[row][col + 1]);

    // Iterate over s
    for (const v_next of s) {
      if (v_next.isWall) continue;
      if (closed.indexOf(v_next) === -1) {
        // Get new g
        const tmp = v_visit.g + 1;
        if (tmp < v_next.g) {
          v_next.previousNode = v_visit;
          v_next.g = tmp;
          v_next.f = v_next.g + h(v_next);
          // if v_next not in open
          if (!open.includes(v_next)) {
            open.push(v_next);
          }
        }
      }
    }
  }

  return closed;
}

const manhattanDist = (a) => (b) => {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
};
