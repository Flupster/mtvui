<script setup lang="ts">
class LightsOut {
  size: number;
  state: boolean[];
  complete: boolean;

  constructor(size: number) {
    this.size = size;
    this.state = [];
    this.generateState();
    this.complete = false;
  }

  generateState() {
    this.state = [];
    for (let i = 0; i < this.size ** 2; i++) {
      this.state.push(Math.random() > 0.5);
    }

    const solved = this.solve();
    if (!solved) return this.generateState();
    this.state = solved;
  }

  neighbours(i: number) {
    return [
      i < this.size ? false : i - this.size,
      (i + 1) % this.size === 0 ? false : i + 1,
      i + 1 > this.size ** 2 - this.size ? false : i + this.size,
      i % this.size === 0 ? false : i - 1,
    ].filter((x) => x !== false);
  }

  flip(index) {
    this.state[index] = !this.state[index];
  }

  toggle(index) {
    this.neighbours(index).forEach(this.flip.bind(this));
    this.flip(index);

    this.complete = this.state.every((x) => x === false);
  }

  solve() {
    const original = Array.from(this.state);

    for (let i = this.size; i < this.size ** 2; i++) {
      if (this.state[i - this.size]) this.toggle(i);
    }

    const lastRow = this.state.slice(
      this.size ** 2 - this.size,
      this.size ** 2
    );

    const endingRows = [
      [false, false, false, false, false],
      [false, false, true, true, true],
      [false, true, false, true, false],
      [false, true, true, false, true],
      [true, false, false, false, true],
      [true, false, true, true, false],
      [true, true, false, true, true],
      [true, true, true, false, false],
    ];

    const solveable = () => {
      for (const end of endingRows) {
        if (lastRow.every((v, i) => v === end[i])) return true;
      }
    };

    return solveable() ? original : false;
  }
}

const game = ref(new LightsOut(5));
</script>

<template>
  <div class="h-100">
    <div v-if="!game.complete">
      <h1 class="text-center text-danger mt-4">Bot Detected...</h1>
      <h1 class="text-center">
        Please complete this captcha before viewing the movie.
      </h1>
      <h5 class="text-center">All squares must be unlit</h5>
      <b-container
        class="d-flex align-items-center justify-content-center h-100"
      >
        <b-row>
          <b-col>
            <div class="puzzle justify-content-center">
              <div
                v-for="(s, i) in game.state"
                @click="game.toggle(i)"
                class="square"
                :class="{ enabled: s }"
              ></div>
            </div>
          </b-col>
        </b-row>
      </b-container>
    </div>
    <quotes v-else></quotes>
  </div>
</template>

<style>
.puzzle {
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -263px;
  margin-left: -265px;

  display: grid;
  grid-template-columns: 105px 105px 105px 105px 105px;
}

.square {
  background-color: green;
  margin: 3px;
  height: 100px;
  width: 100px;
  cursor: pointer;
  opacity: 30%;
}

.enabled {
  opacity: 100%;
}
</style>
