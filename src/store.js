import { bfs } from "./algorithms/bfs";
import { astar } from "./algorithms/astar";
import { greedy } from "./algorithms/greedy";
import { dijkstra } from "./algorithms/dijkstra";
import { getPath } from "./algorithms/animate";

const state = {
  board: [],
  weightMode: 0,
  rows: 40,
  cols: 60,
  mouseIsPressed: false,
  endpoints: {
    start: { row: 13, col: 13 },
    target: { row: 13, col: 23 },
    startIsPressed: false,
    targetIsPressed: false,
  },
};

const mutations = {
  updateCols(state) {
    state.cols = Math.floor(window.innerWidth / 25);
  },
  setMouseIsPressed(state, newValue) {
    state.mouseIsPressed = newValue;
  },
  setIsVisualizationDone(state, newValue) {
    state.visualizationDone = newValue;
  },
  updateWeightMode(state) {
    if (state.weightMode !== 1) {
      state.weightMode++;
    } else {
      state.weightMode = -1;
    }
  },
  updateWeight(state, coordinates) {
    if (state.weightMode === 0) return;
    const { row, col } = coordinates;
    if (state.weightMode === 1 && state.board[row][col].weight < 100)
      state.board[row][col].weight++;
    else if (state.weightMode === -1 && state.board[row][col].weight > 1)
      state.board[row][col].weight--;
  },

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

  ctrlEvent(state, { i, j, flag, value }) {
    if (state.board[i][j].isWall) {
      return;
    }

    if (flag) {
      if (value === "start") {
        if (state.board[i][j].isTarget) return;
        state.board[i][j].isStart = true;
        state.endpoints = Object.assign(state.endpoints, {
          start: { row: i, col: j },
        });
      } else if (value === "target") {
        if (state.board[i][j].isStart) return;

        state.board[i][j].isTarget = true;
        state.endpoints = Object.assign(state.endpoints, {
          target: { row: i, col: j },
        });
      }
    } else {
      if (value === "start") state.board[i][j].isStart = false;
      else if (value === "target") state.board[i][j].isTarget = false;
    }
  },

  onMouseDownHandler(state, coordinates) {
    const { row, col } = coordinates;
    if (
      row === state.endpoints.start.row &&
      col === state.endpoints.start.col
    ) {
      state.endpoints.startIsPressed = true;
      return;
    }
    if (
      row === state.endpoints.target.row &&
      col === state.endpoints.target.col
    ) {
      state.endpoints.targetIsPressed = true;
      return;
    }
    state.board[row][col].isWall = !state.board[row][col].isWall;
  },

  onMouseUpHandler(state, coordinates) {
    let newSquare;
    // Search for empty square
    const flag = state.endpoints.startIsPressed;

    search: for (
      let i = flag ? 0 : state.rows - 1;
      flag ? i < state.rows : i >= 0;
      flag ? i++ : i--
    ) {
      for (
        let j = flag ? 0 : state.cols - 1;
        flag ? j < state.cols : j >= 0;
        flag ? j++ : j--
      ) {
        if (!state.board[i][j].isWall) {
          newSquare = state.board[i][j];
          break search;
        }
      }
    }

    const { row, col } = coordinates;
    // start
    const { startIsPressed, targetIsPressed } = state.endpoints;
    if (startIsPressed || targetIsPressed) {
      if (
        state.board[row][col].isWall ||
        state.board[row][col][startIsPressed ? "isTarget" : "isStart"]
      ) {
        const { row: r, col: c } = newSquare;

        state.endpoints[startIsPressed ? "start" : "target"].row = r;
        state.endpoints[startIsPressed ? "start" : "target"].col = c;

        if (startIsPressed) state.board[r][c].isStart = true;
        else state.board[r][c].isTarget = true;
      }
    }
    state.endpoints.startIsPressed = false;
    state.endpoints.targetIsPressed = false;
  },
  toggleIsWall(state, { i, j }) {
    const square = state.board[i][j];
    square.isWall = !square.isWall;
  },
};

const actions = {
  onMouseEnterHandler({ commit, state }, coordinates) {
    const { row, col } = coordinates;
    if (state.endpoints.startIsPressed) {
      commit("ctrlEvent", { i: row, j: col, flag: 1, value: "start" });
      return;
    } else if (state.endpoints.targetIsPressed) {
      commit("ctrlEvent", { i: row, j: col, flag: 1, value: "target" });
      return;
    }

    if (
      (row === state.endpoints.start.row &&
        col === state.endpoints.start.col) ||
      (row === state.endpoints.target.row && col === state.endpoints.target.col)
    )
      return;
    state.board[row][col].isWall = !state.board[row][col].isWall;
  },
  onMouseOutHandler({ commit, state }, coordinates) {
    const { row, col } = coordinates;
    if (state.endpoints.startIsPressed) {
      commit("ctrlEvent", { i: row, j: col, flag: 0, value: "start" });
    } else if (state.endpoints.targetIsPressed) {
      commit("ctrlEvent", { i: row, j: col, flag: 0, value: "target" });
    }
  },

  visualize({ commit, state }, choice) {
    if (state.visualizationDone) commit("clearBoard");
    const start =
      state.board[state.endpoints.start.row][state.endpoints.start.col];
    const target =
      state.board[state.endpoints.target.row][state.endpoints.target.col];

    // Run the algorithm
    let visited;
    if (choice === "dijkstra") visited = dijkstra(state.board, start, target);
    else if (choice === "astar") visited = astar(state.board, start, target);
    else if (choice === "greedy") visited = greedy(state.board, start, target);
    else if (choice === "bfs") visited = bfs(state.board, start, target);
    else return;

    // Animate
    const path = getPath(target);
    this.dispatch("animateVisited", { visited, path, start, target });
    commit("setIsVisualizationDone", true);
  },
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

  /*
  Animate the shortest path
*/
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
