import Invader from "./Invader.js";

class Grid {
  constructor(rows, columns) {
    this.rows = rows;
    this.cols = columns;

    this.direction = "right";
    this.moveDown = false;

    this.invadersVelocity = 1;
    this.invaders = this.init();
  }

  init() {
    const array = [];

    for (let row = 0; row < this.rows; row += 1) {
      for (let col = 0; col < this.cols; col += 1) {
        const invader = new Invader(
          {
            x: col * 50 + 20,
            y: row * 37 + 20,
          },
          this.invadersVelocity
        );

        array.push(invader);
      }
    }

    return array;
  }

  draw(ctx) {
    this.invaders.forEach((invader) => invader.draw(ctx));
  }

  update(playerStatus) {
    if (this.hitRightCorner()) {
      this.direction = "left";
      this.moveDown = true;
    } else if (this.hitLeftCorner()) {
      this.direction = "right";
      this.moveDown = true;
    }

    if (!playerStatus) this.moveDown = false;

    this.invaders.forEach((invader) => {
      if (this.moveDown) {
        invader.moveDown();
        invader.incrementVelocity(0.1);
        this.invadersVelocity = invader.velocity;
      }

      if (this.direction === "right") invader.moveRight();
      if (this.direction === "left") invader.moveLeft();
    });

    this.moveDown = false;
  }

  hitRightCorner() {
    return this.invaders.some(
      (invader) => invader.position.x + invader.width >= innerWidth
    );
  }

  hitLeftCorner() {
    return this.invaders.some((invader) => invader.position.x <= 0);
  }

  getRandomInvader() {
    const index = Math.floor(Math.random() * this.invaders.length);
    return this.invaders[index];
  }

  restart() {
    this.invaders = this.init();
    this.direction = "right";
  }
}

export default Grid;
