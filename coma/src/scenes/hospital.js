/*
  HOSPITAL SCENE
*/
import * as changeScene from './changeScene.js';
import Ghost_Player from "./ghost_player.js";

export default class Hospital extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Hospital');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = this.registry.get("inventory", this.inventory);
    this.score = this.registry.get("score", this.score);
    this.instructBox;
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
    const hospitalMap = this.make.tilemap({ key: 'hospital_map' });
    const hospitalTileset = hospitalMap.addTilesetImage('hospital_tileset1', 'hospital_tiles');

    this.hospitalWall = hospitalMap.createStaticLayer('wall', hospitalTileset, 0, 0);
    this.hospitalDoor = hospitalMap.createStaticLayer('doors', hospitalTileset, 0, 0);
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('platforms', hospitalTileset, 0, 0);

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
    this.physics.world.gravity.y = 700;

    //questionzone1: Explains the movements
    this.zoneStart2 = this.add.zone(100, 900).setSize(500, 500);
    this.physics.world.enable(this.zoneStart2);
    this.zoneStart2.body.setAllowGravity(false);
    this.zoneStart2.body.moves = false;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////


///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.hospitalWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.exit], this.hospitalWorldLayer);
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


    /*var initialTime = 60;
    this.countDown(initialTime);*/
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    this.player.update();
    var potentialscenes = ['hoscoldkid','hoshotkid','hoscoldkid','hoscoldkid']
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
      this.scene.launch("message", { textArray: ['I need to find something. Do the doors lead somwhere?'], returning: "Hospital" });
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  /*countDown(initialTime) {
    this.initialTime = initialTime;
    var text = this.add.text(16, 56, 'Countdown: ' + formatTime(this.initialTime));

    // Each 1000 ms call onEvent
    var timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    function formatTime(seconds){
        // Minutes
        var minutes = Math.floor(seconds/60);
        // Seconds
        var partInSeconds = seconds%60;
        // Adds left zeros to seconds
        partInSeconds = partInSeconds.toString().padStart(2,'0');
        // Returns formated time
        return `${minutes}:${partInSeconds}`;
    }

    function onEvent ()
    {
        this.initialTime -= 1; // One second
        text.setText('Countdown: ' + formatTime(this.initialTime));
        console.log('Countdown: ' + formatTime(this.initialTime));
    }
  }*/
}
