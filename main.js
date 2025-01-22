//The main brain. Manage stat of the game and state of all game objects.
//This game is created from top bottom. The game object is created first and then the player object is created.
class Game {
    //This game is object oriented code base to add more features and this will make it flexible and scalable.
    constructor(canvas, context){
        //the game can see the canvas element and aware of size. 
        this.canvas = canvas;
        this.ctx = context;
        this.width;
        this.height;
        this.cellSize = 50;
        this.columns;
        this.rows;

        //repeat a periodic event every 200 milliseconds.
        this.eventTimer = 0;
        this.eventInterval = 200;
        this.eventUpdate = false;

        this.player1;
        this.player2;
        this.player3;
        this.player4;
        this.food;
        this.gameObjects;

        window.addEventListener('resize', e => {
            this.resize(e.currentTarget.innerWidth, e.currentTarget.innerHeight)
        });

        //resize automatically when the browser window is resized.
        this.resize(window.innerWidth, window.innerHeight);
    }
    //the player position is always within the game area visible to the player.

    resize(width, height){
        //make the canvas centered and its width and height to be trimmed to increments of the cell size.
        this.canvas.width = width - width % this.cellSize;
        this.canvas.height = height - height % this.cellSize;
        this.ctx.fillStyle = 'blue';
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.columns = Math.floor(this.width / this.cellSize);
        this.rows = Math.floor(this.height / this.cellSize);
        this.player1 = new Keyboard2(this, 0, 0, 1, 0, 'blue');
        this.player2 = new ComputerAi(this, this.columns - 1, 0, 0, 1, 'red');
        this.player3 = new ComputerAi(this, this.columns -1, this.rows - 1, -1, 0, 'yellow');
        this.player4 = new ComputerAi(this, 0, this.rows - 1, 0, -1, 'purple');
        this.food = new Food(this);
        this.gameObjects = [this.player1, this.player2, this.player3, this.player4, this.food];

    }

    //scoreboard
    drawStatusText(){
        this.ctx.fillStyle = 'black';
    }

    checkCollision(a, b){
        return a.x === b.x && a.y === b.y;
    }

    //draw the grids.
    drawGrid(){
        for(let y = 0; y < this.rows; y++){
            for(let x = 0; x < this.columns; x++){
                //jump pixel by pixel to draw the grid.
                this.ctx.strokeRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
            }
        }
    }

    handlePeriodicEvent(deltaTime){
        //a periodic event.
        if(this.eventTimer < this.eventInterval){
            this.eventTimer += deltaTime;
            this.eventUpdate = false;
        }else{
            //the timer reached 200.
            this.eventTimer = 0;
            this.eventUpdate = true;
        }
    }
    //manage the game objects state.
    render(deltaTime){
        this.handlePeriodicEvent(deltaTime);
        if(this.eventUpdate){
            this.ctx.clearRect(0, 0, this.width, this.height);
            this.drawGrid();
            //limit fps to the game so frame rate would be consistant for all devices. so draw player first then update. 
            this.gameObjects.forEach(object => {
                object.draw()
                object.update()
            });
        }
    }
    
}


window.addEventListener('load', function(){
    const canvas = document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    //When the webpage loads it will set the canvas size of the browser window size. Reload to adjust the size.
    canvas.width = window.innerWidth; 
    canvas.height = window.innerHeight;

    const game = new Game(canvas, ctx);

    //Helper property. Holds the value timestamp of the previous animation frame.
    let lastTime = 0;
    function animate(timeStamp){
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        game.render(deltaTime);
        requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
});