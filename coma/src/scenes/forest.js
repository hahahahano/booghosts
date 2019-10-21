/*
  FOREST SCENE
*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import msgBox from "./msgBox.js";

export default class Forest extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Forest');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.player = data.player;
    this.inventory = data.inventory;
    this.score = data.score;
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
    this.load.image('exit', "./assets/sprites/bones_sketch.png");
    this.load.image('rock', './assets/sprites/test_rock.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
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
    this.exit;
    this.rock;

    this.player;
    //this.inventory = [];
    //this.score = 0;

    this.invText = "";
    this.invTextDis = this.add.text(null, null, null);

    this.scoreText = "";
    this.scoreDis = this.add.text(null, null, null);

    this.nextScene = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    this.physics.world.setBounds(0, 0, 8192, 1280);
    const forest_sky = this.add.image(8192/2, 1280/2, 'forest_sky');
    forest_sky.setScale(2);
    //Platforms
    const forestMap = this.make.tilemap({ key: 'forest_map' });
    const tileset = forestMap.addTilesetImage('ground_tileset1', 'forest_tiles');
    // const tileset1 = map.addTilesetImage('shrub1', 'shrubs');

    this.forestWorldLayer = forestMap.createStaticLayer('platforms', tileset, 0, 0);
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
    this.updateScore();

    //Inventory
    this.updateInventory();

    //Creates exit (placeholder)
    this.exit = this.physics.add.sprite(7750, 300, 'exit');
    this.exit.setCollideWorldBounds(true);

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
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
    this.forestWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.exit, this.rock], this.forestWorldLayer);

      //Hits an enemy

      //Collects a memory piece

      //Exit
    this.physics.add.overlap(this.player.sprite, this.exit, this.playNextScene, null, this);
      //character and rock INTERACTION
    this.physics.world.addCollider(this.player.sprite, this.rock, this.moveRock, null, this);

    //INTERACTION

    //ZONES

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.forestMusic = this.sound.add('cave_music1');
    this.forestMusic.volume = .3;
    this.forestMusic.play();

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.forestWorldLayer.renderDebug(graphics, {
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

    if (this.nextScene) {
      // fade to white

      this.forestMusic.stop();
      this.scene.start('Race', { player: this.player, inventory: this.inventory, score: this.score });
      return;
    }

    if (this.player.sprite.y > this.forestWorldLayer.height) {
      this.player.destroy();
    }
  }

  updateInventory() {
    if (this.inventory.length == 0) {
      this.invTextDis.destroy();

      this.invText = "Inventory: Empty";
    } else {
      this.invTextDis.destroy();
      this.invText = "Inventory: " + this.inventory[0];

      var itemNum;
      for (itemNum = 1; itemNum < this.inventory.length; itemNum++) {
        this.invText += ("\n\t\t\t\t\t\t\t\t\t\t\t" + this.inventory[itemNum]);
      }
    }

    this.invTextDis = this.add
      .text(16, 36, this.invText, {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
  }

  updateScore() {
    this.scoreDis.destroy();
    this.scoreText = "Memories: " + String(this.score);

    this.scoreDis = this.add
      .text(16, 16, this.scoreText, {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
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
    this.updateScore();
  }

/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Ending is triggered
  playNextScene(player, exit) {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.nextScene = true;
    }
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
