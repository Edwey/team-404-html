const canvas = document.getElementById('glitch-canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const fontSize = 14;
const columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill().map(() => Math.random() * canvas.height / fontSize);

const chars = "アァイィウヴカガサザABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&";
let frame = 0;

let message = "404 NOT FOUND";
let messageY = getRandomMessageRow();
let messageX = getRandomMessageCol();
let glowStart = performance.now();

function getRandomMessageRow() {
  return Math.floor(Math.random() * (canvas.height / fontSize - 2)) + 1;
}

function getRandomMessageCol() {
  return Math.floor(Math.random() * (columns - message.length));
}

function draw() {
  frame++;

  // Fade background slightly
  ctx.fillStyle = "rgba(0, 0, 0, 0.2)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.font = fontSize + "px monospace";

  const now = performance.now();
  const glowDuration = 5000; // 5 seconds
  const isGlowing = now - glowStart < glowDuration;

  for (let i = 0; i < drops.length; i++) {
    const x = i * fontSize;
    const y = drops[i] * fontSize;

    let char = chars[Math.floor(Math.random() * chars.length)];
    ctx.fillStyle = "rgba(0, 255, 0, 0.4)";

    // Check if this drop aligns with message
    const colIndex = i - messageX;
    if (Math.floor(drops[i]) === messageY && colIndex >= 0 && colIndex < message.length) {
      char = Math.random() < 0.1 ? chars[Math.floor(Math.random() * chars.length)] : message[colIndex];
      ctx.fillStyle = isGlowing ? "#0ff" : "rgba(0,255,255,0.3)";
    }

    ctx.fillText(char, x, y);

    // Reset drops more often to increase rainfall
    if (y > canvas.height || Math.random() > 0.95) {
      drops[i] = 0;
    }

    drops[i]++;
  }

  // Change message every 6 seconds
  if (frame % 360 === 0) {
    messageY = getRandomMessageRow();
    messageX = getRandomMessageCol();
    glowStart = performance.now(); // restart glow timer
  }

  requestAnimationFrame(draw);
}

draw();
