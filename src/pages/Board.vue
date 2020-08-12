<template>
  <div @dragstart="prevent" @dragover="prevent">
    <nav>
      <h3>Enjoy playing with the Board</h3>
      <span>
        <select v-model="choice">
          <option disabled value>Choose the Algorithm</option>
          <option value="dijkstra">Dijkstra</option>
          <option value="astar">A*</option>
          <option value="greedy">Greedy Best-First</option>
          <option value="bfs">BFS</option>
        </select>

        <button @click="visualize">Visualize</button>
        <button @click="resetBoard">Reset</button>
        <button @click="clearBoard">Clear</button>
        <button
          @click="ctrlWeightMode"
          :class="{ add: weightMode == 1, sub: weightMode == -1 }"
        >
          weights
        </button>
      </span>
    </nav>

    <div class="u-mr-auto" :style="{ width: 25 * cols + 'px' }">
      <div v-for="row in rows" class="boardRow" :key="row">
        <Square
          v-for="col in cols"
          :key="col"
          :square="R.path([row - 1, col - 1], board)"
          :id="'square-' + (row - 1) + '-' + (col - 1)"
          :choice="choice"
          @add-weight="changeWeight"
          @mouse-down="handleMouseDown"
          @mouse-up="handleMouseUp"
          @mouse-out="handleMouseOut"
          @mouse-enter="handleMouseEnter"
        />
      </div>
    </div>
  </div>
</template>

<script>
import * as R from "ramda";
import Square from "../components/Square.vue";
import { bus } from "../events/eventbus";
import { bfs } from "../algorithms/bfs";
import { astar } from "../algorithms/astar";
import { greedy } from "../algorithms/greedy";
import { dijkstra } from "../algorithms/dijkstra";
import { animateVisited, getPath } from "../algorithms/animate";
import {
  onMouseEnter,
  onMouseOut,
  onMouseDown,
  onMouseUp
} from "../events/mouseEvents";

export default {
  components: {
    Square
  },
  data() {
    return {
      R,
      choice: "",
      board: [],
      rows: 40,
      cols: 60,
      mouseIsPressed: false,
      endpoints: {
        start: { row: 13, col: 13 },
        target: { row: 13, col: 23 },
        startIsPressed: false,
        targetIsPressed: false
      },
      weightMode: 0,
      visualizationDone: false
    };
  },
  methods: {
    // To not allow the board to be dragged
    prevent(event) {
      event.preventDefault();
    },

    ctrlWeightMode() {
      if (this.weightMode !== 1) {
        this.weightMode++;
      } else {
        this.weightMode = -1;
      }
    },

    changeWeight(coordinates) {
      if (this.weightMode === 0) return;
      const { row, col } = coordinates;
      if (this.weightMode === 1 && this.board[row][col].weight < 100)
        this.board[row][col].weight++;
      else if (this.weightMode === -1 && this.board[row][col].weight > 1)
        this.board[row][col].weight--;
    },

    handleMouseDown(coordinates) {
      if (this.visualizationDone || this.weightMode) return;
      onMouseDown(coordinates, this.board, this.endpoints);
      this.mouseIsPressed = true;
    },

    handleMouseEnter(coordinates) {
      if (this.visualizationDone || !this.mouseIsPressed) return;
      onMouseEnter(coordinates, this.board, this.endpoints);
    },

    handleMouseOut(coordinates) {
      onMouseOut(coordinates, this.endpoints);
    },

    handleMouseUp(coordinates) {
      if (this.visualizationDone) return;
      const newSquare = this.searchEmptySquare(this.endpoints.startIsPressed);
      onMouseUp(coordinates, this.board, this.endpoints, newSquare);
      this.mouseIsPressed = false;
    },

    searchEmptySquare(flag) {
      for (
        let i = flag ? 0 : this.rows - 1;
        flag ? i < this.rows : i >= 0;
        flag ? i++ : i--
      ) {
        for (
          let j = flag ? 0 : this.cols - 1;
          flag ? j < this.cols : j >= 0;
          flag ? j++ : j--
        ) {
          if (!this.board[i][j].isWall) {
            return this.board[i][j];
          }
        }
      }
    },

    visualize() {
      if (this.visualizationDone) this.clearBoard();
      const start = this.board[R.path(["start", "row"], this.endpoints)][
        R.path(["start", "col"], this.endpoints)
      ];
      const target = this.board[R.path(["target", "row"], this.endpoints)][
        R.path(["target", "col"], this.endpoints)
      ];

      // Run the algorithm
      let visited;
      if (this.choice === "dijkstra")
        visited = dijkstra(this.board, start, target);
      else if (this.choice === "astar")
        visited = astar(this.board, start, target);
      else if (this.choice === "greedy")
        visited = greedy(this.board, start, target);
      else if (this.choice === "bfs") visited = bfs(this.board, start, target);
      else return;

      // Animate
      const path = getPath(target);
      animateVisited(visited, path, start, target);
      this.visualizationDone = true;
    },

    clearBoard() {
      for (const row of this.board) {
        for (let square of row) {
          square = Object.assign(square, {
            g: Infinity, // for A*
            f: Infinity, // for A*
            distance: Infinity, // for dijkstra, greedy and bfs
            makeVisible: false,
            isPath: false,
            isVisited: false,
            weight: 1,
            previousNode: null
          });
        }
      }
      this.visualizationDone = false;
    },

    resetBoard() {
      this.board = [];
      for (let i = 0; i < this.rows; i++) {
        let currentRow = [];
        for (let j = 0; j < this.cols; j++) {
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
              i == R.path(["start", "row"], this.endpoints) &&
              j == R.path(["start", "col"], this.endpoints),
            isTarget:
              i == R.path(["target", "row"], this.endpoints) &&
              j == R.path(["target", "col"], this.endpoints)
          });
        }
        this.board.push(currentRow);
        this.visualizationDone = false;
      }
    }
  },

  created() {
    this.cols = Math.floor(window.innerWidth / 25);
    this.resetBoard();

    // Event to show changes in board
    bus.$on("make-visible", (i, j) => {
      this.board[i][j].makeVisible = true;
    });

    // Event to show the shortest path
    bus.$on("show-path", (i, j) => {
      this.board[i][j].isPath = true;
      this.board[i][j].makeVisible = false;
    });

    // Event to control the start and target squares
    bus.$on("ctrl", (i, j, flag, value) => {
      if (this.board[i][j].isWall) {
        return;
      }

      if (flag) {
        if (value === "start") {
          if (this.board[i][j].isTarget) return;
          this.board[i][j].isStart = true;
          this.endpoints = R.merge(this.endpoints, {
            start: { row: i, col: j }
          });
        } else if (value === "target") {
          if (this.board[i][j].isStart) return;

          this.board[i][j].isTarget = true;
          this.endpoints = R.merge(this.endpoints, {
            target: { row: i, col: j }
          });
        }
      } else {
        if (value === "start") this.board[i][j].isStart = false;
        else if (value === "target") this.board[i][j].isTarget = false;
      }
    });
  }
};
</script>
