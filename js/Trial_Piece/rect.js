var GAME_WINDOW = 320;
var GAME_FPS = 60;
//ゲームの制限時間(秒)
var TIME = 180;
enchant()
window.onload = function(){
  var label;
  //フラグ
  var rect_flag = false;
  //第1次点
  var first_X = 0;
  var first_Y = 0;
  //第2次点
  var second_X = 0;
  var second_Y = 0;
  //始点
  var departure_X = 0;
  var departure_Y = 0;
  //終点
  var terminus_X = 0;
  var terminus_Y = 0;
  //四角形の大きさ
  var size_X = 0;
  var size_Y = 0;
  //ゲームオブジェクト
  var game = new Game(GAME_WINDOW, GAME_WINDOW);
  game.fps = GAME_FPS;
  game.tick = game.fps * TIME;
  game.score = 0;
  //画像の読み込み
  game.preload('img/icon0.gif','img/point.gif');
  //ポイントの追加
  game.addPoint = function(point_X, point_Y){
    //ポイント生成
    var point = new Sprite(8, 8);
    point.image = game.assets['img/point.gif'];
    point.x = point_X;
    point.y = point_Y;
    point.frame = 0;
    point.tick = 60;
    game.rootScene.addChild(point);
    //ポイントの定期処理
    point.addEventListener(Event.ENTER_FRAME, function(){
      if(point.tick == 0){
        game.rootScene.removeChild(point);
      }
      point.tick--;
    });
  }
  //四角形の追加
  game.addRect = function(size_X, size_Y, departure_X, departure_Y){
    var sprite = new Sprite(size_X, size_Y);
    var surface = new Surface(size_X, size_Y);
    sprite.image = surface;
    sprite.x = departure_X;
    sprite.y = departure_Y;
    sprite.tick = 60;
    //四角形の定期処理 
    sprite.addEventListener(Event.ENTER_FRAME, function(){
      if(sprite.tick == 0){
        game.rootScene.removeChild(sprite);
      }
      sprite.tick--;
    });
    game.rootScene.addChild(sprite);
    surface.context.strokeStyle = "red";
    surface.context.strokeRect(0, 0, size_X, size_Y);
  }
  //ロード完了時に呼ばれる
  game.onload = function(){
    //背景の生成
    var bg = new Sprite(320, 320);
    bg.backgroundColor = "rgb(0,200,255)";
    game.rootScene.addChild(bg);
    //背景をタッチしたら
    bg.addEventListener(Event.TOUCH_START, function(e){
      //ブロックの呼び出し
      var point_X = Math.floor(e.x);
      var point_Y = Math.floor(e.y);
      game.addPoint(point_X, point_Y);
      //第1次点と第2次点の記録
      if(rect_flag == 0){
        //第1次点
        first_X = Math.floor(e.x);
        first_Y = Math.floor(e.y);
        rect_flag = 1;
      }else if(rect_flag == 1){
        //第2次点
        second_X =Math.floor(e.x);
        second_Y =Math.floor(e.y);
        rect_flag = 2;
      }
      //第1次点と第2次点から始点と終点を判定
      if(rect_flag == 2){
        if(first_X < second_X && first_Y < second_Y){
          //パターン1
          departure_X = first_X;
          departure_Y = first_Y;
          terminus_X = second_X;
          terminus_Y = second_Y;
        }else if(first_X < second_X && first_Y > second_Y){
          //パターン2
          departure_X = first_X;
          departure_Y = second_Y;
          terminus_X = second_X;
          terminus_Y = first_Y;
        }else if(first_X > second_X && first_Y > second_Y){
          //パターン3
          departure_X = second_X;
          departure_Y = second_Y;
          terminus_X = first_X;
          terminus_Y = first_Y;
        }else if(first_X > second_X && first_Y < second_Y){
          //パターン4
          departure_X = second_X;
          departure_Y = first_Y;
          terminus_X = first_X;
          terminus_Y = second_Y;
        }
        //四角形の大きさを計算
        size_X = terminus_X - departure_X;
        size_Y = terminus_Y - departure_Y;
        //四角形を呼び出し
        game.addRect(size_X, size_Y, departure_X, departure_Y);
        //四角形を初期化
        rect_flag = 0;
      }
    });
    //ラベルの生成
    label = new Label("");
    game.rootScene.addChild(label);
  }
  
  game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
    if(game.tick > 0){
      label.text = "制限時間：" + Math.floor(game.tick / game.fps) + "秒" + "<BR>SCORE:" + game.score;
    }else if(game.tick === 0){
      game.end(game.score, "あなたのスコアは" + game.score);
    }
    game.tick--;
  });
  game.start();
}
