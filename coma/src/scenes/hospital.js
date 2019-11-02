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
    //this.inventory = data.inventory;
    //this.score = data.score;
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
    const hospitalTileset = hospitalMap.addTilesetImage('hospital_tileset1', 'hospital_tiles');
    // const tileset1 = map.addTilesetImage('shrub1', 'shrubs');


    this.hospitalWall = hospitalMap.createStaticLayer('wall', hospitalTileset, 0, 0);
    this.hospitalDoor = hospitalMap.createStaticLayer('doors', hospitalTileset, 0, 0);
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('platforms', hospitalTileset, 0, 0);

    //this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);


    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);


///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character
    this.player = new Ghost_Player(this, 100, 825);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.followOffset.set(0, 200);

    this.cameras.main.setBounds(0, 0, 2048, 1024);

    //Gravity for this scene
    this.physics.world.gravity.y = 1500;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////



///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.hospitalWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.exit, this.caveEntrance, this.car, this.rock], this.hospitalWorldLayer);

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

}
