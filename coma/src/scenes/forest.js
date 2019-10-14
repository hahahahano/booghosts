/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import LGSpirit from "./LGSpirit.js";

export default class Forest extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Forest');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    //this.score = data.score;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {
    //BACKGROUND AND FOREGROUND
    //this.load.image('background', "./assets/images/cave_bg_test004.jpg");
    //this.load.image('waterfall', './assets/images/blue1.png');
    //this.load.image('foreground', "./assets/images/cave_fg_test003.png");

    this.load.image('forest_tiles', "./assets/textures/ground_tileset1.png");
    this.load.tilemapTiledJSON('forest_map', "./assets/tilemaps/forest_tilemap1.json");
    this.load.image('scenery', "./assets/images/forest_tilemap_overlay.png");
    this.load.image('forest_sky', "./assets/images/forest_sky.jpg");
    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('body', "./assets/sprites/bones_sketch.png");
    this.load.image('scroll2', './assets/sprites/cave/map_sketch.png');
    this.load.image('rock', './assets/sprites/test_rock.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/cave/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/cave/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/ghost.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS
    this.load.audio('cave_music1', "./assets/music/cave_music.mp3");
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.mems;
    this.body;
    this.rock;
    this.scroll2;

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

    this.scoreText;
    this.gameOver = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    this.physics.world.setBounds(0, 0, 8192, 1280);
    const forest_sky = this.add.image(8192/2, 1280/2, 'forest_sky');
    forest_sky.setScale(2);
    //Platforms
    const map = this.make.tilemap({ key: 'forest_map' });
    const tileset = map.addTilesetImage('ground_tileset1', 'forest_tiles');
    // const tileset1 = map.addTilesetImage('shrub1', 'shrubs');

    this.worldLayer = map.createStaticLayer('platforms', tileset, 0, 0);
    //this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);

    //Foreground test
    const scenery = this.add.image(8192/2, 1280/2, 'scenery');

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
  this.instructBox = this.add.text(7600, 600, "Can you take me to the town?", {
    font: "18px monospace",
    fill: "#fff",
    padding: { x: 20, y: 10 },
    backgroundColor: "#000",
    wordWrap: { width: 300, useAdvancedWrap: true }
  });
    //Memory Pieces

    //Memories Collected (Score Display)
    this.scoreText = this.score


    //Creates ghost's human body
    //this.body = this.physics.add.sprite(100, 390, 'body');
    //this.body.setCollideWorldBounds(true);

    //Creates map for large spirit
    this.scroll2 = this.physics.add.sprite(7750, 300, 'scroll2');
    this.scroll2.setCollideWorldBounds(true);

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
    this.player = new Ghost_Player(this, 150, 0);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);

    this.cameras.main.setBounds(0, 0, 8192, 1280);

    //Gravity for this scene
    this.physics.world.gravity.y = 500;

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.worldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirit1, this.sm_spirit2, this.sm_spirit3, this.lg_spirit.sprite, this.body, this.scroll2, this.rock], this.worldLayer);

      //Hits an enemy

      //Collects a memory piece

      //Collects the scroll
    this.physics.world.addCollider(this.player.sprite, this.scroll2, this.collectscroll, null, this);
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
      // fade to white

      this.music.stop();
      this.scene.start('Race', { score: this.score });
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

    //Exiting Scene Zone

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
  collectscroll(player, scroll2) {


    this.music.stop();
    this.scene.start('Race', { score: this.score });
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
