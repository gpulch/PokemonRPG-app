const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

const collisionsMap = [];
for (let i = 0; i < collisions.length; i += 70) {
  collisionsMap.push(collisions.slice(i, 70 + i));
}
console.log(collisionsMap);

const boundaries = [];
const offset = {
  x: -160,
  y: -200,
};

// converting json collision map to true false boundaries on grid
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
// image.src = "./img/Pokemon Style Game Map.png";
image.src = "./img/Pokemon Style Game Map v2.png";

const foregroundImage = new Image();
foregroundImage.src = "./img/foregroundObjects.png";

const playerDownImage = new Image();
playerDownImage.src = "./img/playerDown.png";
const playerUpImage = new Image();
playerUpImage.src = "./img/playerUp.png";
const playerLeftImage = new Image();
playerLeftImage.src = "./img/playerLeft.png";
const playerRightImage = new Image();
playerRightImage.src = "./img/playerRight.png";

const player = new Sprite({
  position: {
    x: canvas.width / 2 - 192 / 4 / 2, // 192 = static value of player sprite img
    y: canvas.height / 2 - 68 / 2,
  },
  image: playerDownImage,
  frames: { max: 4 },
  sprites: {
    up: playerUpImage,
    down: playerDownImage,
    left: playerLeftImage,
    right: playerRightImage,
  },
});

const background = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: image,
});

const foreground = new Sprite({
  position: { x: offset.x, y: offset.y },
  image: foregroundImage,
});

// animation
const keys = {
  up: { pressed: false },
  down: { pressed: false },
  left: { pressed: false },
  right: { pressed: false },
};

const movables = [background, ...boundaries, foreground];

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
  background.draw(); // rendering background
  boundaries.forEach((boundary) => {
    boundary.draw(); // rendering boundaries
  });

  player.draw(); // rendering player
//   foreground.draw(); // rendering foreground

  let moving = true;
  player.moving = false;

  if (keys.up.pressed && lastKey === keys.up) {
    player.moving = true;
    player.image = player.sprites.up;
    for (let i = 0; i < boundaries.length; i++) {
      const boundary = boundaries[i];
      if (
        // calling collision detection function
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
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y += 3;
      });
  } else if (keys.down.pressed && lastKey === keys.down) {
    player.moving = true;
    player.image = player.sprites.down;
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
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.y -= 3;
      });
  } else if (keys.left.pressed && lastKey === keys.left) {
    player.moving = true;
    player.image = player.sprites.left;
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
        moving = false;
        break;
      }
    }

    if (moving)
      movables.forEach((movable) => {
        movable.position.x += 3;
      });
  } else if (keys.right.pressed && lastKey === keys.right) {
    player.moving = true;
    player.image = player.sprites.right;
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
