/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import LGSpirit from "./LGSpirit.js";

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
    this.load.image('background', "./assets/images/cave_bg_test004.jpg",{
      frameWidth: 2304, //432
      frameHeight: 3687, // 32
    });
    this.load.image('waterfall', './assets/images/blue1.png');
    this.load.image('foreground', "./assets/images/cave_fg_test003.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });

    this.load.image('tiles', "./assets/textures/cave_tileset1.png");
    //this.load.image('shrubs', "./assets/sprites/shrub1.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/cave_tilemap5.json")

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('body', "./assets/sprites/bones_sketch.png");
    this.load.image('scroll', './assets/sprites/map_sketch.png');
    this.load.image('rock', './assets/sprites/test_rock.png');

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
    this.load.audio('cave_music1', "./assets/music/obsession_slowmix.mp3");
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.mems;
    this.body;
    this.rock;
    this.msgBox;
    this.scroll;

    this.lg_spirit;
    this.talked = 0;
    this.sm_spirit1;
    this.player;

    this.score = 0;
    this.scrolls = false;
    this.scoreText;
    this.gameOver = false;
    this.zone;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const background = this.add.image(1152, 1536, 'background');
    this.physics.world.setBounds(0, 0, 2304, 3072);

    //Particles - Waterfall
    var particles0 = this.add.particles('waterfall');
    var emitter0 = particles0.createEmitter({
        alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
        lifespan: 5000,
        speedX:{min: -70, max: 70},
        speedY:{min: -100, max:1000},
        scale: {start: 1.25, end: 0},
        blendMode: 'ADD'
    });
    emitter0.setPosition(1075, -0);

    //Platforms
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('cave_tileset1', 'tiles');
    // const tileset1 = map.addTilesetImage('shrub1', 'shrubs');

    this.worldLayer = map.createStaticLayer('platforms', tileset, 0, 0);
    //this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);

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

    //Creates map for large spirit
    this.scroll = this.physics.add.sprite(750,400,'scroll');
    this.scroll.setCollideWorldBounds(true);

    //Create test rock to move
    this.rock = this.physics.add.sprite(300, 1825, 'rock');
    this.rock.setCollideWorldBounds(true);

    //Creating zone for the instructions to pop up
    this.zone = this.add.zone(50, 1750).setSize(800, 400);
    this.physics.world.enable(this.zone);
    this.zone.body.setAllowGravity(false);
    this.zone.body.moves = false;

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates large spirit
    this.lg_spirit = new LGSpirit(this, 1450, 800);
    this.lg_spirit.sprite.setCollideWorldBounds(true);

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
    //const spawnPoint = map.findObject("other objects", obj => obj.name === "Spawn Point");
    this.player = new Ghost_Player(this, 150, 1800);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 2304, 3072);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

///////////////////////////////////////////////COLLISIONS AND INTERACTIONS/////////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirit1, this.lg_spirit.sprite, this.body, this.scroll, this.rock], this.worldLayer);

      //Hits an enemy
    this.physics.add.overlap(this.player.sprite, this.sm_spirit1, this.enemyHit, null, this);
      //Collects a memory piece
    this.physics.world.addCollider(this.player.sprite, this.mems, this.collectMem, null, this);
      //Collects the scroll
    this.physics.world.addCollider(this.player.sprite, this.scroll, this.collectscroll, null, this);
      //character and rock INTERACTION
    this.physics.world.addCollider(this.player.sprite, this.rock, this.moveRock, null, this);

    //INTERACTION
      //With large spirit
    this.physics.add.overlap(this.player.sprite, this.lg_spirit.sprite, this.interactLG, null, this);
      //With bushes
    this.physics.add.overlap(this.player.sprite, this.plants, this.interactBush, null, this);
      //With body (need to code in the choice to leave~)
    this.physics.add.overlap(this.player.sprite, this.body, this.returnBody, null, this);

    this.instructionsText = ["Hey there. I'm glad you're awake. It's me. You. Hahaha. (Press X)",
    "You can move around with the arrow keys and interact with X.", "You should probably explore the area, but be careful; it looks like that small spirit is angry and might hurt you."];
    this.inter = 0;

    this.instructBox = this.add.text(50, 1550, this.instructionsText[this.inter], {
      font: "18px monospace",
      fill: "#fff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000",
      wordWrap: { width: 300, useAdvancedWrap: true }
    });
    this.inter ++;
    this.physics.add.overlap(this.player.sprite, this.zone, this.instructions, null, this);

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
    this.lg_spirit.update();

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
  //Interactions

  moveRock(){

  }

  interactLG() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.lg_spirit.interact(1350, 700, this.scrolls, this.talked);
    }
  }

  instructions(instructBox) {
    if (this.input.keyboard.checkDown(this.player.keys.x, 100)) {
      switch (this.inter)
        {
          case 1:
            this.instructBox.destroy();

            this.instructBox = this.add.text(50, 1550, this.instructionsText[this.inter], {
              font: "18px monospace",
              fill: "#fff",
              padding: { x: 20, y: 10 },
              backgroundColor: "#000",
              wordWrap: { width: 250, useAdvancedWrap: true }
            });
            break;

          case 2:
            this.instructBox.destroy();

            this.instructBox = this.add.text(50, 1550, this.instructionsText[this.inter], {
              font: "18px monospace",
              fill: "#fff",
              padding: { x: 20, y: 10 },
              backgroundColor: "#000",
              wordWrap: { width: 250, useAdvancedWrap: true }
            });
            break;

          case 3:
            this.instructBox.destroy();
            break;
        }
        if (this.inter < 3) {
        this.inter++;
      }
    }
  }

  interactBush() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      //this.plants
      //this.enemyHit();
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting items
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    //Update the score
    this.score += 1;
    this.scoreText.setText("Memories: " + this.score);
  }

  collectscroll(player, scroll) {
    scroll.disableBody(true, true);

    //Collects scroll
    this.scrolls = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Returning to the body, triggers end
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
