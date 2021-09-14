<template>
  <Undraggable>
    <Navbar />
    <div class="u-m-auto" :style="{ width: 25 * cols + 'px' }">
      <div v-for="row in rows" class="boardRow" :key="row">
        <Square
          v-for="col in cols"
          :key="col"
          :square="board[row - 1][col - 1]"
          :id="'square-' + (row - 1) + '-' + (col - 1)"
        />
      </div>
    </div>
  </Undraggable>
</template>

<script>
import Square from "../components/Square.vue";
import Navbar from "../components/Navbar.vue";
import Undraggable from "../components/Undraggable.vue";
import { mapState, mapMutations } from "vuex";

export default {
  components: {
    Square,
    Navbar,
    Undraggable,
  },
  computed: {
    ...mapState(["rows", "cols", "board"]),
  },
  methods: {
    ...mapMutations(["resetBoard", "updateCols"]),
  },
  created() {
    this.updateCols();
    this.resetBoard();
  },
};
</script>

<style scoped>
.boardRow {
  height: 25px;
  line-height: 0;
}
</style>
