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
    this.load.image('scroll', './assets/sprites/map_sketch.png');
    this.load.image('background', "./assets/images/cave_bg_test001.jpg",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });
    this.load.image('foreground', "./assets/images/cave_fg_test003.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });

    this.load.image('tiles', "./assets/sprites/cave_platform03.png");
    this.load.image('shrubs', "./assets/sprites/shrub1.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/cave_tilemap3.json");

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('body', "./assets/sprites/bones_sketch.png");
    this.load.image('orange', './assets/images/blue1.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/run_spritesheet1.png", {
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
    this.msgBox;
    this.scroll;

    this.lg_spirit;
    this.sm_spirit1;
    this.player;

    this.score = 0;
    this.scroll = false;
    this.scoreText;
    this.gameOver = false;


///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const background = this.add.image(768, 1229, 'background');
    this.physics.world.setBounds(0, 0, 1536, 3000);

    //Particles
    var particles0 = this.add.particles('orange');
    var emitter0 = particles0.createEmitter({
        alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
        lifespan: 5000,
        speedX:{min: -70, max: 70},
        speedY:{min: -100, max:1000},
        scale: {start: 1, end: 0},
        blendMode: 'ADD'
    });
    emitter0.setPosition(700, -0);



    //Platforms
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('cave_platform03', 'tiles');
    const tileset1 = map.addTilesetImage('shrub1', 'shrubs');

    this.worldLayer = map.createStaticLayer('platforms', tileset, 0, -1175);
    this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);

    this.worldLayer.setCollisionByProperty({ collides: true });
    this.plants.setCollisionByProperty({ collides: true });

    //Foreground test
    //const foreground = this.add.image(768, 1229, 'foreground');
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
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0);

    //Creates ghost's human body
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

    this.scroll = this.physics.add.sprite(750,400,'scroll');
    this.scroll.setCollideWorldBounds(true);

    this.tweens.add({
      targets: this.sm_spirit1,
      x: 900,
      ease: 'Linear',
      yoyo: true,
      duration: 5000,
      repeat: -1
    });

    //Creates player character
    var container = this.add.container(148, 200, this.player);


    //const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Ghost_Player(this, 100, 1800);

    this.player.sprite.setCollideWorldBounds(true);


    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 1536, 1900);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

///////////////////////////////////////////////COLLISIONS AND INTERACTIONS/////////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirit1, this.lg_spirit, this.body, this.scroll], this.worldLayer);
    this.plants.setCollisionByProperty({ collides: true });
    //this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirit1, this.lg_spirit, this.body], this.plants);

    //this.physics.world.addCollider(this.player.sprite, this.sm_spirit1, this.enemyHit, null, this);
    this.physics.world.addCollider(this.sm_spirit1, this.player.sprite, this.enemyHit, null, this);

    this.physics.world.addCollider(this.player.sprite, this.mems, this.collectMem, null, this);
    this.physics.world.addCollider(this.player.sprite, this.lg_spirit, this.hitspirit,null, this);
    this.physics.world.addCollider(this.player.sprite, this.scroll, this.collectscroll, null, this);


    //INTERACTION
    this.physics.add.overlap(
      this.player.sprite,
      this.body,
      this.returnBody,
      null,
      this
    );

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.music = this.sound.add('cave_music1');
    this.music.volume = .3;
    this.music.play();

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.worldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    this.player.update();
    this.lg_spirit.anims.play('idle_sp', true);

    if (this.gameOver) {
      this.music.stop();
      this.scene.start('GameOverScene',{ score: this.score });
      return;
    }

    if (this.player.sprite.y > this.worldLayer.height) {
      this.player.destroy();
    }

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Textboxes
  /*instructions(player) {
    var instructions = ["Hey there. I'm glad you're awake. It's me. You. Hahaha.",
    "You can move around with the arrow keys. You should probably explore the area, but be careful; it looks like that small spirit is angry and might hurt you."]
  }*/

  showMessageBox(textmsg, xpos, ypos, w = 300, h = 700) {
    if (this.player.keys.x.isDown) {
      this.msgBox = this.add
        .text(xpos, ypos, textmsg, {
          font: "18px monospace",
          fill: "#fff",
          padding: { x: 20, y: 10 },
          backgroundColor: "#000",
          wordWrap: true,
          wordWrapWidth: w * 0.9
        });
    }
  }

  hideMessageBox(msgBox) {
    msgBox.destroy()
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

  collectscroll(player, scroll) {
    scroll.disableBody(true, true);

    //Update the score
    this.scroll = true;
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
  hitspirit(player, lg_spirit){
      this.add.text(1350,700,"Can you help me");
      this.add.text(1350,720, "find my scroll?");


  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
