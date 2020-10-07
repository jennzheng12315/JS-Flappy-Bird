// Name any p5.js functions we use in the global so Glitch can recognize them.
/* global
 *    createCanvas, background
 *    colorMode, HSB, fill,
 *    text, textSize,
 *    width, height,
 *    ellipse, rect,
 *    key, random,
 *    frameCount, frameRate,
 */

let bird, pipes, gameIsOver, score, space, spaceMin, spaceMax;

function setup() {
  createCanvas(400, 600);
  colorMode(HSB, 100);
  gameIsOver = false;
  score = 0;
  spaceMin = 100;
  spaceMax = 200;
  space = random(spaceMin, spaceMax);
  bird = new Bird();
  pipes = [];
  pipes.push(new Pipe());

}

function draw() {
  background(0);

  for (let i = pipes.length - 1; i >= 0; i--) {
    pipes[i].show();
    pipes[i].update();

    if (pipes[i].hits(bird)) {
      bird.v = 0;
    } 
    
    if (pipes[i].offscreen() < 0) {
      pipes.splice(i, 1);
    }
    
    displayScore(pipes[i]);
    spaceMin++;
    spaceMax--;
    space = random(spaceMin, spaceMax);
  }

  if (gameIsOver) {
    gameOver();
  }

  bird.update();
  bird.show();

  if (frameCount % 100 == 0) {
    pipes.push(new Pipe());
  }
  
}

function keyPressed() {
  if (key == " ") {
    bird.up();
  }
}

function displayScore(pipes){
  if (bird.y >= pipes.top && bird.y <= height - pipes.bottom) {
      if (bird.x > pipes.x && bird.x < pipes.x + pipes.w) {
        score++;
      }
  }
  fill(100);
  text(`Score: ${Math.floor(score/9)}`, 10, 20); //Flooring score/9 makes score increment by 1
}

class Bird {
  constructor() {
    this.y = height / 2;
    this.x = 64;
    this.gravity = 0.6;
    this.lift = -15;
    this.velocity = 0;
  }

  show() {
    fill(100);
    ellipse(this.x, this.y, 32, 32);
  }

  update() {
    if (!gameIsOver) {
      this.velocity += this.gravity;
      this.velocity *= 0.9;
      this.y += this.velocity;
      
      if (this.y > height) {
        this.y = height;
        this.velocity = 0;
      }
      
      if (this.y < 0) {
        this.y = 0;
        this.velocity = 0;
      }
    }
  }

  up() {
    this.velocity += this.lift;
  }
}

class Pipe {
  constructor() {
    this.top = random(height / 2);
    this.bottom = random(height / 2);
    this.x = width;
    this.w = 20;
    this.speed = 2;
    this.highlight = false;
    this.space = random(space);
    this.spaceY = random(35, height - 35);
  }

  show() {
    fill(100);
    
    if (this.highlight == true) {
      fill(0, 100, 100);
    } else{
      fill(35, 100, 100);
    }
    
    //To create better obstacles, replace below with 
    //getting a random space in between pipes and a random starting point for the space
    rect(this.x, 0, this.w, this.top);
    rect(this.x, height - this.bottom, this.w, this.bottom);
  }

  update() {
    if (!gameIsOver) {
      this.x -= this.speed;
    }
  }

  offscreen() {
    if (this.x < -this.w) {
      return true;
    } else {
      return false;
    }
  }

  hits(bird) {
    if (bird.y < this.top || bird.y > height - this.bottom) {
      if (bird.x > this.x && bird.x < this.x + this.w) {
        this.highlight = true;
        gameIsOver = true;
        return true;
      }
    }
    return false;
  }
}

function gameOver() {
  textSize(20);
  fill(0, 100, 100);
  text("Game Over", width / 2, height / 2);
}
