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

image.onload = () => {
  ctx.drawImage(image, -640, -350);
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
};

// movement

window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "z":
      console.log("up");
      break;
    case "q":
      console.log("left");
      break;
    case "s":
      console.log("down");
      break;
    case "d":
      console.log("right");
      break;
  }

});
