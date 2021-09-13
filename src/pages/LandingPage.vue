<template>
  <div class="landing">
    <h1 class="landing--header">Pathfinding Algorithms Visualizer</h1>
    <div class="landing--intro">
      <p>
        Below there are some tips to inform you how the Visualizer works. If you
        want to directly check it out, please click
        <a id="here-link" href="#boardlink">here.</a>
      </p>
    </div>
    <div class="rules">
      <div class="group-1">
        <div class="rules-1">
          <h3>Endpoints</h3>
          <p>
            The green sphere in the board indicates the start, whereas the red
            sphere indicates the target square. Each algorithm will try to find
            the shortest path connecting the start square to the target square.
          </p>
          <img src="assets/start_end.png" alt />
        </div>

        <div class="rules-2">
          <h3>Navbar</h3>
          <p>
            You can use the navbar below the board to control the board. The
            'Choose the Algorithm' dropdown can be used to choose which
            pathfinding algorithm to visualize. The 'Visualize' button starts
            the visualization. The 'Reset' button resets the board in its
            initial state, whereas the 'Clear' button only clears the weights
            and walls. At last, the 'Weights' button can be used to control the
            weights. The weight of each square will show up only if the chosen
            algorithm is weighted. Pressing the button will change its color to
            green, red, or black. If it is green you can add weights by clicking
            on the squares. If the color is red, you can remove a weight from
            the square by clicking on it. If the color is black, then you can
            add walls in the board.
          </p>
          <img src="assets/navbar.png" alt />
        </div>
      </div>
      <div class="group-2">
        <div class="rules-3">
          <h3>Endpoints</h3>
          <p>
            You can drag the start or target square over the board using the
            mouse
          </p>
          <img src="assets/endpoints.gif" alt />
        </div>

        <div class="rules-4">
          <h3>Walls</h3>
          <p>
            When the 'Weights' button in the navbar is black, you can add walls
            using the mouse.
          </p>
          <img src="assets/walls.gif" alt />
        </div>

        <div class="rules-5">
          <h3>Weights</h3>
          <p>
            Upon choosing a weighted algorithm (currently only Dijkstra) weights
            will immediately show up in each node. You can add or remove weights
            depending on the color of the 'Weights' button. (max 99, min 1).
          </p>
          <img src="assets/weights.gif" alt />
        </div>
      </div>

      <div class="rules-6">
        <h3>Visualization example</h3>
        <p>Below there is a visualization of the A* algorithm.</p>
        <img src="assets/astar.gif" alt />
      </div>

      <p class="landing--close">
        Hope you now have an idea of how to use the pathfinding visualizer.
        Enjoy :)
      </p>
    </div>

    <router-link id="boardlink" to="/board">
      <div id="action">
        Take me to the board
      </div>
    </router-link>
  </div>
</template>

<script>
export default {
  name: "LandingPage",
  data() {
    return {};
  },
};
</script>

<style scoped>
.landing {
  min-height: 110%;
  margin: 30px;
  padding-bottom: 20px;
  background-color: lightgray;
  text-align: center;
}

.landing--header {
  font-family: "Dancing Script", cursive;
}

.landing--intro {
  margin-bottom: 50px;
}

.rules > *:not(:last-child) {
  margin-bottom: 60px;
}
.rules-1,
.rules-2 {
  float: left;
  width: 48%;
  margin: 0 1%;
}

.rules-3,
.rules-4,
.rules-5 {
  float: left;
  width: 32%;
}
.rules-4 {
  margin: 0 1%;
}

a,
a:link,
a:visited {
  color: black;
  text-decoration: none;
  outline: none;
}

a:hover {
  color: rgb(150, 147, 147);
}

.group-1::after,
.group-2::after {
  content: "";
  display: block;
  clear: both;
}

img {
  margin-top: 10px;
}

#here-link {
  color: rgb(121, 118, 118);
}

#action {
  font-size: 2rem;
  color: black;
  background-color: black;
  color: white;
  border-radius: 50px;
  max-width: 200px;
  margin: 20px auto;
}

#action:hover {
  transform: scale(1.2);
}

@media only screen and (max-width: 1660px) {
  .rules .group-2 * > img {
    width: 100%;
  }
}

@media only screen and (max-width: 1210px) {
  .rules [class^="rules-"] {
    width: 86%;
    margin: 0 7%;
  }
  .rules [class^="rules-"] > img {
    width: 60%;
  }

  .rules-1 {
    margin-bottom: 40px !important;
  }

  .group-1 {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .group-1 {
    clear: left;
  }
}

@media only screen and (max-width: 640px) {
  .rules [class^="rules-"] > img {
    width: 90% !important;
  }
}
</style>
