//定数
var GAME_WINDOW = 320;//ゲーム外枠
var GAME_FPS = 60;//ゲームの更新頻度
var ITEM_VARIATION = 4;//ゲームに登場するアイテムの種類
var TIME = 60;//ゲームの制限時間(秒)

enchant()
/*
//時限爆弾(#26)
var TimeBomb = enchant.Class.create(enchant.Sprite, {
  initialaize:function(x, y){
    enchant.Sprite.call(this.\, 16, 16);
    this.image = game.assets['img/icon0.gif'];
    this.x = x; this.y = y; this.frame = 26; this.tick = 300;
    this.addEventListener('enterframe', function(){
      //四角形と接触したら
      if(){
        var blast = new Blast(this.x, this,y);
        this.remove();
        game.tick -= 60;
      }
      //賞味期限が切れたら
      if(this.tick == 0){this.remove();}
      this.tick--;
    });
  }
});

//爆発エフェクト
var Blast = enchant.Class.create(encaht.Sprite,{
  initalize:function(x, y){
   enchant.Sprite.call(this, 16, 16);
   this.x = x;
   this.y = y;
   this.image = game.assets['img/effect0.gif'];
   this.time = 0;
   //アニメーションの遅れ
   this.duration = 20;
   this.frame = 0;
   this.addEventListener('enterframe', function(){
     this.time++;
     //爆発アニメーション
     this.frame = Math.floor(this.time/this.duration * 5);
     if(this.time == this.duration)this.remove();
   });
   game.rootScene.addChild(this);
  },
  remove:function(){
    game.rootScene.removeChild(this);
  }
});
*/




window.onload = function(){
  //グローバル変数
  var label;//ラベル
  var sprite;
  //四角形関係の変数
  var first_X, first_Y,//第1次点
    second_X, second_Y,//第2次点
    departure_X, departure_Y,//始点
    terminus_X, terminus_Y,//終点
    size_X, size_Y;//サイズ
  
  //ゲームオブジェクト
  var game = new Game(GAME_WINDOW, GAME_WINDOW);
  game.fps = GAME_FPS;//FPSの設定
  game.score = 0;//スコアの設定
  game.rate = 1;//得点レートの設定
  game.tick = game.fps * TIME;//制限時間の設定
  game.rect_flag = 0;//四角形の描写フラグ
  game.preload('img/icon0.gif','img/point.gif');//画像の読み込み
  
  //
  game.addTimebar = function(time_X){
    sprite =
  }
  
  //ポイント
  game.addPoint = function(first_X, first_Y){
    //生成
    var point = new Sprite(8, 8);
    point.image = game.assets['img/point.gif'];
    point.x = first_X;
    point.y = first_Y;
    point.tick = 120;
    game.rootScene.addChild(point);
    //定期処理
    game.addEventListener(Event.ENTER_FRAME, function(){
      if(game.rect_flag > 1){
        game.rootScene.removeChild(point);
      }
    });
  }
  
  //コイン(＃14)
  game.addCoin = function(item_X, item_Y){
    //生成
    var coin = new Sprite(16, 16);
    coin.image = game.assets['img/icon0.gif'];
    coin.x = item_X;
    coin.y = item_Y;
    coin.frame = 14;
    coin.tick = 300;
    game.rootScene.addChild(coin);
    //定期処理
    coin.addEventListener(Event.ENTER_FRAME, function(){
      //四角形と触れたら
      if(departure_X < coin.x && coin.x < (departure_X + size_X) &&
        departure_Y < coin.y && coin.y < (departure_Y + size_Y)){
        game.score += game.rate * 5;
        game.rootScene.removeChild(coin);
      }
      //賞味期限切れ
      if(coin.tick == 0){
        game.rootScene.removeChild(coin);
      }
      coin.tick--;
    });
  }
  
 //四角形の追加
  game.addRect = function(size_X, size_Y, departure_X, departure_Y){
    sprite = new Sprite(size_X, size_Y);
    var surface = new Surface(size_X, size_Y);
    sprite.image = surface;
    sprite.x = departure_X;
    sprite.y = departure_Y;
    sprite.tick = 60;
    //四角形の定期処理 
    sprite.addEventListener(Event.ENTER_FRAME, function(){
      if(sprite.tick == 0){
        departure_X = 0;
        departure_Y = 0;
        size_X = 0;
        size_Y = 0;
        //四角形を初期化
        game.rect_flag = 0;
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
      //第1次点と第2次点の記録
      if(game.rect_flag == 0){
        //第1次点
        first_X = Math.floor(e.x);
        first_Y = Math.floor(e.y);
        game.addPoint(first_X, first_Y);
        game.rect_flag = 1;
      }else if(game.rect_flag == 1){
        //第2次点
        second_X =Math.floor(e.x);
        second_Y =Math.floor(e.y);
        game.rect_flag = 2;
      }
      //第1次点と第2次点から始点と終点を判定
      if(game.rect_flag == 2){
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
      }
    });
    //ラベルの生成
    label = new Label("");
    game.rootScene.addChild(label);
  }
  
  //シーン定期処理
  game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
    if(game.tick > 0){
      //アイテムを出現させる
      if((game.tick % 20) ===0){
        var item_X = Math.floor(Math.random() * 300);
        var item_Y = Math.floor(Math.random() * 260 + 40);
        
        game.addCoin(item_X, item_Y);
      }
      //ラベルの情報を表示
      label.text = "制限時間：" + Math.floor(game.tick / game.fps) + "秒" + 
        "<BR>RATE ×" + game.rate + "<BR>SCORE:" + game.score;
    }else if(game.tick === 0){
      game.end(game.score, "あなたのスコアは" + game.score);
    }
    game.tick--;
  });
  game.start();
}
