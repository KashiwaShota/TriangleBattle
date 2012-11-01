//定数
var GAME_WINDOW = 320;//ゲーム外枠
var GAME_FPS = 60;//ゲームの更新頻度
var TIME = 60;//ゲームの制限時間(秒)
enchant();
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
  //アイテム関係の変数
  var item_X, item_Y, item_Frame,//座標と使用するフレーム
    item_Score, item_Rate, item_Time,//得点関係
    effect_Flag,//effect番号
    variation;//
  
  //ゲームオブジェクト
  var game = new Game(GAME_WINDOW, GAME_WINDOW);
  game.fps = GAME_FPS;//FPSの設定
  game.score = 0;//スコアの設定
  game.rate = 1;//得点レートの設定
  game.tick = game.fps * TIME;//制限時間の設定
  game.rect_flag = 0;//四角形描写フラグ
  game.collision_flag = false;//当たり判定フラグ
  game.preload('img/icon0.gif','img/point.gif','img/effect0.gif');//画像の読み込み
  game.se = Sound.load('se/bomb1.wav');

  //アイテム
  game.addItem = function(item_X, item_Y,item_Frame, item_Score, item_Rate, item_Time, effect_Flag){
    var item = new Sprite(16, 16);//生成
    item.image = game.assets['img/icon0.gif'];//画像指定
    //基本パラメータ
    item.frame = item_Frame;//画像で使用するアイコンの選択
    item.tick = 300;//表示される時間
    item.x = item_X; item.y = item_Y;//出現座標(ｘ、ｙ)
    //当たり判定用パラメータ
    item.coll_X; item.coll_Y;//四角形の座標
    item.collsize_X; item.collsize_Y;//四角形の大きさ
    //スコア関連パラメータ
    item.score = item_Score * game.rate;//得点
    item.rate = item_Rate;//レート
    item.time = item_Time * game.fps;//制限時間
    //画面へ表示
    game.rootScene.addChild(item);
    //定期処理
    item.addEventListener(Event.ENTER_FRAME, function(){
      //四角形出現時
      if(game.collision_flag == true){
        //当たり判定域の決定
        item.coll_X = departure_X; item.coll_Y = departure_Y;//四角形の座標を代入
        item.collsize_X = size_X; item.collsize_Y = size_Y; //四角形の大きさを代入
        //当たり判定
        if(item.coll_X < item.x && item.x < (item.coll_X + item.collsize_X) && 
        item.coll_Y < item.y && item.y < (item.coll_Y + item.collsize_Y)){
          //得点計算
          if((game.score + item.score) < 0){
            game.score = 0;//計算結果が0より小さくなったら結果を0にする
          }else{
            game.score += item.score;//通常に計算
          }
          //レート計算
          if((game.rate + item.rate) < 1){
            game.rate = 1;//計算結果が1より小さくなったら結果を1にする
          }else{
            game.rate += item.rate;//通常に計算
          }
          //時間計算
          if((game.tick + item.time) < 0){
            game.tick = 0;//計算結果が0より小さくなったら結果を0にする
          }else{
            game.tick += item.time;//通常に計算
          }
          //消滅時の判定
          if(effect_Flag == true){
            var blast_X = item.x;
            var blast_Y = item.y;
            game.se.play();//SEの再生
            game.addBlast(blast_X, blast_Y);//エフェクト関数の呼び出し
          }
          game.rootScene.removeChild(item);
        }else if(game.collision_flag == false){
          //当たり判定域を初期化
          item.coll_X = 0; item.coll_Y = 0;
          item.collsize_X = 0; item.collsize_Y = 0;
        }
      }
      //自壊判定
      if(item.tick == 0){
        game.rootScene.removeChild(item);
      }
      item.tick--;
    });
    //タッチ処理
    item.addEventListener(Event.TOUCH_START, function(e){
      game.rootScene.removeChild(item);
    });
  }

  //エフェクト
  game.addBlast = function(blast_X, blast_Y){
    var blast = new Sprite(16, 16);//生成
    blast.image = game.assets['img/effect0.gif'];//使用する画像の決定
    blast.x = blast_X; blast.y = blast_Y;//出現する座標
    blast.frame = 0;//使用する画像の場所
    blast.tick = 0;//主t原子手からの経過時間
    blast.duration = 40;//
    //画面へ表示
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

  //ターゲットポイント
  game.addPoint = function(first_X, first_Y){
    var point = new Sprite(8, 8);
    point.image = game.assets['img/point.gif'];
    point.x = first_X; point.y = first_Y;
    point.tick = 60;
    game.rootScene.addChild(point);
    game.addEventListener(Event.ENTER_FRAME, function(){
      if(point.tick === 0){
        game.rootScene.removeChild(point);
        game.rect_flag = 0;
      }
      if(game.rect_flag === 2){
        game.rootScene.removeChild(point);
      }
      point.tick--;
    });
  }

  //四角形
  game.addRect = function(size_X, size_Y, departure_X, departure_Y){
    sprite = new Sprite(size_X, size_Y);
    var surface = new Surface(size_X, size_Y);
    sprite.image = surface;
    sprite.x = departure_X; sprite.y = departure_Y;
    sprite.tick = 30;
    game.rootScene.addChild(sprite);
    surface.context.strokeStyle = "red";
    surface.context.strokeRect(0, 0, size_X, size_Y);
    //定期処理
    sprite.addEventListener(Event.ENTER_FRAME, function(){
      if(sprite.tick === 0){
        game.rect_flag = 0;
        game.rootScene.removeChild(sprite);
        game.collision_flag = false;
      }
      sprite.tick--;
    });
  }

  //ロード完了時呼び出し
  game.onload = function(){
    //背景の生成
    var bg = new Sprite(GAME_WINDOW, GAME_WINDOW);
    bg.backgroundColor = "rgb(0, 200, 255)";
    game.rootScene.addChild(bg);
    
    bg.addEventListener(Event.TOUCH_START, function(e){
      //四角形の描写準備
      if(game.rect_flag === 0){
        //第1次点の座標決定とターゲットポイントの呼び出し
        first_X = Math.floor(e.x); first_Y = Math.floor(e.y);
        game.addPoint(first_X, first_Y);
        game.rect_flag = 1;//四角形描写を1へ状態遷移
      }else if(game.rect_flag === 1){
        //第2次点の座標決定
        second_X = Math.floor(e.x); second_Y = Math.floor(e.y);
        game.rect_flag = 2;//四角形描写を2へ状態遷移
      }
      if(game.rect_flag === 2){
        //四角形の描写パターンを走査する
        if(first_X < second_X && first_Y < second_Y){
          //パターン1
          departure_X = first_X; departure_Y = first_Y;//始点
          terminus_X = second_X; terminus_Y = second_Y;//終点
        }else if(first_X < second_X && first_Y > second_Y){
          //パターン2
          departure_X = first_X; departure_Y = second_Y;//始点
          terminus_X = second_X; terminus_Y = first_Y;//終点
        }else if(first_X > second_X && first_Y > second_Y){
          //パターン3
          departure_X = second_X; departure_Y = second_Y;//始点
          terminus_X = first_X; terminus_Y = first_Y;//終点
        }else if(first_X > second_X && first_Y < second_Y){
          //パターン4
          departure_X = second_X; departure_Y = first_Y;//始点
          terminus_X = first_X; terminus_Y = second_Y;//終点
        }
        //四角形の大きさを計算する
        size_X = terminus_X - departure_X;
        size_Y = terminus_Y - departure_Y;
        //四角形呼び出し
        game.addRect(size_X, size_Y, departure_X, departure_Y);
        game.collision_flag = true;
      }
    });

    //ラベルの生成
    label = new Label("");
    game.rootScene.addChild(label);
    
    //定期処理
    game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
      if(game.tick > 0){
        //アイテムの種類や座標を決定する
        if((game.tick % 20) === 0){
          item_X = Math.floor(Math.random() * 300);//0～300の乱数
          item_Y = Math.floor(Math.random() * 260 + 40);//40～300の乱数
          variation = Math.floor(Math.random() * 99);//0～99の乱数
          //variationに対応したアイテムのパラメータを引数とする
          if(variation >= 90){
            //低確率
            if((variation % 3) == 0){
              //サイコロ
              item_Frame = 35;
              //-5～6の値を出す
              item_Score = Math.floor(Math.random() * 11 - 5);//スコア
              item_Rate = Math.floor(Math.random() * 11 - 5);//レート
              item_Time = Math.floor(Math.random() * 11 - 5);//時間
              effect_Flag = false;
            }else if((variation % 3) == 1){
              //王冠
              item_Frame = 31;
              item_Score = 20; item_Rate = 5; item_Time = 0;
              effect_Flag = false;
            }else if((variation % 3) == 2){
              //着火爆弾
              item_Frame = 24;
              item_Score = -5; item_Rate = -5; item_Time = 0;
              effect_Flag = true;
            }
          }else if(variation >= 60 && variation <= 89){
            //中確率
            if((variation % 3) == 0){
              //星
              item_Frame = 30;
              item_Score = 10; item_Rate = 0; item_Time = 0;
              effect_Flag = false;
            }else if((variation % 3) == 1){
              //時計
              item_Frame = 34;
              item_Score = 0; item_Rate = 0; item_Time = 1;
              effect_Flag = false;
            }else if((variation % 3) == 2){
              //ダイナマイト
              item_Frame = 26;
              item_Score = 0; item_Rate = 0; item_Time = -2;
              effect_Flag = true;
            }
          }else if(variation < 60){
            //高確率
            if((variation % 2) == 0){
              //コイン
              item_Frame = 14;
              item_Score = 5; item_Rate = 0; item_Time = 0;
              effect_Flag = false;
            }else if((variation % 2) == 1){
              //爆弾
              item_Frame = 25;
              item_Score = -1; item_Rate = 0; item_Time = 0;
              effect_Flag = true;
            }
          }
          //アイテム関数を呼び出す
          game.addItem(item_X, item_Y,item_Frame, item_Score, item_Rate, item_Time, effect_Flag);
        }
        //ラベルの情報を表示
        label.text = "制限時間：" + Math.floor(game.tick / game.fps) + "秒" + 
        "<BR>RATE ×" + game.rate + "<BR>SCORE:" + game.score;
      }else if(game.tick === 0){
        game.end(game.score, "あなたのスコアは" + game.score + "点です!!");
      }
      game.tick--;
    });
  }
  game.start();
}
//乱数生成
function rand(num){
  return Math.floor(Math.random() * num);
}
