import { bfs, astar, dijkstra, greedy, getPath } from "./algorithms";

const state = {
  // The chosen algorithm
  algorithm: "",
  board: [],
  /*
   * +1 indicates you are increasing weights
   * -1 indicates you are decreasing them
   */
  weightMode: 0,
  rows: 40,
  cols: 60,
  mouseIsPressed: false,
  // Keeps track of the start, target, and whether they are pressed
  endpoints: {
    start: { row: 13, col: 13 },
    target: { row: 13, col: 23 },
    startIsPressed: false,
    targetIsPressed: false,
  },
};

const mutations = {
  // Setters
  setAlgorithm(state, newValue) {
    state.algorithm = newValue;
  },
  setMouseIsPressed(state, newValue) {
    state.mouseIsPressed = newValue;
  },
  setIsVisualizationDone(state, newValue) {
    state.visualizationDone = newValue;
  },
  // Update square
  updateSquare(state, {row, col, ...updates }) {
    state.board[row][col] = Object.assign(state.board[row][col], updates)
  },
  // Update the endpoints state
  updateEndpoints(state, updates) {
    state.endpoints = Object.assign(state.endpoints, updates)
  },
  // Update number of columns to match screen width
  updateCols(state) {
    state.cols = Math.floor(window.innerWidth / 25);
  },
  // Change Weight Mode in this fashion -1 -> 0 -> 1 -> -1 ...
  updateWeightMode(state) {
    if (state.weightMode !== 1) {
      state.weightMode++;
    } else {
      state.weightMode = -1;
    }
  },
  // Update node weight depending on mode
  updateWeight(state, coordinates) {
    if (state.weightMode === 0) return;
    const { row, col } = coordinates;
    if (state.weightMode === 1 && state.board[row][col].weight < 100)
      state.board[row][col].weight++;
    else if (state.weightMode === -1 && state.board[row][col].weight > 1)
      state.board[row][col].weight--;
  },
  // Used to handle the update of the endpoints during mouse events
  updateStartOrTarget(state, { row, col, flag, value }) {
    if (state.board[row][col].isWall) return;
    const status = value === "start" ? "isStart" : "isTarget";

    if (!flag) {
      state.board[row][col][status] = false;
      return;
    }

    if (state.board[row][col][status]) return;
    state.board[row][col][status] = true;
    state.endpoints = Object.assign(
      state.endpoints,
      status === "isStart"
        ? {
            start: { row, col },
          }
        : {
            target: { row, col },
          }
    );
  },
  // Clear all animated squares from the board
  clearBoard(state) {
    for (const row of state.board) {
      for (let square of row) {
        square = Object.assign(square, {
          g: Infinity, // for A*
          f: Infinity, // for A*
          distance: Infinity, // for dijkstra, greedy and bfs
          makeVisible: false,
          isPath: false,
          isVisited: false,
          weight: 1,
          previousNode: null,
        });
      }
    }
    state.visualizationDone = false;
  },
  // Return board to original state (without changing endpoints)
  resetBoard(state) {
    state.board = [];
    for (let i = 0; i < state.rows; i++) {
      let currentRow = [];
      for (let j = 0; j < state.cols; j++) {
        currentRow.push({
          row: i,
          col: j,
          isWall: false,
          isPath: false,
          g: Infinity, // for A*
          f: Infinity, // for A*
          distance: Infinity, // for dijkstra, greedy and bfs
          makeVisible: false,
          isVisited: false,
          previousNode: null,
          weight: 1,
          isStart:
            i == state.endpoints.start.row && j == state.endpoints.start.col,
          isTarget:
            i == state.endpoints.target.row && j == state.endpoints.target.col,
        });
      }
      state.board.push(currentRow);
      state.visualizationDone = false;
    }
  },
  toggleIsWall(state, { row, col }) {
    const square = state.board[row][col];
    square.isWall = !square.isWall;
  },
};

const actions = {
  // Run the algorithm and start the visualization
  visualize({ commit, state }) {
    // Make sure board is cleared
    if (state.visualizationDone) commit("clearBoard");
    // Get start and target nodes
    const start =
      state.board[state.endpoints.start.row][state.endpoints.start.col];
    const target =
      state.board[state.endpoints.target.row][state.endpoints.target.col];

    // Run the algorithm
    let visited;
    if (state.algorithm === "dijkstra")
      visited = dijkstra(state.board, start, target);
    else if (state.algorithm === "astar")
      visited = astar(state.board, start, target);
    else if (state.algorithm === "greedy")
      visited = greedy(state.board, start, target);
    else if (state.algorithm === "bfs")
      visited = bfs(state.board, start, target);
    else return;

    // Animate
    const path = getPath(target);
    this.dispatch("animateVisited", { visited, path, start, target });
    commit("setIsVisualizationDone", true);
  },
  // Animate all nodes that were visited
  animateVisited({ state }, { visited, path: shortestPath, start, target }) {
    for (let i = 0; i <= visited.length; i++) {
      // If we reached the target
      if (i === visited.length) {
        if (shortestPath.length !== 1)
          setTimeout(() => {
            this.dispatch("animateShortestPath", shortestPath);
          }, 5 * i);
        return;
      }
      // Animate visited squares
      setTimeout(() => {
        const node = visited[i];
        if (node !== start && node !== target) {
          state.board[node.row][node.col].makeVisible = true;
        }
      }, 5 * i);
    }
  },
  //Animate the shortest path
  animateShortestPath({ state }, shortestPath) {
    for (let i = 0; i < shortestPath.length; i++) {
      setTimeout(() => {
        const node = shortestPath[i];
        state.board[node.row][node.col].isPath = true;
        state.board[node.row][node.col].makeVisible = false;
      }, 20 * i);
    }
  },
};

const getters = {};

export default {
  state,
  mutations,
  actions,
  getters,
};
