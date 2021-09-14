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

      <button @click="visualize">
        <vue-custom-tooltip label="Start the animation">
          <i class="fas fa-play"></i
        ></vue-custom-tooltip>
      </button>
      <button @click="resetBoardAndUpdateCols">
        <vue-custom-tooltip label="Refresh board to initial state">
          <i class="fas fa-redo-alt"></i>
        </vue-custom-tooltip>
      </button>
      <button @click="clearBoard">
        <vue-custom-tooltip label="Remove painted squares">
          <i class="fas fa-eraser"></i>
        </vue-custom-tooltip>
      </button>
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
    ...mapMutations(["updateWeightMode", "clearBoard", "setAlgorithm"]),
    ...mapActions(["visualize", "resetBoardAndUpdateCols"]),
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
  display: flex;
  justify-content: space-between;
  align-items: center;
}

span {
}

.add {
  color: lightgreen !important;
}

.sub {
  color: rgb(228, 164, 164) !important;
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

span > button,
select {
  color: white;
  background: none;
  border: none;
  text-transform: uppercase;
  height: 56.1px;
  margin: 0 10px;
  cursor: pointer;
  outline: none;
}

h3 {
  margin: 10px;
}

.add {
  color: lightgreen !important;
}

.sub {
  color: rgb(228, 164, 164) !important;
}
</style>
