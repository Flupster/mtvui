<script setup>
const { $socket } = useNuxtApp();

const canvas = document.createElement("canvas");
canvas.width = 5000;
canvas.height = 5000;
const ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

const pos = { x: 0, y: 0 };
const rgb = {
  r: Math.floor(Math.random() * 256),
  g: Math.floor(Math.random() * 256),
  b: Math.floor(Math.random() * 256),
};

function mousedown(e) {
  pos.x = e.x;
  pos.y = e.y;
}

function mousemove(e) {
  $socket.emit("mouse", { x: e.x, y: e.y });

  if (e.buttons !== 1) return;

  $socket.emit("draw", {
    rgb,
    from: { x: pos.x, y: pos.y },
    to: { x: e.x, y: e.y },
  });

  pos.x = e.x;
  pos.y = e.y;
}

const cursors = reactive(new Map());

$socket.on("mouse", (msg) => {
  cursors.set(msg.id, { x: msg.x, y: msg.y });
});

$socket.on("draw", (msg) => {
  ctx.beginPath();
  ctx.lineWidth = 2;
  ctx.lineCap = "round";
  ctx.strokeStyle = `rgb(${msg.rgb.r}, ${msg.rgb.g}, ${msg.rgb.b})`;
  ctx.moveTo(msg.from.x, msg.from.y);
  ctx.lineTo(msg.to.x, msg.to.y);
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
        src="~/assets/cursor.png"
        :style="`left: ${pos.x}px; top: ${pos.y}px`"
      />
    </div>

    <div id="draw-container" @mousedown="mousedown" @mousemove="mousemove" />
  </div>
</template>