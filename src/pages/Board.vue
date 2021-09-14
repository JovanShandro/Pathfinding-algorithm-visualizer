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

        <button @click="() => visualize(choice)">Visualize</button>
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

    <div class="u-m-auto" :style="{ width: 25 * cols + 'px' }">
      <div v-for="row in rows" class="boardRow" :key="row">
        <Square
          v-for="col in cols"
          :key="col"
          :square="board[row - 1][col - 1]"
          :id="'square-' + (row - 1) + '-' + (col - 1)"
          :choice="choice"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Square from "../components/Square.vue";
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
  components: {
    Square,
  },
  data() {
    return {
      choice: "",
    };
  },
  computed: {
      ...mapState(["rows", "cols", "board", "weightMode"]),
  },
  methods: {
    ...mapMutations([
      'updateWeightMode', 
      "clearBoard", 
      "resetBoard",
      "updateCols"
    ]),
    ...mapActions([
      "visualize", 
    ]),

    // To not allow the board to be dragged
    prevent(event) {
      event.preventDefault();
    },
  },
  created() {
    this.updateCols();
    this.resetBoard();
  },
};
</script>

<style scoped>
.add {
  color: lightgreen !important;
}

.sub {
  color: rgb(228, 164, 164) !important;
}

.boardRow {
  height: 25px;
  line-height: 0;
}
/*nav*/
nav {
  background-color: gray;
}

nav > span {
  float: right;
}

nav > span > select {
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  color: rgba(0, 0, 0, 0);
  text-shadow: 0 0 0 #000;
  text-align: right;
  text-align-last: right;
  width: 180px;
}

nav > span > select:active,
nav > span > select:focus {
  color: rgba(0, 0, 0, 0);
  text-shadow: 0 0 0 #000;
}

nav > span > select > option {
  background-color: black;
  text-transform: capitalize;
  color: white;
  margin-top: 5px;
}
nav > span > * {
  color: black;
  background: none;
  border: none;
  text-transform: uppercase;
  height: 50.1px;
  margin: 0 10px;
  cursor: pointer;
  outline: none;
}
nav > span > *:hover {
  color: white;
}

nav > span > *::-moz-focus-inner {
  border: 0;
}

nav > h3 {
  margin: 10px;
  float: left;
}
nav::after {
  content: "";
  display: block;
  clear: both;
}
</style>
