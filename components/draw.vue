<script setup>
const { $socket } = useNuxtApp();

// Canvas
const canvas = document.createElement("canvas");
canvas.width = 5000;
canvas.height = 5000;
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

const pos = { x: 0, y: 0 };
const rgb = [
  Math.floor(Math.random() * 256),
  Math.floor(Math.random() * 256),
  Math.floor(Math.random() * 256),
];

const setPosition = (x, y) => {
  pos.x = x;
  pos.y = y;
};

const mousedown = (e) => setPosition(e.x, e.y);

const mousemove = (e) => {
  $socket.emit("mtv-mousemove", [e.x, e.y]);
  if (e.buttons !== 1) return;

  $socket.emit("mtv-draw", [pos.x, pos.y, e.x, e.y, ...rgb]);
  setPosition(e.x, e.y);
};

const mouseleave = () => $socket.emit("mtv-mouseleave");

// Socket events
const cursors = reactive(new Map());

$socket.on("mtv-mousemove", (msg) => {
  if (msg[0] < 5 || msg[1] < 5) return cursors.delete(msg.id);
  cursors.set(msg.id, { x: msg[0], y: msg[1] });
});

$socket.on("mtv-mouseleave", (msg) => cursors.delete(msg));
$socket.on("mtv-disconnect", (msg) => cursors.delete(msg));

$socket.on("mtv-draw", (msg) => {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgb(${msg[4]}, ${msg[5]}, ${msg[6]})`;
  ctx.moveTo(msg[0], msg[1]);
  ctx.lineTo(msg[2], msg[3]);
  ctx.stroke();
});

onMounted(() => {
  document.getElementById("draw-container").appendChild(canvas);
});
</script>

<template>
  <div>
    <div v-for="[id, pos] in cursors" :key="id">
      <img
        class="cursor"
        src="/cursor.png"
        :style="`left: ${pos.x}px; top: ${pos.y}px;`"
      />
    </div>

    <div
      id="draw-container"
      @mousedown="mousedown"
      @mousemove="mousemove"
      @mouseleave="mouseleave"
    />
  </div>
</template>