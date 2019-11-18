/*
  HOSPITAL SCENE (MAIN CHARACTER)
*/
import * as changeScene from './changeScene.js';
import Ghost_Player from "./ghost_player.js";

export default class HosYes extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('HosYes');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = this.registry.get("inventory", this.inventory);
    this.score = this.registry.get("score", this.score);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    changeScene.addSceneEventListeners(this);

    this.exit;

    this.inter2 = true;

    this.player;

    this.invTextDis = this.add
      .text(16, 36, "", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.updateInventory();

    this.scoreDis = this.add
      .text(16, 16, "", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.updateScore();

    this.nextScene = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    this.physics.world.setBounds(0, 0, 2048, 1024);

    //Platforms
    const hospitalMap = this.make.tilemap({ key: 'hospital_room1' });
    const hospitalTileset = hospitalMap.addTilesetImage('hospital_tileset2', 'hospital_tiles2');

    this.hospitalWall = hospitalMap.createStaticLayer('wall', hospitalTileset, 0, 0);
    this.hospitalDoor = hospitalMap.createStaticLayer('doors', hospitalTileset, 0, 0);
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('platforms', hospitalTileset, 0, 0);

    //Adult on hospital bed
    this.adult = this.physics.add.sprite(950, 720, 'adult');
    this.adult.setCollideWorldBounds(true);

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character
    this.player = new Ghost_Player(this, 500, 740);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.followOffset.set(0, 50);

    this.cameras.main.setBounds(0, 0, 1280, 1024);
    this.cameras.main.setZoom(1.5);


    //Gravity for this scene
    this.physics.world.gravity.y = 700;

    //questionzone1: Explains the movements
    this.zoneStart2 = this.add.zone(500, 500).setSize(500, 500);
    this.physics.world.enable(this.zoneStart2);
    this.zoneStart2.body.setAllowGravity(false);
    this.zoneStart2.body.moves = false;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.hospitalWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.exit, this.adult], this.hospitalWorldLayer);
    this.physics.add.overlap( this.player, this.hospitalDoor,null,this);
    this.physics.add.overlap(this.player.sprite, this.zoneStart2, this.questions, null, this);

      //Collects a memory piece

      //Exit

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.hospitalWorldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/

  update() {
    var potentialscenes = ['GameOverScene']
    this.player.update();
    if (this.input.keyboard.checkDown(this.player.keys.x, 250) && this.hospitalDoor) {
      var rand = potentialscenes[Math.floor(Math.random() * potentialscenes.length)];
      this.scene.start(rand, { inventory: this.inventory, score: this.score });

    }
  }

  updateInventory() {
    if (this.inventory.length == 0) {
      this.invText = "Inventory: Empty";
    } else {
      this.invText = "Inventory: " + this.inventory[0];

      var itemNum;
      for (itemNum = 1; itemNum < this.inventory.length; itemNum++) {
        this.invText += ("\n\t\t\t\t\t\t\t\t\t\t\t" + this.inventory[itemNum]);
      }
    }

    this.invTextDis.setText(this.invText);
    this.registry.set("inventory", this.inventory);
  }

  updateScore() {
    this.scoreText = "Memories: " + String(this.score);

    this.scoreDis.setText(this.scoreText);
    this.registry.set("score", this.score);
  }

  questions() {

    if (this.inter2) {
      this.inter2 = false;
      this.scene.pause();
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.launch("message", { textArray: ['I long to return to who i was and who i am'], returning: "HosYes" });
    }
  }

}
