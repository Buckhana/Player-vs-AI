class Player {
    constructor(game, x, y, speedX, speedY, color, name){
        this.game = game;
        //x and y is the position of the player.
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
        this.width = this.game.cellSize;
        this.height = this.game.cellSize;
        this.moving = true;
        this.score = 0;
        this.length = 3;
        this.segments = [];
        //player can only turn onces per frame.
        this.readyToTurn = true;
        this.name = name;
    }

    update(){
        //flag when the player is ready to move.
        this.readyToTurn = true;

        //check collision with the food.
        if(this.game.checkCollision(this, this.game.food)){
            this.game.food.reset();
            this.score++;
            this.length++;
        }

        //boundaries of the game area.
        if (this.x <= 0 && this.speedX < 0 || 
            this.x >= this.game.columns - 1 && this.speedX > 0 ||
            this.y <= 0 && this.speedY < 0 ||
            this.y >= this.game.rows - 1 && this.speedY > 0
            ){
            this.moving = false;
        }

        if(this.moving){
            this.x += this.speedX;
            this.y += this.speedY;
            //adds to the body segments of the players when they eat the food.
            this.segments.unshift({x: this.x, y: this.y});
            //create a new segment and remove the last segment.
            if(this.segments.length > this.length){
                this.segments.pop();
            }
        }
        
    }

    draw(){
        //draw the player and its body segments.
        this.segments.forEach((segment, i) => {
            if (i === 0) this.game.ctx.fillStyle = 'teal';
            else this.game.ctx.fillStyle = this.color;
            //Move player cellsize to cellsize.
            this.game.ctx.fillRect(segment.x * this.game.cellSize, segment.y * this.game.cellSize, this.width, this.height);
        });
    }
    turnUp(){
        //if the player is moving horizontally, then it can turn up.
        if(this.speedY === 0 && this.readyToTurn) {
            this.speedX = 0;
            this.speedY = -1;
            this.moving = true;
            this.readyToTurn = false;
        }
    }
    turnDown(){
        //if the player is moving horizontally, then it can turn down.
        if(this.speedY === 0 && this.readyToTurn) {
            this.speedX = 0;
            this.speedY = 1;
            this.moving = true;
            this.readyToTurn = false;
        }
    }
    turnLeft(){
        //if the player is moving vertically, then it can turn left.
        if(this.speedX === 0 && this.readyToTurn) {
            this.speedX = -1;
            this.speedY = 0;
            this.moving = true;
            this.readyToTurn = false
        }
    }
    turnRight(){
        //if the player is moving vertically, then it can turn right.
        if(this.speedX === 0 && this.readyToTurn) {
            this.speedX = 1;
            this.speedY = 0;
            this.moving = true;
            this.readyToTurn = false;
        }
    }
}

class Keyboard1 extends Player{
    constructor(game, x, y, speedX, speedY, color, name){
        super(game, x, y, speedX, speedY, color, name);

        window.addEventListener('keydown', e => {
            if(e.key === 'ArrowRight') this.turnRight();
            else if(e.key === 'ArrowLeft') this.turnLeft();
            else if(e.key === 'ArrowUp') this.turnUp();
            else if(e.key === 'ArrowDown') this.turnDown();
        });
    }
}

class Keyboard2 extends Player{
    constructor(game, x, y, speedX, speedY, color, name ){
        super(game, x, y, speedX, speedY, color, name);

        window.addEventListener('keydown', e => {
            if(e.key.toLowerCase() === 'd') this.turnRight();
            else if(e.key.toLowerCase() === 'a') this.turnLeft();
            else if(e.key.toLowerCase() === 'w') this.turnUp();
            else if(e.key.toLowerCase() === 's') this.turnDown();
        });
    }
}

class ComputerAi extends Player{
    constructor(game, x, y, speedX, speedY, color, name){
        super(game, x, y, speedX, speedY, color, name);
        //counter for randomly changing the direction of the computer player.
        this.turnTimer = 0;
        //counts steps before changing direction.
        this.turnInterval = Math.floor(Math.random() * this.game.columns + 1);
    }

    update(){
        super.update();
        //Blind AI: Have a timer and randomly change the direction of the computer player.
        if(this.turnTimer < this.turnInterval){
            this.turnTimer += 1;
        }else{
            this.turnTimer = 0;
            this.turn();
            this.turnInterval = Math.floor(Math.random() * this.game.columns + 1);
        }
    }
    //pick a random direction and move the computer player in that direction.
    turn(){
        //it will consider the direction of the player then decide.
        if(this.speedY === 0){
            Math.random() < 0.5 ? this.turnUp() : this.turnDown();
        }else if (this.speedX === 0){
            Math.random() < 0.5 ? this.turnLeft() : this.turnRight();
        }
    }
}