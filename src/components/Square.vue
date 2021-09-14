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
    choice: String,
  },
  data() {
    return {
      coordinates: { row: this.square.row, col: this.square.col },
      weighted: this.choice === "dijkstra",
    };
  },
  computed: {
    ...mapState(["visualizationDone", "weightMode", "mouseIsPressed"]),
  },
  methods: {
    ...mapMutations([
      "updateWeight",
      "setMouseIsPressed",
      "onMouseDownHandler",
      "onMouseUpHandler",
    ]),
    ...mapActions(["onMouseOutHandler", "onMouseEnterHandler"]),
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
    clicked() {
      this.updateWeight(this.coordinates);
    },
  },
  watch: {
    choice: {
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
