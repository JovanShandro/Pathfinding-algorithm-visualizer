<template>
  <nav>
    <h3>Enjoy playing with the Board</h3>
    <span>
      <select v-model="algorithmChoice">
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
        @click="updateWeightMode"
        :class="{ add: weightMode == 1, sub: weightMode == -1 }"
      >
        weights
      </button>
    </span>
  </nav>
</template>

<script>
import { mapState, mapMutations, mapActions } from "vuex";

export default {
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
  background-color: gray;
}

 span {
  float: right;
}

select {
  color: rgba(0, 0, 0, 0);
  text-shadow: 0 0 0 #000;
  text-align: right;
  text-align-last: right;
  width: 180px;
}

select:active,
select:focus {
  color: rgba(0, 0, 0, 0);
  text-shadow: 0 0 0 #000;
}

option {
  background-color: black;
  text-transform: capitalize;
  color: white;
  margin-top: 5px;
}

span > * {
  color: black;
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
</style>
