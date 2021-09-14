<template>
  <nav ref="nav">
    <h3>Enjoy playing with the Board</h3>
    <span>
      <select v-model="algorithmChoice">
        <option disabled value>Choose the Algorithm</option>
        <option value="dijkstra">Dijkstra</option>
        <option value="astar">A*</option>
        <option value="greedy">Greedy Best-First</option>
        <option value="bfs">BFS</option>
      </select>

      <button @click="visualize"><i class="fas fa-play"></i></button>
      <button @click="resetBoard"><i class="fas fa-redo-alt"></i></button>
      <button @click="clearBoard"><i class="fas fa-eraser"></i></button>
      <button
        v-if="algorithmChoice === 'dijkstra'"
        @click="updateWeightMode"
        :class="{ add: weightMode == 1, sub: weightMode == -1 }"
      >
        <i class="fas fa-weight-hanging"></i>
      </button>
    </span>
  </nav>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
  data() {
    return {
      isOpen: true,
    };
  },
  computed: {
    ...mapState(["weightMode", "algorithm"]),
    algorithmChoice: {
      get() {
        return this.algorithm;
      },
      set(value) {
        this.setAlgorithm(value);
      },
    },
  },
  methods: {
    ...mapMutations([
      "updateWeightMode",
      "clearBoard",
      "resetBoard",
      "setAlgorithm",
    ]),
    ...mapActions(["visualize"]),
  },
};
</script>

<style scoped>
nav {
  min-width: 700px;
  border-radius: 25px;
  background-color: black;
  position: fixed;
  color: white;
  margin: 0 auto;
  top: 30px;
  left: 50%;
  transform: translateX(-50%);
  padding: 0 10px;
  z-index: 1;
}

.add {
  color: lightgreen !important;
}

.sub {
  color: rgb(228, 164, 164) !important;
}

span {
  float: right;
}

select {
  text-shadow: 0 0 0 #000;
  text-align: right;
  text-align-last: right;
  width: 180px;
}

select:active,
select:focus {
  text-shadow: 0 0 0 #000;
}

option {
  background-color: black;
  text-transform: capitalize;
  color: white;
  margin-top: 5px;
}

span > * {
  color: white;
  background: none;
  border: none;
  text-transform: uppercase;
  height: 50.1px;
  margin: 0 10px;
  cursor: pointer;
  outline: none;
}
span > *:hover {
  color: white;
}

span > *::-moz-focus-inner {
  border: 0;
}

h3 {
  margin: 10px;
  float: left;
}

nav::after {
  content: "";
  display: block;
  clear: both;
}
.add {
  color: lightgreen !important;
}

.sub {
  color: rgb(228, 164, 164) !important;
}
</style>
