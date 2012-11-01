//定数
var GAME_WINDOW = 320;//ゲーム外枠
var GAME_FPS = 60;//ゲームの更新頻度
var ITEM_VARIATION;//ゲームに登場するアイテムの種類
var TIME = 60;//ゲームの制限時間(秒)
enchant()
window.onload = function(){
  //グローバル変数
  var label;//ラベル
  var sprite;//四角形
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
  game.rect_flag = 0;//四角形描写フラグ
  game.collision_flag = false;//当たり判定フラグ
  game.preload('img/icon0.gif','img/point.gif','img/effect0.gif');//画像の読み込み
  game.se = Sound.load('http://enchantjs.com/assets/sounds/bomb1.wav');
  
  //ターゲットポイント
  game.addPoint = function(first_X, first_Y){
    //生成
    var point = new Sprite(8, 8);
    point.image = game.assets['img/point.gif'];
    point.x = first_X;
    point.y = first_Y;
    game.rootScene.addChild(point);
    //定期処理
    game.addEventListener(Event.ENTER_FRAME, function(){
      if(game.rect_flag > 1){
        game.rootScene.removeChild(point);
      }
    });
  }
  //四角形の追加
  game.addRect = function(size_X, size_Y, departure_X, departure_Y){
    sprite = new Sprite(size_X, size_Y);
    var surface = new Surface(size_X, size_Y);
    sprite.image = surface;
    sprite.x = departure_X;
    sprite.y = departure_Y;
    sprite.tick = 30;
    //四角形の定期処理
    sprite.addEventListener(Event.ENTER_FRAME, function(){
      if(sprite.tick == 0){
        departure_X = 0;
        departure_Y = 0;
        size_X = 0;
        size_Y = 0;
        //四角形を初期化
        game.rect_flag = 0;
        game.collision_flag = false;
        game.rootScene.removeChild(sprite);
      }
      sprite.tick--;
    });
    game.rootScene.addChild(sprite);
    surface.context.strokeStyle = "red";
    surface.context.strokeRect(0, 0, size_X, size_Y);
  }
  
  //高確率
  //コイン(＃14)
  game.addCoin = function(item_X, item_Y){
    //生成
    var coin = new Sprite(16, 16);
    coin.image = game.assets['img/icon0.gif'];
    coin.x = item_X;
    coin.y = item_Y;
    coin.coll_X = 0;
    coin.coll_Y = 0;
    coin.collsize_X = 0;
    coin.collsize_Y = 0;
    coin.frame = 14;
    coin.tick = 300;
    game.rootScene.addChild(coin);
    //定期処理
    coin.addEventListener(Event.ENTER_FRAME, function(){
      //当たり判定域の決定
      if(game.collision_flag == true){
        //四角形が出現したら
        coin.coll_X = departure_X;
        coin.coll_Y = departure_Y;
        coin.collsize_X = size_X;
        coin.collsize_Y = size_Y;
        //当たり判定
        if(coin.coll_X < coin.x && coin.x < (coin.coll_X + coin.collsize_X) &&
        coin.coll_Y < coin.y && coin.y < (coin.coll_Y + coin.collsize_Y)){
          game.score += game.rate * 5;
          game.rootScene.removeChild(coin);
        }
      }else if(game.collision_flag == false){
        //四角形が出現してなかったら
        coin.coll_X = 0;
        coin.coll_Y = 0;
        coin.collsize_X = 0;
        coin.collsize_Y = 0;
      }
      //自壊
      if(coin.tick == 0){
        game.rootScene.removeChild(coin);
      }
      coin.tick--;
    });
    //タッチ時の処理
    coin.addEventListener(Event.TOUCH_START, function(){
      game.rootScene.removeChild(coin);
    });
  }

  //爆弾(＃25)
  game.addBomb = function(item_X, item_Y){
    //生成
    var bomb = new Sprite(16, 16);
    bomb.image = game.assets['img/icon0.gif'];
    bomb.x = item_X;
    bomb.y = item_Y;
    bomb.coll_X = 0;
    bomb.coll_Y = 0;
    bomb.collsize_X = 0;
    bomb.collsize_Y = 0;
    bomb.frame = 25;
    bomb.tick = 300;
    game.rootScene.addChild(bomb);
    //定期処理
    bomb.addEventListener(Event.ENTER_FRAME, function(){
      //当たり判定域の決定
      if(game.collision_flag == true){
        //四角形が出現したら
        bomb.coll_X = departure_X;
        bomb.coll_Y = departure_Y;
        bomb.collsize_X = size_X;
        bomb.collsize_Y = size_Y;
        //当たり判定
        if(bomb.coll_X < bomb.x && bomb.x < (bomb.coll_X + bomb.collsize_X) &&
        bomb.coll_Y < bomb.y && bomb.y < (bomb.coll_Y + bomb.collsize_Y)){
          game.score -= game.rate * 5;
          if(game.score < 0){
            game.score = 0;
          }
          var blast_X = bomb.x;
          var blast_Y = bomb.y;
          game.se.play();
          game.addBlast(blast_X, blast_Y);
          game.rootScene.removeChild(bomb);
        }
      }else if(game.collision_flag == false){
        //四角形が出現してなかったら
        bomb.coll_X = 0;
        bomb.coll_Y = 0;
        bomb.collsize_X = 0;
        bomb.collsize_Y = 0;
      }
      //自壊
      if(bomb.tick == 0){
        game.rootScene.removeChild(bomb);
      }
      bomb.tick--;
    });
    //タッチ時の処理
    bomb.addEventListener(Event.TOUCH_START, function(){
      game.rootScene.removeChild(bomb);
    });
  }

  //中確率
  //スター(＃30)
  game.addStar = function(item_X, item_Y){
    //生成
    var star = new Sprite(16, 16);
    star.image = game.assets['img/icon0.gif'];
    star.x = item_X;
    star.y = item_Y;
    coin.coll_X = 0;
    coin.coll_Y = 0;
    coin.collsize_X = 0;
    coin.collsize_Y = 0;
    star.frame = 30;
    star.tick = 300;
    game.rootScene.addChild(star);
    //定期処理
    star.addEventListener(Event.ENTER_FRAME, function(){
      //当たり判定域の決定
      if(game.collision_flag == true){
        //四角形が出現したら
        coin.coll_X = departure_X;
        coin.coll_Y = departure_Y;
        coin.collsize_X = size_X;
        coin.collsize_Y = size_Y;
        //当たり判定
        if(coin.coll_X < coin.x && coin.x < (coin.coll_X + coin.collsize_X) &&
        coin.coll_Y < coin.y && coin.y < (coin.coll_Y + coin.collsize_Y)){
          game.score += game.rate * 5;
          game.rootScene.removeChild(coin);
        }
      }else if(game.collision_flag == false){
        //四角形が出現してなかったら
        coin.coll_X = 0;
        coin.coll_Y = 0;
        coin.collsize_X = 0;
        coin.collsize_Y = 0;
      }
      if(star.tick == 0){
        game.rootScene.removeChild(star);
      }
      star.tick--;
    });
    //タッチ時の処理
    star.addEventListener(Event.TOUCH_START, function(){
      game.score += game.rate * 10;
      game.rootScene.removeChild(star);
    });
  }
  
  //時限爆弾(＃26)
  game.addTimeBomb = function(item_X, item_Y){
    //生成
    var timebomb = new Sprite(16, 16);
    timebomb.image = game.assets['img/icon0.gif'];
    timebomb.x = item_X;
    timebomb.y = item_Y;
    timebomb.frame = 26;
    timebomb.tick = 300;
    game.rootScene.addChild(timebomb);
    //定期処理
    timebomb.addEventListener(Event.ENTER_FRAME, function(){
      if(timebomb.tick == 0){
        game.rootScene.removeChild(timebomb);
      }
      timebomb.tick--;
    });
    //タッチ時の処理
    timebomb.addEventListener(Event.TOUCH_START, function(){
      game.tick -= game.fps * 2;
      var blast_X = timebomb.x;
      var blast_Y = timebomb.y;
      game.se.play();
      game.addBlast(blast_X, blast_Y);
      game.rootScene.removeChild(timebomb);
    });
  }

  //時計(＃26)
  game.addWatch = function(item_X, item_Y){
    //生成
    var watch = new Sprite(16, 16);
    watch.image = game.assets['img/icon0.gif'];
    watch.x = item_X;
    watch.y = item_Y;
    watch.frame = 34;
    watch.tick = 300;
    game.rootScene.addChild(watch);
    //定期処理
    watch.addEventListener(Event.ENTER_FRAME, function(){
      if(watch.tick == 0){
        game.rootScene.removeChild(watch);
      }
      watch.tick--;
    });
    //タッチ時の処理
    watch.addEventListener(Event.TOUCH_START, function(){
      game.tick += game.fps;
      game.rootScene.removeChild(watch);
    });
  }  

  //低確率
  //王冠(＃31)
  game.addCrown = function(item_X, item_Y){
    //生成
    var crown = new Sprite(16, 16);
    crown.image = game.assets['img/icon0.gif'];
    crown.x = item_X;
    crown.y = item_Y;
    crown.frame = 31;
    crown.tick = 300;
    game.rootScene.addChild(crown);
    //定期処理
    crown.addEventListener(Event.ENTER_FRAME, function(){
      if(crown.tick == 0){
        game.rootScene.removeChild(crown);
      }
      crown.tick--;
    });
    //タッチ時の処理
    crown.addEventListener(Event.TOUCH_START, function(){
      game.score += game.rate * 20;
      game.rate += 5;
      game.rootScene.removeChild(crown);
    });
  }
  
  //着火爆弾(＃24)
  game.addFireBomb = function(item_X, item_Y){
    //生成
    var firebomb = new Sprite(16, 16);
    firebomb.image = game.assets['img/icon0.gif'];
    firebomb.x = item_X;
    firebomb.y = item_Y;
    firebomb.frame = 24;
    firebomb.tick = 300;
    game.rootScene.addChild(firebomb);
    //定期処理
    firebomb.addEventListener(Event.ENTER_FRAME, function(){
      if(firebomb.tick == 0){
        game.rootScene.removeChild(firebomb);
      }
      firebomb.tick--;
    });
    //タッチ時の処理
    firebomb.addEventListener(Event.TOUCH_START, function(){
      game.score -= game.rate * 10;
      if(game.score < 0){
        game.score = 0;
      }
      game.rate -= 5;
      if(game.rate < 0){
        game.rate = 1;
      }
      var blast_X = firebomb.x;
      var blast_Y = firebomb.y;
      game.se.play();
      game.addBlast(blast_X, blast_Y);
      game.rootScene.removeChild(firebomb);
    });
  }
  
  //サイコロ(＃35)
  game.addDice = function(item_X, item_Y){
    //生成
    var dice = new Sprite(16, 16);
    dice.image = game.assets['img/icon0.gif'];
    dice.x = item_X;
    dice.y = item_Y;
    dice.frame = 35;
    dice.tick = 300;
    dice.score_A = Math.floor(Math.random() * 5 + 1);
    dice.score_B = Math.floor(Math.random() * 5 + 1);
    dice.rate_A = Math.floor(Math.random() * 5 + 1);
    dice.rate_B = Math.floor(Math.random() * 5 + 1);
    dice.time_A = Math.floor(Math.random() * 5 + 1);
    dice.time_B = Math.floor(Math.random() * 5 + 1);
    dice.time = 0;
    game.rootScene.addChild(dice);
    //定期処理
    dice.addEventListener(Event.ENTER_FRAME, function(){
      if(dice.tick == 0){
        game.rootScene.removeChild(dice);
      }
      dice.tick--;
    });
    //タッチ時の処理
    dice.addEventListener(Event.TOUCH_START, function(){
      //スコア計算
      game.score += (dice.score_A - dice.score_B) * game.rate;
      //レート計算
      game.rate += (dice.rate_A - dice.rate_B);
      if(game.rate <= 0){
        game.rate = 1;
      }
      //時間計算
      dice.time += (dice.time_A - dice.time_B);
      //時間が減少する時
      if(dice.time < 0){        
        var blast_X = dice.x;
        var blast_Y = dice.y;
        game.se.play();
        game.addBlast(blast_X, blast_Y);
      }
      game.tick += dice.time * game.fps;
      game.rootScene.removeChild(dice);
    });
  }

  //エフェクト
  //爆発エフェクト
  game.addBlast = function(blast_X, blast_Y){
    //生成
    var blast = new Sprite(16, 16);
    blast.image = game.assets['img/effect0.gif'];
    blast.x = blast_X;
    blast.y = blast_Y;
    blast.frame = 0;
    blast.tick = 0;
    blast.duration = 40;
    game.rootScene.addChild(blast);
    //定期処理
    blast.addEventListener(Event.ENTER_FRAME, function(){
      blast.tick++;
      blast.frame = Math.floor(blast.tick / blast.duration * 5);
      if(blast.tick == blast.duration){
        game.rootScene.removeChild(blast);
      }
    });
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
        game.collision_flag = true;
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
        var item_X = Math.floor(Math.random() * 300);//0～300の乱数
        var item_Y = Math.floor(Math.random() * 260 + 40);//40～300の乱数
        game.addCoin(item_X, item_Y);
        /*
        //出現アイテムのランク決定
        var select = Math.floor(Math.random() * 99);//0～99の乱数
        //出現
        if(select >= 90){
          //低確率
          ITEM_VARIATION = Math.floor(Math.random() * 3);
          if(ITEM_VARIATION == 0){
            game.addCrown(item_X, item_Y);
          }else if(ITEM_VARIATION == 1){
            game.addFireBomb(item_X, item_Y);
          }else if(ITEM_VARIATION == 2){
            game.addDice(item_X, item_Y);
          }
        }else if(select >= 60 && select <= 89){
          //中確率
          ITEM_VARIATION = Math.floor(Math.random() *3);
          if(ITEM_VARIATION == 0){
            game.addStar(item_X, item_Y);
          }else if(ITEM_VARIATION == 1){
            game.addTimeBomb(item_X, item_Y);
          }else if(ITEM_VARIATION == 2){
            game.addWatch(item_X, item_Y);
          }
        }else if(select < 60){
          //高確率
          ITEM_VARIATION = Math.floor(Math.random() * 3);
          if(ITEM_VARIATION == 0){
            game.addCoin(item_X, item_Y);
          }else if(ITEM_VARIATION == 1){
            game.addCoin(item_X, item_Y);
          }else if(ITEM_VARIATION == 2){
            game.addBomb(item_X, item_Y);
          }
        }*/
      }
      //ラベルの情報を表示
      label.text = "制限時間：" + Math.floor(game.tick / game.fps) + "秒" + 
        "<BR>RATE ×" + game.rate + "<BR>SCORE:" + game.score;
    }else if(game.tick <= 0){
      game.end(game.score, "あなたのスコアは" + game.score);
    }
    game.tick--;
  });
  game.start();
}
//乱数生成
function rand(num){
  return Math.floor(Math.random() * num);
}
