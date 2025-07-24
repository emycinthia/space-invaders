import Grid from "./classes/Grid.js";
import Invader from "./classes/Invader.js";
import Particle from "./classes/Particle.js";
import Player from "./classes/Player.js";
import Projectile from "./classes/Projectile.js";

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

ctx.imageSmoothingEnabled = false;

const player = new Player(canvas.width, canvas.height);
const grid = new Grid(3, 6);

const playerProjectiles = [];
const invadersProjectiles = [];
const particles = [];

const keys = {
  left: false,
  right: false,
  shoot: {
    pressed: false,
    released: true,
  },
};

const drawProjectiles = () => {
  const projectiles = [...playerProjectiles, ...invadersProjectiles];

  projectiles.forEach((projectile) => {
    projectile.draw(ctx);
    projectile.update();
  });
};

const drawParticles = () => {
  particles.forEach((particle) => {
    particle.draw(ctx);
    particle.update();
  });
};

const clearProjectiles = () => {
  playerProjectiles.forEach((projectile, index) => {
    if (projectile.position.y <= 0) {
      playerProjectiles.splice(index, 1);
    }
  });
};

const clearParticles = () => {
  particles.forEach((particle, index) => {
    if (particle.opacity <= 0) {
      particles.splice(index, 1);
    }
  });
};

const createExplosion = (position, size, color) => {
  for (let e = 0; e < size; e++) {
    const particle = new Particle(
      { x: position.x, y: position.y },
      { x: Math.random() - 0.5 * 1.5, y: Math.random() - 0.5 * 1.5 },
      2,
      color
    );

    particles.push(particle);
  }
};

const checkShootInvaders = () => {
  grid.invaders.forEach((invader, invaderIndex) => {
    playerProjectiles.some((projectile, projectileIndex) => {
      if (invader.hit(projectile)) {
        createExplosion(
          {
            x: invader.position.x + invader.width / 2,
            y: invader.position.y + invader.height / 2,
          },
          10,
          "#941CFF"
        );

        grid.invaders.splice(invaderIndex, 1);
        playerProjectiles.splice(projectileIndex, 1);
      }
    });
  });
};

const gameLoop = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawParticles();
  drawProjectiles();
  clearProjectiles();
  clearParticles();

  checkShootInvaders();

  grid.draw(ctx);
  grid.update();

  ctx.save();

  ctx.translate(
    player.position.x + player.width / 2,
    player.position.y + player.height / 2
  );

  if (keys.shoot.pressed && keys.shoot.released) {
    player.shoot(playerProjectiles);
    keys.shoot.released = false;
  }

  if (keys.left && player.position.x >= 0) {
    player.moveLeft();
    ctx.rotate(-0.15);
  }

  if (keys.right && player.position.x <= canvas.width - player.width) {
    player.moveRight();
    ctx.rotate(0.15);
  }

  ctx.translate(
    -player.position.x - player.width / 2,
    -player.position.y - player.height / 2
  );

  player.draw(ctx);
  ctx.restore();

  requestAnimationFrame(gameLoop);
};

addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a" || event.code === "ArrowLeft") keys.left = true;
  if (key === "d" || event.code === "ArrowRight") keys.right = true;
  if (event.code === "Space") keys.shoot.pressed = true;
});

addEventListener("keyup", (event) => {
  const key = event.key.toLowerCase();

  if (key === "a" || event.code === "ArrowLeft") keys.left = false;
  if (key === "d" || event.code === "ArrowRight") keys.right = false;
  if (event.code === "Space") {
    keys.shoot.pressed = false;
    keys.shoot.released = true;
  }
});

setInterval(() => {
  const invader = grid.getRandomInvader();

  if (invader) {
    invader.shoot(invadersProjectiles);
  }
}, 1000);

gameLoop();
