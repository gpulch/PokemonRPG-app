class Sprite {
  constructor({
    position,
    velocity,
    image,
    frames = { max: 1 },
    sprites = [],
  }) {
    this.position = position;
    this.image = image;
    this.frames = { ...frames, value: 0, elapsed: 0 };

    this.image.onload = () => {
      this.width = this.image.width / this.frames.max;
      this.height = this.image.height;
      console.log(this.width, this.height);
    };
    this.moving = false;
    this.sprites = sprites;
  }
  draw() {
    ctx.drawImage(
      this.image,
      (this.frames.value * this.image.width) / this.frames.max, // crop x, each 48 is another sprite
      0, // crop y
      this.image.width / this.frames.max, // crop width
      this.image.height, // crop height
      this.position.x, // player x position
      this.position.y, // player y position
      this.image.width / this.frames.max, // player width
      this.image.height // player height
    );

    if (!this.moving) return;

    if (this.frames.max > 1) {
      this.frames.elapsed++;
    }
    if (this.frames.elapsed % 10 === 0) {
      // walk animation set at 10 frames per second
      if (this.frames.value < this.frames.max - 1) this.frames.value++;
      else this.frames.value = 0;
    }
  }
}

class Boundary {
  static width = 48; // 12x12 tiles but zoomed 400% so 48
  static height = 48;
  constructor({ position }) {
    this.position = position;
    this.height = 48;
    this.width = 48;
  }

  draw() {
    ctx.fillStyle = "rgba(255, 0, 0, 0)";
    ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
  }
}
