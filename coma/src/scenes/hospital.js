/*
  FOREST SCENE
*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import msgBox from "./msgBox.js";

export default class Hospital extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Hospital');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = data.inventory;
    this.score = data.score;
    this.talked = data.talked;
    this.collectTut = data.collectTut;
    this.scrolls = data.scrolls;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.exit;
    this.caveEntrance;
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
    this.physics.world.setBounds(0, 0, 2048, 1024);

    //Platforms
    const hospitalMap = this.make.tilemap({ key: 'hospital_map' });
    const tileset = hospitalMap.addTilesetImage('hospital_tileset1', 'hospital_tiles');
    // const tileset1 = map.addTilesetImage('shrub1', 'shrubs');

    this.hospitalPlatforms = forestMap.createStaticLayer('platforms', tileset, 0, 0);
    this.hospitalWall = forestMap.createStaticLayer('wall', tileset, 0, 0);
    this.hospitalDoor = forestMap.createStaticLayer('doors', tileset, 0, 0);

    //this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);


    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);


///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character
    const spawnPoint = forestMap.findObject("otherObjects", obj => obj.name === "Spawn Point");
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.player = new Ghost_Player(this, this.x, this.y);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.followOffset.set(0, 175);

    this.cameras.main.setBounds(0, 0, 8192, 1180);

    //Gravity for this scene
    this.physics.world.gravity.y = 700;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////


    //Memories Collected (Score Display)
    this.updateScore();

    //Inventory
    this.updateInventory();

    //Creates exit (placeholder)
    this.exit = this.physics.add.sprite(7550, 250, 'boy_ghost');
    this.exit.setDepth(-1);
    this.exit.setCollideWorldBounds(true);

    //Creates cave entrance
    this.caveEntrance = this.physics.add.sprite(100, 810, 'caveEntrance');
    this.caveEntrance.setDepth(-1);
    this.caveEntrance.setCollideWorldBounds(true);
    this.forestScene = true;

    //Car
    this.car = this.physics.add.sprite(8000, 350, 'car_side');
    this.car.setDepth(-1);
    this.car.setCollideWorldBounds(true);

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.forestWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.exit, this.caveEntrance, this.car, this.rock], this.forestWorldLayer);

      //Collects a memory piece

      //Exit
    this.kidText = ["Hey there! Are you busy? I need some help.", "You see, there's this event going on in the city, but my parents are too busy to take me there.",
    "I've got a car (don't ask me how), but I can't drive.", "Can you please do me a favor and take me into town?", "You won't be able to come back after you drive me to town..."]
    this.kidCount = 0;

    this.physics.add.overlap(this.player.sprite, this.exit, this.kidInter, null, this);
      //Cave Entrance
    //this.physics.add.overlap(this.player.sprite, this.caveEntrance, this.caveEnter, null, this);
      //character and rock INTERACTION
    this.physics.world.addCollider(this.player.sprite, this.rock, this.moveRock, null, this);

    //INTERACTION
\
///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.forestMusic = this.sound.add('forest_music');
    this.forestMusic.volume = .6;
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
    //Searching the bushes
  interactBush() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      //this.plants
      //this.enemyHit();
    }
  }
    //Interacting with the kid NPC

/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting Items
    //Collecting Memory Piece
  collectMem(player, mem_piece) {
    this.memory_collect = this.sound.add('memory_collect');
    this.memory_collect.volume = .5;
    this.memory_collect.play();
    mem_piece.disableBody(true, true);

    this.score += 1;
    this.updateScore();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Ending is triggered
  playNextScene(player, exit) {
    this.nextScene = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/

/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn

/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player) {
    this.player.destroy(this.x, this.y);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
