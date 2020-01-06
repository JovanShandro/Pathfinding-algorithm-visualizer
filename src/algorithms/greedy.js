const R = require("ramda");

/*
    Return visited squares in order
    The alg is similar to A*, 
    only diff is that f is given
    by the direct distance between 
    current square to target. It is fast,
    but optional result not guaranteed
*/

export function greedy(board, start, target) {
  // Initialization
  let open = [];
  const closed = [];
  const h = directDist(target);

  start.f = h(start);
  open.push(start);
  // Main Loop
  while (open.length) {
    // Sort unvisited square by f
    open = R.sort(R.ascend(R.prop("f")), open);
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
    if (row > 0) s.push(R.path([row - 1, col], board));
    // West
    if (col > 0) s.push(R.path([row, col - 1], board));
    // South
    if (row < board.length - 1) s.push(R.path([row + 1, col], board));
    // East
    if (col < board[0].length - 1) s.push(R.path([row, col + 1], board));
    // Iterate over s
    for (const v_next of s) {
      if (v_next.isWall) continue;
      if (closed.indexOf(v_next) === -1) {
        v_next.previousNode = v_visit;
        v_next.f = h(v_next);
        // if v_next not in open
        if (!R.contains(v_next, open)) {
          open.push(v_next);
        }
      }
    }
  }
  return closed;
}

const directDist = a => b => {
  return Math.hypot(Math.abs(a.row - b.row), Math.abs(a.col - b.col));
};
