/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";

export default class Caves extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('caves');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    //For later scenes (pass the memories score)
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
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

    this.load.image('tiles', "./assets/sprites/cave_platform03.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/cave_tilemap3.json")

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('body', "./assets/sprites/star.png");
    this.load.image('orange', './assets/images/blue.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/run_spritesheet.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS
    this.load.audio('cave_music1', "./assets/music/obsession_slowmix.wav");
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.mems;
    this.body;

    this.lg_spirit;
    this.sm_spirit1;
    this.player;

    this.score = 0;
    this.scoreText;
    this.gameOver = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const background = this.add.image(800, 960/2, 'background');
    this.physics.world.setBounds(0, 0, 1536, 3000);

    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('cave_platform03', 'tiles');
    this.worldLayer = map.createStaticLayer('platforms', tileset, 0, -1175);
    this.worldLayer.setCollisionByProperty({ collides: true });

    //Foreground test
    //const foreground = this.add.image(550, 50, 'foreground');
    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Memory Pieces
    this.mems = this.physics.add.group([
      {key: 'mem_piece',
      setXY: { x: 50, y: 321}},
      {key: 'mem_piece',
      setXY: { x: 1200, y: 722}}
      ]);

    //Memories Collected (Score Display)
    this.scoreText = this.add
      .text(16, 16, "Memories: 0", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 },
      })
      .setScrollFactor(0);

    //Creates ghost's human body (it's a star for now)
    this.body = this.physics.add.sprite(1400, 270, 'body');
    this.body.setCollideWorldBounds(true);

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates large spirit
    this.lg_spirit = this.physics.add.sprite(1450, 800, 'lg_spirit');
    this.lg_spirit.setScale(0.4);
    this.lg_spirit.setCollideWorldBounds(true);

    this.anims.create({
      key: 'idle_sp',
      frames: this.anims.generateFrameNumbers('lg_spirit', {start: 0, end: 2}),
      duration: 850,
      yoyo: true,
      repeat: -1
    });

    //Creates small spirits
    this.sm_spirit1 = this.physics.add.sprite(500, 1840, 'sm_spirit');
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

    //Creates player character
    //const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Ghost_Player(this, 100, 1800);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 1536, 1900);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

///////////////////////////////////////////////COLLISIONS AND INTERACTIONS/////////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirit1, this.lg_spirit, this.body], this.worldLayer);

    this.physics.world.addCollider(this.player.sprite, this.sm_spirit1, this.enemyHit, null, this);
    this.physics.world.addCollider(this.player.sprite, this.mems, this.collectMem, null, this);

    //INTERACTION
    /*
    this.physics.add.overlap(
      this.player.sprite,
      this.body,
      this.returnBody,
      null,
      this
    );

    this.physics.add.overlap(
      this.player.sprite,
      this.body,
      this.returnBody,
      null,
      this
    );
    */

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    var music = this.sound.add('cave_music1');
    music.volume = .3;
    music.play();



    var particles0 = this.add.particles('orange');
    var emitter0 = particles0.createEmitter({
        lifespan: 1000,
        speedX:{min: -100, max: 100},
        speedY:{min: -100, max:1000},
        scale: {start: 1, end: 0},
        blendMode: 'ADD'
    });
    emitter0.setPosition(1300, -0);
    var particles1 = this.add.particles('orange');
    var emitter1 = particles1.createEmitter({
        lifespan: 1000,
        speedX:{min: -100, max: 100},
        speedY:{min: -100, max:1000},
        scale: {start: 1, end: 0},
        blendMode: 'ADD'
    });
    emitter1.setPosition(1400, -0);
    var particles3 = this.add.particles('orange');
    var emitter3 = particles3.createEmitter({
        lifespan: 2000,
        speedX:{min: -100, max: 100},
        speedY:{min: -100, max:500},
        scale: {start: 1, end: 0},
        blendMode: 'ADD'
    });
    emitter3.setPosition(1500, -0);


  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    this.player.update();
    this.lg_spirit.anims.play('idle_sp', true);

    if (this.gameOver) {
      this.scene.start('GameOverScene',{ score: this.score });
      return;
    }

    if (this.player.sprite.y > this.worldLayer.height) {
      this.player.destroy();
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting a memory
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    //Update the score
    this.score += 1;
    this.scoreText.setText("Memories: " + this.score);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  returnBody(player, body) {
    this.gameOver = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player, sm_spirit) {
    this.player.destroy();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}