var ITEM_VARIATION = 4;
enchant()
window.onload = function(){
  //変数
  var label; //ラベル
  var limit = 60; //制限時間(秒)
  var rate = 1;
  //ゲームオブジェクト生成
  var game = new Game(320, 320);
  game.fps = 60; //ゲーム更新速度
  game.score = 0; //初期スコア
  game.tick = game.fps * limit;
  game.preload('img/icon0.gif'); //画像読み込み
  game.onload = function(){ //ロード完了時読み込み
    //背景
    var bg = new Sprite(320, 320);
    bg.backgroundColor = "rgb(0, 200, 255)";
    game.rootScene.addChild(bg);
    //ラベル
    label = new Label("");
    game.rootScene.addChild(label);
  }
  
  
  
  //アイテム雛型
  game.addHoge = function(x, y){
    //生成
    var hoge = new Sprite(16, 16);
    hoge.image = game.assets['img/icon0.gif'];
    hoge.x = x;
    hoge.y = y;
    hoge.frame = 0;
    hoge.tick = 120;
    game.rootScene.addChild(hoge);
    //定期処理
    hoge.addEventListener(Event.ENTER_FRAME, function(){
      if(hoge.tick == 0){
        game.rootScene.removeChild(hoge);
      }
      hoge.tick--;
    });
    //タッチ処理
    hoge.addEventListener(Event.TOUCH_START, function(){
      game.score += rate * 1;
      game.rootScene.removeChild(hoge);
    });
  }
  //リンゴ(＃15)
  game.addApple = function(x, y){
    //生成
    var apple = new Sprite(16, 16);
    apple.image = game.assets['img/icon0.gif'];
    apple.x = x;
    apple.y = y;
    apple.frame = 15;
    apple.tick = 120;
    game.rootScene.addChild(apple);
    //定期処理
    apple.addEventListener(Event.ENTER_FRAME, function(){
      if(apple.tick == 0){
        game.rootScene.removeChild(apple);
      }
      apple.tick--;
    });
    //タッチ処理
    apple.addEventListener(Event.TOUCH_START, function(){
      game.score += rate * 5;
      game.rootScene.removeChild(apple);
    });
  }
  //バナナ(＃16)
  game.addBanana = function(x, y){
    //生成
    var banana = new Sprite(16, 16);
    banana.image = game.assets['img/icon0.gif'];
    banana.x = x;
    banana.y = y;
    banana.frame = 16;
    banana.tick = 120;
    game.rootScene.addChild(banana);
    //定期処理
    banana.addEventListener(Event.ENTER_FRAME, function(){
      if(banana.tick == 0){
        game.rootScene.removeChild(banana);
      }
      banana.tick--;
    });
    //タッチ処理
    banana.addEventListener(Event.TOUCH_START, function(){
      game.score += rate * 10;
      game.rootScene.removeChild(banana);
    });
  }
  
  
  
  
  //シーン定期処理
  game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
    if(game.tick > 0){
      if((game.tick % 120) === 0){
        rate += 1;
      }
      //アイテムを出現
      if((game.tick % 10) === 0){
        //出現位置の計算
        var x = Math.floor(Math.random() * 300);
        var y = Math.floor(Math.random() * 250 + 50);
        //出現アイテムの抽選
        var variation = Math.floor(Math.random() * ITEM_VARIATION);
        switch(variation){
          case 1:
            game.addHoge(x, y);
            break;
          case 2:
            game.addApple(x, y);
            break;
          case 3:
            game.addBanana(x, y);
            break;            
          default:
            game.addHoge(x, y);
        }
      }
      //ラベル表示
      label.text = "残り時間：" + Math.floor(game.tick /game.fps) +
        "<BR>SCORE：" + game.score +"点" + "<BR>得点レート：×" + rate;
    }else if(game.tick === 0){
      //ゲームオーバー
      game.end(game.score, "あなたのスコアは" + game.score + "点です!!");
    }
    game.tick--; 
  });
  game.start();
}
//乱数生成
function rand(num){
  return Math.floor(Math.random() * num);
}
