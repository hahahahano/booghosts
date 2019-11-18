/*
  HOSPITAL SCENE (KID)
*/
import * as changeScene from './changeScene.js';
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
    this.inventory = this.registry.get("inventory");
    this.score = this.registry.get("score");
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

    this.player;
    this.kidSpirit;
    this.talked = false;

    this.inter2 = true;

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
    this.hospitalDoors = hospitalMap.createStaticLayer('doors', hospitalTileset, 0, 0);
    this.hospitalDoor = this.add.zone(450, 690).setSize(110, 230);
    this.physics.world.enable(this.hospitalDoor);
    this.hospitalDoor.body.setAllowGravity(false);
    this.hospitalDoor.body.moves = false;
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('platforms', hospitalTileset, 0, 0);

    //Adult on hospital bed
    this.kid = this.physics.add.sprite(950, 720, 'kid');
    this.kid.setCollideWorldBounds(true);

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates the kid character
    this.kidSpirit = this.physics.add.sprite(1000, 740, 'boy_ghost');
    this.kidSpirit.setCollideWorldBounds(true);

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
    this.physics.world.addCollider( [this.player.sprite, this.exit, this.kid, this.kidSpirit], this.hospitalWorldLayer);
    this.physics.add.overlap( this.player, this.hospitalDoor,null,this);
    this.physics.add.overlap(this.player.sprite, this.zoneStart2, this.questions, null, this);

      //Collects a memory piece

      //Exit

    //Interaction
    this.physics.add.overlap(this.player.sprite, this.kidSpirit, this.kidTalked, null, this);

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
    var potentialscenes = ['hoscoldadult','hoshotadult','hoscoldadult','hoscoldadult']
    this.player.update();
    if (this.input.keyboard.checkDown(this.player.keys.x, 250) && this.hospitalDoor) {
      var rand = potentialscenes[Math.floor(Math.random() * potentialscenes.length)];
      this.registry.set("talked", this.talked);
      this.scene.start(rand);
    }

    /*if (this.talked) {
      this.kidSpirit.setVisible(false);
    }*/
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
      this.scene.launch("message", { textArray: ['I feel a large presence here'], returning: "HosNo" });
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  kidTalked() {
    if (!this.talked && this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.talked = true;
      this.scene.pause();
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.kidReturn = ["Oh hi. What are you doing here?", "What about me? Well, that's me in the bed.", "I just felt like I had to come here for some reason. That's why I needed a ride to the city. I guess that pull I felt was my body calling to my spirit.",
      "It looks like I'm in a coma. What should I do now? I like running around with no one to tell me what to do. But I miss my family and friends.", "Yeah, you're right. I should return to my body. I should wake up. I'm sure there's people waiting for me.",
      "Well, thanks for helping me! Maybe I'll see you later."];
      this.scene.launch("message", { textArray: this.kidReturn, returning: "HosNo" });
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
