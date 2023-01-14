const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}
console.log(collisionsMap);

class Boundary {
  static width = 48; // 12x12 tiles but zoomed 400% so 48
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.height = 48;
    this.width = 48;
  }

  draw() {
    ctx.fillStyle = 'rgba(255, 0, 0, 0.2)';
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}

const boundaries = [];
const offset = {
  x: -640,
  y: -380,
};

collisionsMap.forEach((row, i) => {
  row.forEach((symbol, j) => {
    if (symbol === 1025)
      boundaries.push(
        new Boundary({
          position: {
            x: j * Boundary.width + offset.x,
            y: i * Boundary.height + offset.y,
          },
        })
      );
  });
});

const image = new Image();
image.src = "./img/Pokemon Style Game Map.png";

const playerImage = new Image();
playerImage.src = "./img/playerDown.png";

class Sprite {
  constructor({ position, velocity, image, frames = { max: 1 } }) {
    this.position = position;
    this.image = image;
    this.frames = frames;

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
      console.log(this.width, this.height);
    };
  }
  draw() {
    ctx.drawImage(
      this.image,
      0, // crop x
      0, // crop y
      this.image.width / this.frames.max, // crop width
      this.image.height, // crop height
      this.position.x, // player x position
      this.position.y, // player y position
      this.image.width / this.frames.max, // player width
      this.image.height // player height
    );
  }
}

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // 192 = static value of player sprite img
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerImage,
  frames: { max: 4 },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});

// animation
const keys = {
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
};

const movables = [background, ...boundaries];

// detects collision from All 4 sides of player
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.position.x + rectangle1.width >= rectangle2.position.x &&
    rectangle1.position.x <= rectangle2.position.x + rectangle2.width &&
    rectangle1.position.y <= rectangle2.position.y + rectangle2.height &&
    rectangle1.position.y + rectangle1.height >= rectangle2.position.y
  );
}

function animate() {
  window.requestAnimationFrame(animate);
  background.draw();
  boundaries.forEach((boundary) => {
    boundary.draw();

    // calling collision detection function
    if (
      rectangularCollision({
        rectangle1: player,
        rectangle2: boundary,
      })
    ) {
      console.log("colliding");
    }
  });
  player.draw();

  let moving = true;
  if (keys.up.pressed && lastKey === keys.up) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y + 3,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.down.pressed && lastKey === keys.down) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x,
              y: boundary.position.y - 3,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.left.pressed && lastKey === keys.left) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x + 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.right.pressed && lastKey === keys.right) {
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        rectangularCollision({
          rectangle1: player,
          rectangle2: {
            ...boundary,
            position: {
              x: boundary.position.x - 3,
              y: boundary.position.y,
            },
          },
        })
      ) {
        console.log("colliding");
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x -= 3;
      });
  }
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
