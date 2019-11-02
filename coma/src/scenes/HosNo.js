/*
  CITY SCENE 1
*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";

export default class HosNo extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('HosNo');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = data.inventory;
    this.score = data.score;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {
    //BACKGROUND AND FOREGROUND
    this.load.image('cityBackground', "./assets/images/city_sky1.jpg");

    this.load.image('cityTiles', "./assets/textures/city_tileset1.png");
    this.load.tilemapTiledJSON('cityMap', "./assets/tilemaps/city_tilemap1.json");

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('exit', "./assets/sprites/bones_sketch.png");

    //LIVE CHARACTERS (ghost, people, kid NPC)
    this.load.spritesheet('ghost', "./assets/spriteSheets/ghost.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.mems;
    this.exit;

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
    const cityBackground = this.add.image(3968/2, 512, 'cityBackground');
    this.physics.world.setBounds(0, 0, 3968, 1024);

    //Platforms
    const cityMap = this.make.tilemap({ key: 'cityMap' });
    const cityTileset = cityMap.addTilesetImage( 'city_tileset1','cityTiles');

    this.buildings = cityMap.createStaticLayer('Front', cityTileset, 0, 0);

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
    this.updateScore();

    //Inventory
    this.updateInventory();

    //Creates ghost's human body
    this.exit = this.physics.add.sprite(1400, 270, 'exit');
    this.exit.setCollideWorldBounds(true);

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates kid NPC

    //Creates people

    //Creates player character
    //const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Ghost_Player(this, 100, 0);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 3968, 1024);

    //Gravity for this scene
    this.physics.world.gravity.y = 700;

///////////////////////////////////////////////COLLISIONS AND INTERACTIONS/////////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.buildings.setCollisionByProperty({ collides: true });

    this.physics.world.addCollider( [this.player.sprite, this.exit, this.mems], this.buildings);

      //Hits an enemy

      //Collects a memory piece
    this.physics.add.overlap(this.player.sprite, this.mems, this.collectMem, null, this);

    //INTERACTION
      //With kid NPC

      //With body (need to code in the choice to leave~)
    this.physics.add.overlap(this.player.sprite, this.exit, this.playNextScene, null, this);

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    /*this.music = this.sound.add('cave_music1');
    this.music.volume = .3;
    this.music.play();*/

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create frontBuildings collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.buildings.renderDebug(graphics, {
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
      //this.music.stop();
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }

    /*if (this.player.sprite.y > this.frontBuildings.height) {
      this.player.destroy();
    }*/

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
  interactKid() {
    if (this.player.keys.x.isDown) {

    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting items
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    //Update the score
    this.score += 1;
    this.updateScore();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //PLay next scene
  playNextScene(player, exit) {
    this.nextScene = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player) {
    this.player.destroy();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
