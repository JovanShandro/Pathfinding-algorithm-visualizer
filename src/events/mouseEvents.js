import { bus } from "./eventbus";

export function onMouseEnter(coordinates, board, endpoints) {
  const { row, col } = coordinates;
  if (endpoints.startIsPressed) {
    bus.$emit("ctrl", row, col, 1, "start");
    return;
  } else if (endpoints.targetIsPressed) {
    bus.$emit("ctrl", row, col, 1, "target");
    return;
  }

  if (
    (row === endpoints.start.row && col === endpoints.start.col) ||
    (row === endpoints.target.row && col === endpoints.target.col)
  )
    return;
  const square = board[row][col];
  square.isWall = !square.isWall;
}

export function onMouseOut(coordinates, endpoints) {
  const { row, col } = coordinates;
  if (endpoints.startIsPressed) {
    bus.$emit("ctrl", row, col, 0, "start");
  } else if (endpoints.targetIsPressed) {
    bus.$emit("ctrl", row, col, 0, "target");
  }
}

export function onMouseDown(coordinates, board, endpoints) {
  const { row, col } = coordinates;
  if (row === endpoints.start.row && col === endpoints.start.col) {
    endpoints.startIsPressed = true;
    return;
  }
  if (row === endpoints.target.row && col === endpoints.target.col) {
    endpoints.targetIsPressed = true;
    return;
  }
  const square = board[row][col];
  square.isWall = !square.isWall;
}

export function onMouseUp(coordinates, board, endpoints, newSquare) {
  const { row, col } = coordinates;
  // start
  const { startIsPressed, targetIsPressed } = endpoints;
  if (startIsPressed || targetIsPressed) {
    if (
      board[row][col].isWall ||
      board[row][col][startIsPressed ? "isTarget" : "isStart"]
    ) {
      const { row: r, col: c } = newSquare;

      endpoints[startIsPressed ? "start" : "target"].row = r;
      endpoints[startIsPressed ? "start" : "target"].col = c;

      if (startIsPressed) board[r][c].isStart = true;
      else board[r][c].isTarget = true;
    }
  }
  endpoints.startIsPressed = false;
  endpoints.targetIsPressed = false;
}
