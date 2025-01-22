class Food {
  constructor(game) {
    this.game = game;
    this.x;
    this.y;
    this.reset(); //give x and y some values
  }

  reset() {
    this.x = Math.floor(Math.random() * this.game.columns);
    this.y = Math.floor(Math.random() * this.game.rows);
  }

  draw(){
    this.game.ctx.fillStyle = 'white';
    this.game.ctx.fillRect(this.x * this.game.cellSize, this.y *this.game.cellSize, this.game.cellSize, this.game.cellSize);
  }

  update(){

  }
}