enchant()
window.onload = function(){
  var game = new Game(320, 320);
  game.fps = 60;
  game.addGauge = function(life, x){
    gauge = new Sprite(life, 16);
    hoge = new Surface(life, 16);
    gauge.image = hoge;
    gauge.x = x * 16;
    gauge.y = 0;
    hoge.context.fillStyle = "red";
    hoge.context.fillRect = (0, 0, life, 16);
    game.root
  } 
}
