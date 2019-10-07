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
    this.scroll;

    this.instructBox;
    this.zoneStart;
    this.memsBox = this.add.text(null, null, null);
    this.collectTut = 0;
    this.zoneMem;
    this.exitBox;
    this.zoneExit;

    this.lg_spirit;
    this.msgBox;
    this.scrolls = false;
    this.talked = 0;
    this.sm_spirit1;
    this.player;

    this.score = 0;
    this.scoreText;
    this.gameOver = false;

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
      setXY: { x: 650, y: 1270}},
      {key: 'mem_piece',
      setXY: { x: 100, y: 880}},
      {key: 'mem_piece',
      setXY: { x: 1400, y: 2580}}
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
    this.body = this.physics.add.sprite(100, 390, 'body');
    this.body.setCollideWorldBounds(true);

    //Creates map for large spirit
    this.scroll = this.physics.add.sprite(1139, 850, 'scroll');
    this.scroll.setCollideWorldBounds(true);

    //Create test rock to move
    this.rock = this.physics.add.sprite(300, 1825, 'rock');
    this.rock.setCollideWorldBounds(true);

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //Tutorial Zone: Explains the movements
    this.zoneStart = this.add.zone(250, 2450).setSize(800, 400);
    this.physics.world.enable(this.zoneStart);
    this.zoneStart.body.setAllowGravity(false);
    this.zoneStart.body.moves = false;
    //Memory Zone: Explains the memory pieces
    this.zoneMem = this.add.zone(1200, 2450).setSize(800, 450);
    this.physics.world.enable(this.zoneMem);
    this.zoneMem.body.setAllowGravity(false);
    this.zoneMem.body.moves = false;
    //Exit Zone: Explains leaving
    this.zoneExit = this.add.zone(200, 220).setSize(750, 400);
    this.physics.world.enable(this.zoneExit);
    this.zoneExit.body.setAllowGravity(false);
    this.zoneExit.body.moves = false;
///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates large spirit
    this.lg_spirit = new LGSpirit(this, 1750, 2480);
    this.lg_spirit.sprite.setCollideWorldBounds(true);

    //Creates small spirits
    this.sm_spirit1 = this.physics.add.sprite(1200, 2180, 'sm_spirit');
    this.sm_spirit1.setScale(0.15);
    this.sm_spirit1.setCollideWorldBounds(true);

    this.tweens.add({
      targets: this.sm_spirit1,
      x: 1950,
      ease: 'Linear',
      yoyo: true,
      duration: 4500,
      repeat: -1
    });

    this.sm_spirit2 = this.physics.add.sprite(1500, 1600, 'sm_spirit');
    this.sm_spirit2.setScale(0.15);
    this.sm_spirit2.setCollideWorldBounds(true);

    this.tweens.add({
      targets: this.sm_spirit2,
      x: 1950,
      ease: 'Linear',
      yoyo: true,
      duration: 5000,
      repeat: -1
    });

    this.sm_spirit3 = this.physics.add.sprite(2055, 1000, 'sm_spirit');
    this.sm_spirit3.setScale(0.15);
    this.sm_spirit3.setCollideWorldBounds(true);

    this.tweens.add({
      targets: this.sm_spirit3,
      x: 2225,
      ease: 'Linear',
      yoyo: true,
      duration: 1500,
      repeat: -1
    });

    /*this.sm_spirits = this.physics.add.group([
      {key: 'sm_spirit',
      setXY: { x: 650, y: 1270}},
      {key: 'sm_spirit',
      setXY: { x: 100, y: 880}},
      {key: 'sm_spirit',
      setXY: { x: 1400, y: 2580}}
    ]);*/

    //Creates player character
    //const spawnPoint = map.findObject("other objects", obj => obj.name === "Spawn Point");
    this.player = new Ghost_Player(this, 150, 2520);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 2304, 2700);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirit1, this.sm_spirit2, this.sm_spirit3, this.lg_spirit.sprite, this.body, this.scroll, this.rock], this.worldLayer);

      //Hits an enemy
    this.physics.add.overlap(this.player.sprite, [this.sm_spirit1, this.sm_spirit2, this.sm_spirit3], this.enemyHit, null, this);
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

    //ZONES
      //Tutorial
    this.instructionsText = ["Hey there. I'm glad you're awake. It's me. You. Hahaha. (Press X)", "You can move around with the arrow keys and interact with X.",
    "You should probably explore the area; maybe you'll remember something about yourself.", "But be careful; it looks like that small spirit is angry and might hurt you."];
    this.inter = 0;

    this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
      font: "18px monospace",
      fill: "#fff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000",
      wordWrap: { width: 300, useAdvancedWrap: true }
    });
    this.inter ++;
    this.physics.add.overlap(this.player.sprite, this.zoneStart, this.instructions, null, this);
      //Memory Pieces
    this.MemsText = ["That looks familiar.", "I think if you pick it up, you might remember something about yourself."];
    this.memIntro = 0;
    this.physics.add.overlap(this.player.sprite, this.zoneMem, this.memsInstruct, null, this);
      //Exiting the scene
    this.physics.add.overlap(this.player.sprite, this.zoneExit, this.exitInstruct, null, this);

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
      this.scene.start('Instructions', { score: this.score });
      return;
    }

    if (this.player.sprite.y > this.worldLayer.height) {
      this.player.destroy();
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Interactions
    //Push and Pull the rock
  moveRock(){

  }
    //Dialogue with the Large Spirit
  interactLG() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.lg_spirit.interact(1850, 2325, this.scrolls, this.talked, this.score);
    }
  }
    //Searching the bushes
  interactBush() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      //this.plants
      //this.enemyHit();
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Zones
    //Tutorial Zone
  instructions(instructBox) {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      switch (this.inter)
        {
          case 1:
            this.instructBox.destroy();

            this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
              font: "18px monospace",
              fill: "#fff",
              padding: { x: 20, y: 10 },
              backgroundColor: "#000",
              wordWrap: { width: 300, useAdvancedWrap: true }
            });
            break;

          case 2:
            this.instructBox.destroy();

            this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
              font: "18px monospace",
              fill: "#fff",
              padding: { x: 20, y: 10 },
              backgroundColor: "#000",
              wordWrap: { width: 300, useAdvancedWrap: true }
            });
            break;

          case 3:
            this.instructBox.destroy();

            this.instructBox = this.add.text(250, 2450, this.instructionsText[this.inter], {
              font: "18px monospace",
              fill: "#fff",
              padding: { x: 20, y: 10 },
              backgroundColor: "#000",
              wordWrap: { width: 250, useAdvancedWrap: true }
            });
            break;

          case 4:
            this.instructBox.destroy();
            break;
        }
        if (this.inter < 4) {
        this.inter++;
      }
    }
  }
    //Memory Pieces Zone
  memsInstruct(memsBox) {
    if (this.score >= 1) {
      switch (this.collectTut)
      {
        case 0:
          this.memsBox.destroy();

          this.memsBox = this.add.text(1110, 2350, "Whoa. Did you feel that? I felt a hazy memory there. A car. Hm.", {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 300, useAdvancedWrap: true }
          });
          this.collectTut ++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.memsBox.destroy();
            this.collectTut ++;
          }
          break;
      }
    } else{
      switch (this.memIntro)
      {
        case 0:
          this.memsBox = this.add.text(1100, 2450, this.MemsText[this.memIntro], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 300, useAdvancedWrap: true }
          });
          this.memIntro++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.memsBox.destroy();

            this.memsBox = this.add.text(1110, 2350, this.MemsText[this.memIntro], {
              font: "18px monospace",
              fill: "#fff",
              padding: { x: 20, y: 10 },
              backgroundColor: "#000",
              wordWrap: { width: 300, useAdvancedWrap: true }
            });
            this.memIntro++;
          }
          break;

        case 2:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.memsBox.destroy();
            this.memIntro++;
          }
          break;
      }
    }
  }
    //Exiting Scene Zone
  exitInstruct(exitBox) {
    this.exitBox = this.add.text(50, 150, "This is the exit. Are you sure you want to leave?", {
      font: "18px monospace",
      fill: "#fff",
      padding: { x: 20, y: 10 },
      backgroundColor: "#000",
      wordWrap: { width: 300, useAdvancedWrap: true }
    });
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting Items
    //Collecting Memory Piece
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    this.score += 1;
    this.scoreText.setText("Memories: " + this.score);
  }
    //Collecting Scroll
  collectscroll(player, scroll) {
    scroll.disableBody(true, true);

    this.scrolls = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Returning to the body triggers end
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
