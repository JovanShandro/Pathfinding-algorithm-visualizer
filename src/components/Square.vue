<template>
  <div
    :class="{
     'square': true,
     'start': square.isStart , 
     'target': square.isTarget, 
     'visited': square.isVisited && square.makeVisible, 
     'wall': square.isWall, 
     'path': square.isPath}"
    @click="clicked"
    @mousedown="onMouseDown"
    @mouseenter="onMouseEnter"
    @mouseup="onMouseUp"
    @mouseout="onMouseOut"
    :style="{'color': ( !weighted) ? 'transparent' : ''}"
  >{{ (square.weight)}}</div>
</template>

<script>
export default {
  props: {
    square: Object,
    choice: String
  },
  data() {
    return {
      coordinates: { row: this.square.row, col: this.square.col },
      weighted: this.choice === "dijkstra"
    };
  },
  methods: {
    onMouseUp() {
      this.$emit("mouse-up", this.coordinates);
    },
    onMouseOut() {
      this.$emit("mouse-out", this.coordinates);
    },
    onMouseEnter() {
      this.$emit("mouse-enter", this.coordinates);
    },
    onMouseDown() {
      this.$emit("mouse-down", this.coordinates);
    },
    clicked() {
      this.$emit("add-weight", this.coordinates);
    }
  },
  watch: {
    choice: {
      immediate: true,
      handler(val, oldVal) {
        this.weighted = val === "dijkstra";
      }
    }
  }
};
</script>
