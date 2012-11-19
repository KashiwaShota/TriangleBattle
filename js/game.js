/**
 * TriangleBattle v0.1.0
 *
 * The MIT License
 * 
 Copyright (c) 2012 alkaid_72th

 Permission is hereby granted, free of charge, to any person obtaining
 a copy of this software and associated documentation files (the
 "Software"), to deal in the Software without restriction, including
 without limitation the rights to use, copy, modify, merge, publish,
 distribute, sublicense, and/or sell copies of the Software, and to
 permit persons to whom the Software is furnished to do so, subject to
 the following conditions:

 The above copyright notice and this permission notice shall be
 included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS
 BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
 CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.
*/

/*
 * おまじない
 */
enchant();

/*
 * 定数
 */
var GAME_WIDTH = 320;//ゲームの幅
var GAME_HEIGHT = 320;//ゲームの高さ
var GAME_FPS = 30;//ゲームの更新速度
var HERO_CODE = "1:2:4:2506:21012:2203";//ヒーローのアバター
var RIVAL_CODE = "1:2:5:2514:21250:22940";//ライバルのアバター
var SAMPLE_BGM = "http://enchantjs.com/assets/sounds/bgm02.wav";

//手
var GU = 0;//グー
var TYOKI = 1;//チョキ
var PA = 2;//パー
var hoge = [GU, TYOKI, PA];
//結果
var success = 0;//成功
var cancel  = 1;//相殺
var failure = 2;//失敗

//相性テーブル
var affinitydata =[
  /*       　グー     チョキ   パー　*/
  /*グー　*/[cancel,  success, failure],
  /*チョキ*/[failure, cancel,  success],
  /*パー　*/[success, failure, cancel ]
];

/*
 * グローバル変数
 */
var game, scene, bg, hero, rival, attackPanel, specialPanel, counterPanel;
var heroType, rivalType;//攻撃の種類
var Flag = false;
var result, damage;
var heroText, rivalText, systemText, text;

/*
 * メイン処理
 */
window.onload=function(){
  game = new Game(320,320);//ゲームオブジェクト生成
  //画像読込
  game.preload('avatarBg1.png','avatarBg2.png','avatarBg3.png', 'img/panel.png', SAMPLE_BGM);
  //ロード完了時
  game.onload = function(){
    scene = game.rootScene;
    scene.backgroundColor="black";//背景色の黒にする
    
    //背景を生成・表示
    bg = new AvatarBG(1);
    bg.y = 50;
    scene.addChild(bg);

    game.assets[SAMPLE_BGM].volume = 0.1;
    
    //自分のラベル生成
    heroText = new Label("");
    heroText.font = "16px monospace";
    heroText.color = "rgb(255, 255, 255)";
    heroText.backgroundColor = "rgba(255, 200, 0, 0.6)";
    heroText.x = 160;
    heroText.y = 224;
    heroText.width = 160;
    heroText.height = 48;
    game.rootScene.addChild(heroText);
    
    //相手のラベル生成
    rivalText = new Label("");
    rivalText.font = "16px monospace";
    rivalText.color = "rgb(255, 255, 255)";
    rivalText.backgroundColor = "rgba(0, 200, 255, 0.6)";
    rivalText.x = 0;
    rivalText.y = 0;
    rivalText.width = 160;
    rivalText.height = 48;
    game.rootScene.addChild(rivalText);
    
    
    //システムのラベル
    systemText = new Label("");
    systemText.font = "16px monospace";
    systemText.color = "rgb(255, 255, 255)";
    systemText.backgroundColor = "rgba(0, 0, 0, 0.2)";
    systemText.x = 0;
    systemText.y = 272;
    systemText.width = 320;
    systemText.height = 16 * 3;
    game.rootScene.addChild(systemText);
    
    //主人公
    hero = new Avatar(HERO_CODE);   
    hero.moveTo(200, 140);//主人公の座標
    hero.scaleX *= -1;
    //主人公のステータス
    hero.hp = 10;
    hero.attack  = Math.floor(Math.random() * 3 + 1);
    hero.special = Math.floor(Math.random() * 3 + 1);
    hero.counter = Math.floor(Math.random() * 3 + 1);
    //主人公のフラグ
    hero.attackFlag = false;
    hero.damageFlag = false;
    //主人公のアクション
    hero.animPattern['att'] = [0,4,5,4,5,8,-1];
    hero.animPattern['spe'] = [0,6,6,6,15,14,13,9,9,9,10,11,-1];
    hero.animPattern['cou'] = [0,6,9,13,14,14,14,15,-1];
    scene.addChild(hero);//シーンへ挿入
    hero.addEventListener(Event.ENTER_FRAME, function(){
      //攻撃した時
      if(hero.attackFlag == true){
        switch(heroType){
          case GU    : hero.action = "att"; damage = hero.attack;  break;
          case TYOKI : hero.action = "spe"; damage = hero.special; break;
          case PA    : hero.action = "cou"; damage = hero.counter; break;
        }
        hero.tl.delay(30).then(function(){
          rival.damageFlag = true;
        });
        hero.attackFlag = false;
      }else
      //ダメージを受けたとき
      if(hero.damageFlag == true){
        hero.hp = hero.hp - damage;//体力を減らす
        //体力が残っているならば……
        if(hero.hp > 0){
          hero.action = "damage";//ダメージを受けるアニメーション
          hero.damageFlag = false;
        }else{//体力が0になったら……
          hero.hp = 0;
          hero.damageFlag = false;
          hero.action = "dead";//死亡アニメーション
          hero.tl.fadeOut(game.fps).then(function(){
            scene.removeChild(hero);
            game.end();
          });
        }
      }
    });
    
    //敵
    rival = new Avatar(RIVAL_CODE);
    rival.moveTo(64, 80);//主人公の座標
    //敵のステータス
    rival.hp = 10;
    rival.attack = Math.floor(Math.random() * 3 + 1);
    rival.special = Math.floor(Math.random() * 3 + 1);
    rival.counter = Math.floor(Math.random() * 3 + 1);
    rival.power = 0;
    //敵のフラグ
    rival.attackFlag = false;
    rival.damageFlag = false;
    //敵のアクション
    rival.animPattern['att'] = [0,4,5,4,5,8,-1];
    rival.animPattern['spe'] = [0,6,6,6,15,14,13,9,9,9,10,11,-1];
    rival.animPattern['cou'] = [0,6,9,13,14,14,14,15,-1];
    scene.addChild(rival);//シーンへ挿入
    rival.addEventListener(Event.ENTER_FRAME, function(){
      //攻撃した時
      if(rival.attackFlag == true){
        switch(rivalType){
          case GU    : rival.action = "att"; damage = rival.attack;  break;
          case TYOKI : rival.action = "spe"; damage = rival.special; break;
          case PA    : rival.action = "cou"; damage = rival.counter; break;
        }
        rival.tl.delay(30).then(function(){
          hero.damageFlag = true;
        });
        rival.attackFlag = false;
      }else
      //ダメージを受けたとき
      if(rival.damageFlag == true){
        rival.hp = rival.hp - damage;//体力を減らす
        //体力が残っているならば……
        if(rival.hp > 0){
          rival.action = "damage";//ダメージを受けるアニメーション
          rival.damageFlag = false;
        }else{//体力が0になったら……
          rival.hp = 0;
          rival.damageFlag = false;
          rival.action = "dead";//死亡アニメーション
          rival.tl.fadeOut(game.fps).then(function(){
            scene.removeChild(rival);
            game.end();
          });
        }
      }
    });

    //攻撃パネル
    attackPanel = new Sprite(32, 32);
    attackPanel.moveTo(60,157);
    attackPanel.image = game.assets['img/panel.png'];
    attackPanel.frame = 0;
    attackPanel.scale(2, 2);
    scene.addChild(attackPanel);
    attackPanel.addEventListener(Event.TOUCH_START, function(){
      heroType = GU;
      var hogeType = Math.floor(Math.random() * 2);
      rivalType = hoge[hogeType];
      Flag = true;
    });
    //必殺パネル
    specialPanel = new Sprite(32, 32);
    specialPanel.moveTo(15,222);
    specialPanel.image = game.assets['img/panel.png'];
    specialPanel.frame = 1;
    specialPanel.scale(2, 2);
    scene.addChild(specialPanel);
    specialPanel.addEventListener(Event.TOUCH_START, function(){
      heroType = TYOKI;
      var hogeType = Math.floor(Math.random() * 2);
      rivalType = hoge[hogeType];
      Flag = true;
    });
    //反撃パネル
    counterPanel = new Sprite(32, 32);
    counterPanel.moveTo(111,222);
    counterPanel.image = game.assets['img/panel.png'];
    counterPanel.frame = 2;
    counterPanel.scale(2, 2);
    scene.addChild(counterPanel);
    counterPanel.addEventListener(Event.TOUCH_START, function(){
      heroType = PA;
      var hogeType = Math.floor(Math.random() * 2);
      rivalType = hoge[hogeType];
      Flag = true;
    });
    
    //シーン定期処理
    scene.addEventListener(Event.ENTER_FRAME, function(){
      game.assets[SAMPLE_BGM].play();//BGMループ再生
      //主人公のステータス表示
      heroText.text = "自分 HP:" + hero.hp +
        "<br>攻：" + hero.attack + " 必：" + hero.special + " 反:" + hero.counter;
      //敵のステータス表示
      rivalText.text = "敵 HP:" + rival.hp +
        "<br>攻：" + rival.attack + " 必：" + rival.special + " 反:" + rival.counter;
      //じゃんけんされたら
      if(Flag == true){
        result = affinitydata[heroType][rivalType];//じゃんけんの結果を返す
        switch(result){
          case success: hero.attackFlag = true;  break;
          case cancel : break;
          case failure: rival.attackFlag = true; break;
        }
        Flag = false;
      }
      if(result == success){
        systemText.text = "攻撃成功!!<br>敵に" + damage + "のダメージを与えた<br>次の攻撃はどうする？";
      }else if(result == failure){
        systemText.text = "攻撃失敗!!<br>自分は" + damage + "のダメージを受けた<br>次の攻撃はどうする？";
      }else if(result == cancel){
        systemText.text = "攻撃が相殺された!!<br>次の攻撃はどうする？";
      }
    });
  };
  game.start();
}