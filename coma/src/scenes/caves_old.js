/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';
export default class Caves extends Phaser.Scene {
  constructor () {
    super('caves');
  }

  init (data) {
    //For later scenes
  }

  preload() {
    //BACKGROUND AND FOREGROUND
    this.load.image('background', "./assets/images/cave_bg_test001.jpg",{
      frameWidth: 2500, //432
      frameHeight: 4224, // 32
    });
    this.load.image('foreground', "./assets/images/cave_fg_test002.png",{
      frameWidth: 2500, //432
      frameHeight: 3513, // 32
    });

    //PLATFORMS
    /*     Old Platforms
    this.load.image('ledge1', "./assets/sprites/cave_platform01.png");
    this.load.image('ground', "./assets/sprites/base1.png");
    */

    this.load.image('tiles', "./assets/sprites/cave_platform02.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/cave_tilemap1.json")

    //Objects
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('body', "./assets/sprites/star.png");

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('ghost', "./assets/spriteSheets/run_spritesheet.png", {
      frameWidth: 148,
      frameHeight: 200
    });
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });

    //MUSIC/SOUNDS
    this.load.audio('cave_music1', "./assets/music/obsession_slowmix.wav");
  }

  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.player;
    this.sm_spirit1;
    this.lg_spirit;

    this.mems;
    this.body;

    var platforms;
    this.cursors;
    this.score = 0;
    this.scoreText;

    this.gameOver = false;
    
//////////////////////////////////////////////////////////////////////////////////////
    //Background
    const background = this.add.image(800, 960/2, 'background');
    background.setDepth(-10);
    this.physics.world.setBounds(0, 0, 1500, 1900);

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('cave_platform02', 'tiles');
    const worldLayer = map.createStaticLayer('platforms', tileset, 100, -1300);
    worldLayer.setCollisionByProperty({ collides: true });

    /*
    //The platforms group contains the ground and the ledges we can jump on
    platforms = this.physics.add.staticGroup();

    //Ground
    platforms
      .create(800, 1950, 'ledge1')
      .setScale(1)
      .refreshBody();

    //Ledges
    platforms
      .create(1500, 400, 'ledge1')
      .setScale(.5)
      .refreshBody();
    platforms
      .create(50, 850, 'ledge1')
      .setScale(0.3)
      .refreshBody();
    platforms
      .create(700, 600, 'ledge1')
      .setScale(.3)
      .refreshBody();
    platforms
      .create(1200, 850, 'ledge1')
      .setScale(.3)
      .refreshBody();
    platforms
      .create(600, 1100, 'ledge1')
      .setScale(.5)
      .refreshBody();
    platforms
      .create(1450, 1300, 'ledge1')
      .setScale(0.4)
      .refreshBody();
    platforms
      .create(1250, 1500, 'ledge1')
      .setScale(.5)
      .refreshBody();
    platforms
      .create(500, 1650, 'ledge1')
      .setScale(.3)
      .refreshBody();
    */

    //Foreground test
    const foreground = this.add.image(550, 50, 'foreground');
    foreground.setDepth(10);

//////////////////////////////////////////////////////////////////////////////////
    //Creates small spirits
    this.sm_spirit1 = this.physics.add.sprite(500, 900, 'sm_spirit');
    this.sm_spirit1.setScale(0.15);
    this.sm_spirit1.setCollideWorldBounds(true);

    this.tweens.add({
      targets: this.sm_spirit1,
      x: 900,
      ease: 'Linear',
      yoyo: true,
      duration: 5000,
      repeat: -1
    });

    //Creates large spirit
    this.lg_spirit = this.physics.add.sprite(1370, 1125, 'lg_spirit');
    this.lg_spirit.setScale(0.4);
    this.lg_spirit.setCollideWorldBounds(true);

    this.anims.create({
      key: 'idle_sp',
      frames: this.anims.generateFrameNumbers('lg_spirit', {start: 0, end: 2}),
      duration: 850,
      yoyo: true,
      repeat: -1
    });

    //Creates player character
    this.player = this.physics.add.sprite(100, 1500, 'ghost');
    this.player.setScale(.6);
    this.player.setCollideWorldBounds(true);
    

    //Player Animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('ghost', {start: 1, end: 3}),
      frameRate: 4,
      repeat: 0,

    });

    this.anims.create({
      key: 'idle',
      frames: this.anims.generateFrameNumbers('ghost', {start: 0, end: 0}),
      framerate: 10,
      repeat: -1
    });

    //Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    //Set main camera's bounraries and tells it follow the player
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1500, 1900);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

    //Memory Pieces
    this.mems = this.physics.add.group([
      {key: 'mem_piece',
      setXY: { x: 50, y: 321}},
      {key: 'mem_piece',
      setXY: { x: 1200, y: 722}}
      ]);

    //Memories Collected: Need to fix ==> make it follow the cameras~
    this.scoreText = this.add.text(16, 16, "Memories: 0", {
      fontSize: "32px",
      fill: "#000"
    });

    //Creates ghost's human body (it's a star for now)
    this.body = this.physics.add.sprite(1400, 270, 'body');
    this.body.setCollideWorldBounds(true);

    //Collide the player and the memory pieces with the platforms
    this.physics.add.collider(this.player, worldLayer);
    this.physics.add.collider(this.mems, worldLayer);
    this.physics.add.collider(this.sm_spirit1, worldLayer);
    this.physics.add.collider(this.lg_spirit, worldLayer);
    this.physics.add.collider(this.body, worldLayer);

    //this.physics.add.collider(this.player, this.sm_spirit1, <the callback to invoke when collide, null, this>);
//////////////////////////////////////////////////////////////////////////////////
    //Overlap Checks
    this.physics.add.overlap(
      this.player,
      this.mems,
      this.collectMem,
      null,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.sm_spirit1,
      this.enemyHit,
      null,
      this
    );
    //plays background music
    var music = this.sound.add('cave_music1');
    music.volume = .3;
    music.play();

    this.physics.add.overlap(
      this.player,
      this.body,
      this.returnBody,
      null,
      this
    );

  }


  update() {
    if (this.gameOver) {
      this.scene.start('GameOverScene',{score: this.score });
      return;
    }

    this.lg_spirit.anims.play('idle_sp', true);

    var cursors = this.input.keyboard.createCursorKeys();
    var speed = 5;

    if (cursors.left.isDown) {
      this.player.setVelocityX(-200);
      this.player.flipX = true;
      this.player.anims.play('walk', true);
    } else if (cursors.right.isDown){
      this.player.setVelocityX(200);
      this.player.flipX = false;
      this.player.anims.play('walk', true);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.play('idle', true);
    }
    if (cursors.up.isDown && this.player.body.blocked.down) {
      this.player.setVelocityY(-470);
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
  }

  returnBody(player, body) {
    this.gameOver = true;
  }

  //When the player touches an enemy, return to spawn
  enemyHit(player, sm_spirit) {
    player.setPosition(100, 1750);
  }

}
