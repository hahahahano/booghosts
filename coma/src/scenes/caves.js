/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';
export default class Caves extends Phaser.Scene {
  constructor () {
    super('caves');
  }

  preload() {
    this.load.image('background', "./assets/images/cave_bg_test001.jpg",{
      frameWidth: 2500, //432
      frameHeight: 4224, // 32
    });
    this.load.image('ledge1', "./assets/sprites/cave1.png");
    this.load.image('ground', "./assets/sprites/base1.png");
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.spritesheet('ghost', "./assets/spriteSheets/Ghost.png", {
      frameWidth: 462,
      frameHeight: 719
    });
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/large_spirit.png", {
      frameWidth: 404,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.player;
    this.mems;
    var platforms;
    this.cursors;
    this.score = 0;
    this.gameOver = false;
    this.scoreText;
    this.sm_spirits;

    //Background
    this.add.image(1280/2, 960/2, 'background');

    //The platforms group contains the ground and the ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //Ground
    platforms
      .create(500, 1050 , 'ground')
      .setScale(1)
      .refreshBody();

    //Ledges
    platforms
      .create(600, 450, 'ledge1')
      .setScale(.2)
      .refreshBody();

    platforms
      .create(900, 600, 'ledge1')
      .setScale(.2)
      .refreshBody();

    platforms
      .create(1100, 800, 'ledge1')
      .setScale(.3)
      .refreshBody();

    platforms
      .create(100, 400, 'ledge1')
      .setScale(0.3)
      .refreshBody();


    //Creates player character
    this.player = this.physics.add.sprite(300, 840, 'ghost');
    this.player.setScale(.15);
    this.player.setCollideWorldBounds(true);
    this.physics.world.setBounds(0, 0, 1280, 960);

    //Gravity for this scene
    this.physics.world.gravity.y = 300;

    //Player Animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('ghost', {start: 0, end: 0}),
      framerate: 10,
      repeat: -1
    });
    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('ghost', {start: 0, end: 0}),
      framerate: 10,
      repeat: -1
    });

    //Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    //Memory Pieces
    this.mems = this.physics.add.group([
      {key: 'mem_piece',
      setXY: { x: 50, y: 321}},
      {key: 'mem_piece',
      setXY: { x: 1200, y: 722}}
      ]);


    //Memories Collected
    this.scoreText = this.add.text(16, 16, "Memories: 0", {
      fontSize: "32px",
      fill: "#000"
    });

    //Collide the player and the memory pieces with the platforms
    this.physics.add.collider(this.player, platforms);
    this.physics.add.collider(this.mems, platforms);

    //Set main camera's bounraries and tell it follow the player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1280, 960);

    //Checks to see if the player overlaps with any of the memory pieces, if it does call the collectMem function
    this.physics.add.overlap(
      this.player,
      this.mems,
      this.collectMem,
      null,
      this
    );

    //Creates small spirits
    //this.sm_spirits = this.physics.add
  }

  update() {
    if (this.gameOver) {
      this.scene.start('GameOverScene',{score: this.score });
      return;
    }

    var cursors = this.input.keyboard.createCursorKeys();
    var speed = 5;

    if (cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    } else if (cursors.right.isDown){
      this.player.setVelocityX(160);
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    }else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
    }
    if (cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    } /*else if (cursors.down.isDown){
      this.player.setVelocityY(500);
    }*/
  }

  //Collecting a memory
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    //Update the score
    this.score += 1;
    this.scoreText.setText("Memories: " + this.score);

    if (this.mems.countActive(true) === 0) {
      this.gameOver = true
      };
  }

}
