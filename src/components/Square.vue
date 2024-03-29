<template>
  <div
    :class="{
      square: true,
      start: square.isStart,
      target: square.isTarget,
      visited: square.isVisited && square.makeVisible,
      wall: square.isWall,
      path: square.isPath,
    }"
    @click="clicked"
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseup="onMouseUp"
    @mouseout="onMouseOut"
    :style="{ color: !weighted ? 'transparent' : '' }"
  >
    {{ square.weight }}
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  props: {
    square: Object,
  },
  data() {
    return {
      coordinates: { row: this.square.row, col: this.square.col },
      weighted: this.algorithm === "dijkstra",
    };
  },
  computed: {
    ...mapState([
      "visualizationDone",
      "algorithm",
      "weightMode",
      "mouseIsPressed",
      "endpoints",
      "rows",
      "cols",
      "board",
    ]),
  },
  methods: {
    ...mapMutations([
      "updateWeight",
      "setMouseIsPressed",
      "updateEndpoints",
      "updateSquare",
      "updateStartOrTarget",
      "toggleIsWall",
    ]),
    clicked() {
      this.updateWeight(this.coordinates);
    },
    onMouseUp() {
      if (this.visualizationDone) return;
      this.onMouseUpHandler(this.coordinates);
      this.setMouseIsPressed(false);
    },
    onMouseOut() {
      this.onMouseOutHandler(this.coordinates);
    },
    onMouseEnter() {
      if (this.visualizationDone || !this.mouseIsPressed) return;
      this.onMouseEnterHandler(this.coordinates);
    },
    onMouseDown() {
      if (this.visualizationDone || this.weightMode) return;
      this.onMouseDownHandler(this.coordinates);
      this.setMouseIsPressed(true);
    },
    onMouseDownHandler() {
      const { row, col } = this.coordinates;
      const { start, target } = this.endpoints;
      if (row === start.row && col === start.col) {
        this.updateEndpoints({ startIsPressed: true });
      } else if (row === target.row && col === target.col) {
        this.endpoints.targetIsPressed = true;
      } else this.toggleIsWall({ row, col });
    },
    onMouseUpHandler() {
      let newSquare;
      // Search for next empty square if mouse released in wall
      const flag = this.endpoints.startIsPressed;

      search: for (
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
            newSquare = this.board[i][j];
            break search;
          }
        }
      }

      // Update the endpoints in case one of them was moved
      const { row, col } = this.coordinates;
      const { startIsPressed, targetIsPressed } = this.endpoints;
      if (startIsPressed || targetIsPressed) {
        if (
          this.board[row][col].isWall ||
          this.board[row][col][startIsPressed ? "isTarget" : "isStart"]
        ) {
          const { row: newRow, col: newCol } = newSquare;

          this.updateEndpoints({
            [startIsPressed ? "start" : "target"]: {
              row: newRow,
              col: newCol,
            },
          });
          this.updateSquare({
            row: newRow,
            col: newCol,
            [startIsPressed ? "isStart" : "isTarget"]: true,
          });
        }
      }
      this.updateEndpoints({
        startIsPressed: false,
        targetIsPressed: false,
      });
    },
    onMouseEnterHandler() {
      const { row, col } = this.coordinates;
      const { startIsPressed, targetIsPressed, start, target } = this.endpoints;

      if (startIsPressed) {
        this.updateStartOrTarget({ row, col, flag: 1, value: "start" });
        return;
      }

      if (targetIsPressed) {
        this.updateStartOrTarget({ row, col, flag: 1, value: "target" });
        return;
      }

      if (
        (row === start.row && col === start.col) ||
        (row === target.row && col === target.col)
      )
        return;
      this.toggleIsWall({ row, col });
    },
    onMouseOutHandler() {
      const { row, col } = this.coordinates;
      const { startIsPressed, targetIsPressed } = this.endpoints;

      if (startIsPressed)
        this.updateStartOrTarget({ row, col, flag: 0, value: "start" });
      if (targetIsPressed)
        this.updateStartOrTarget({ row, col, flag: 0, value: "target" });
    },
  },
  watch: {
    algorithm: {
      immediate: true,
      handler(val, oldVal) {
        this.weighted = val === "dijkstra";
      },
    },
  },
};
</script>

<style>
.square {
  display: inline-block;
  width: 25px;
  height: 25px;
  border: 1px solid var(--square-border);
  padding-top: 11px;
  margin: 0;
  font-size: 14px;
  counter-reset: steelblue;
  text-align: center;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

.target .start .wall .path .visited {
  color: transparent;
}

.start,
.target {
  position: relative;
}

.start::after,
.target::after {
  content: "";
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  transform: scale(0.9);
}

.start::after {
  background: radial-gradient(circle at 50% 50%, var(--main-start-color), #000);
}

.target::after {
  background: radial-gradient(
    circle at 50% 50%,
    var(--main-target-color),
    #000
  );
}

.wall {
  background-color: var(--wall-color);
}

.path {
  animation-name: shortestPath;
  animation-duration: 1.5s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}

.visited {
  animation-name: visitedAnimation;
  animation-duration: 2s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: alternate;
  animation-iteration-count: 1;
  animation-fill-mode: forwards;
  animation-play-state: running;
}
</style>
