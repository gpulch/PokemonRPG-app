const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

ctx.fillStyle = "red";
ctx.fillRect(0, 0, canvas.width, canvas.height);

const image = new Image();
image.src = "./img/Pokemon Style Game Map.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image }) {
    this.position = position;
    this.image = image;
  }
  draw() {
    ctx.drawImage(this.image, this.position.x, this.position.y);
  }
}

const background = new Sprite({ position: { x: -640, y: -350 }, image: image });

// animation
const keys = {
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
};

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  ctx.drawImage(
    playerImage,
    0, // crop x
    0, // crop y
    playerImage.width / 4, // crop width
    playerImage.height, // crop height
    canvas.width / 2 - playerImage.width / 4 / 2, // player x position
    canvas.height / 2 - playerImage.height / 2, // player y position
    playerImage.width / 4, // player width
    playerImage.height // player height
  );
  if (keys.up.pressed && lastKey === keys.up) background.position.y += 3;
  else if (keys.down.pressed && lastKey === keys.down)
    background.position.y -= 3;
  else if (keys.left.pressed && lastKey === keys.left)
    background.position.x += 3;
  else if (keys.right.pressed && lastKey === keys.right)
    background.position.x -= 3;
}
animate();

// movement
let lastKey = null;
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "z":
      keys.up.pressed = true;
      lastKey = keys.up;
      break;
    case "q":
      keys.left.pressed = true;
      lastKey = keys.left;
      break;
    case "s":
      keys.down.pressed = true;
      lastKey = keys.down;
      break;
    case "d":
      keys.right.pressed = true;
      lastKey = keys.right;
      break;
  }
});
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "z":
      keys.up.pressed = false;
      break;
    case "q":
      keys.left.pressed = false;
      break;
    case "s":
      keys.down.pressed = false;
      break;
    case "d":
      keys.right.pressed = false;
      break;
  }
});
