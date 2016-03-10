var game = new Phaser.Game(480, 320, Phaser.AUTO, null, {preload: preload, create: create, update: update});
var ball;
var paddle;
var bricks;
var newBrick;
var brickInfo;
var scoreText;
var score = 0;
var startText;
var lossText;

function preload() {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.stage.backgroundColor = "#eee";
    //game.load.image('ball', './img/ball.png');
    game.load.image('paddle', './img/paddle.png');
    game.load.image('brick', './img/brick.png');
    game.load.spritesheet('ball', 'img/wobble.png', 20, 20);
}
function create() {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	ball = game.add.sprite(game.world.width*0.5, game.world.height-25, 'ball');
	ball.animations.add('wobble', [0,1,0,2,0,1,0,2,0], 24);
	paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
	paddle.anchor.set(0.5,1);
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1,1);
	//ball.body.velocity.set(150, -150);
	paddle.body.immovable = true;
	game.physics.arcade.checkCollision.down = false;

	ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add(ballLeaveScreen, this);
	innitBricks();

	scoreText = game.add.text(5, 5, 'Points: 0', { font: '18px Arial', fill: '#0095DD' });
	textStyle = { font: '18px Arial', fill: '#0095DD' };
	startText = game.add.text(game.world.width*0.5, game.world.height*0.5,'Clickt to Start!', textStyle);
    startText.anchor.set(0.5);
    game.input.onDown.addOnce(function(){
    	startText.visible = false;
    	ball.body.velocity.set(150, -150);
    }, this);

    lossText = game.add.text(game.world.width*0.5, game.world.height*0.5,'Loss, again?', textStyle);
    lossText.anchor.set(0.5);
    lossText.visible = false;
}
function update() {
	game.physics.arcade.collide(ball, paddle, ballHitPaddle);
	game.physics.arcade.collide(ball, bricks, ballHitBrick);
	paddle.x = game.input.x;
}
function innitBricks(){
	brickInfo = {
		width: 50,
		height: 20,
		count: {
			row: 7,
			col: 3
		},
		offset: {
			top: 50,
			left: 60
		},
		padding: 10
	}
	bricks = game.add.group();
	for(c=0; c<brickInfo.count.col; c++){
		for(r=0; r<brickInfo.count.row; r++){
			//creat new brick and add it to the group
            var brickX = (r*(brickInfo.width + brickInfo.padding)) + brickInfo.offset.left;
            var brickY = (c*(brickInfo.height + brickInfo.padding)) + brickInfo.offset.top;
            newBrick = game.add.sprite(brickX, brickY, 'brick');
            newBrick.anchor.set(0.5);
            game.physics.enable(newBrick, Phaser.Physics.ARCADE);
            newBrick.body.immovable = true;
            bricks.add(newBrick);
		}
	}
}
function ballHitBrick(ball, brick) {
	//brick.kill();
	var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
    }, this);
    killTween.start();
	score += 10;
	scoreText.setText('Point:' + score);
	if(score === brickInfo.count.row*brickInfo.count.col*10) {
		alert('You win!');
		location.reload();
	}
}
function ballLeaveScreen(){
	lossText.visible = true;
	game.input.onDown.addOnce(function(){
    	lossText.visible = false;
    	location.reload();
    }, this);
}
function ballHitPaddle(){
	ball.animations.play('wobble');
	ball.body.velocity.x = -1*5*(paddle.x-ball.x);
}