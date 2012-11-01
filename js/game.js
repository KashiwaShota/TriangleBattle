enchant();
window.onload = function() {
    var game = new Game(320, 320);
    game.preload('icon0.png');
    game.onload = function() {
        var dice = new Sprite(24 * 6, 34);
        dice.image = new Surface(24 * 6, 34);
        for (var i = 0; i < 6; i++) {
            dice.image.draw(makeFace(i+1).image,i*24,0);
        };
        game.rootScene.addChild(dice);
    };
    var makeFace = function(num) {
        var nums = new Array();
        num == 1 ? nums.push(64,80,96):
        num == 2 ? nums.push(80,96,144):
                  num == 3 ? nums.push(96,144,128):
                  num == 4 ? nums.push(112,128,64):
                  num == 5 ? nums.push(128,64,112):
                  num == 6 ? nums.push(144,112,80):nums.push(0,0,0);
/*
        switch(num) {
            case 1:
                nums.push(64,80,96);
                break;
            case 2:
                nums.push(80,96,144);
                break;
            case 3:
                nums.push(96,144,128);
                break;
            case 4:
                nums.push(112,128,64);
                break;
            case 5:
                nums.push(128,64,112);
                break;
            case 6:
                nums.push(144,112,80);
                break;
        };
*/
        var face = new Sprite(24, 34);
        face.image = new Surface(24, 34);
        with(face.image.context) {
            moveTo(12,0);
            lineTo(24,12);
            lineTo(24,24);
            lineTo(12,34);
            lineTo(0,24);
            lineTo(0,12);
            closePath();
            fill();
        };
        var rad = 45 * Math.PI / 180;
        // top
        face.image.context.setTransform(
            1,    // 横の比率 1が100%
            1,    // 縦軸の移動量
            -1,   // 横軸の移動量
            1,    // 縦の比率 1が100%
            12,   // ｘ軸の表示開始位置
            -5    // y軸の表示開始位置
        );
        face.image.draw(game.assets['icon0.png'],
                        nums[0],32,16,16,
                         0, 0,16,16);
        // left
        face.image.context.setTransform(
            1,    // 横の比率 1が100%
            1,    // 縦軸の移動量
            0,    // 横軸の移動量
            1,    // 縦の比率 1が100%
            -2,   // ｘ軸の表示開始位置
            7   // y軸の表示開始位置
        );
        face.image.draw(game.assets['icon0.png'],
                        nums[1],32,16,16,
                         0, 0,16,16);
        // right
        face.image.context.setTransform(
            1,    // 横の比率 1が100%
            -1,   // 縦軸の移動量
            0,    // 横軸の移動量
            1,    // 縦の比率 1が100%
            10,   // ｘ軸の表示開始位置
            23    // y軸の表示開始位置
        )
        face.image.draw(game.assets['icon0.png'],
                        nums[2],32,16,16,
                         0, 0,16,16);
        return face;
    };
    game.start();
};