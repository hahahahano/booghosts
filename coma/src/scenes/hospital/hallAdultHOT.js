/*
  HOSPITAL SCENE - Hallway(adult)
*/
import * as changeScene from '../changeScene.js';
import Ghost_Player from "../characters/ghost_player.js";

export default class hallAdultHOT extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('hallAdultHOT');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = this.registry.get("inventory");
    this.score = this.registry.get("score");
    this.timer = this.registry.get("timerGlobal");
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

    this.doors;
    this.rand;

    this.player;

    this.inter5 = true;

    this.scoreDis = this.add
      .text(16, 16, "", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.updateScore();

    this.invTextDis = this.add
      .text(16, 36, "", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.updateInventory();

    this.nextScene = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    this.physics.world.setBounds(0, 0, 2048, 1024);

    //Platforms
    const hospitalMap = this.make.tilemap({ key: 'hospital_map' });
    const hospitalTileset = hospitalMap.addTilesetImage('hospital_tileset1', 'hospital_tiles');

    this.hospitalWall = hospitalMap.createStaticLayer('wall', hospitalTileset, 0, 0);
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('platforms', hospitalTileset, 0, 0);

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Doors
    this.doors = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorObjects = hospitalMap.getObjectLayer('DoorSpawn')['objects'];
    doorObjects.forEach(doorObject => {
      const door = this.doors.create(doorObject.x, doorObject.y, 'hosDoor');
      /*if (plantObject.type === "map") {
        this.mapBushX = plantObject.x;
        this.mapBushY = plantObject.y;
      } else if (plantObject.type === "mem") {
        this.memBushX = plantObject.x;
        this.memBushY = plantObject.y;
      }*/
    });

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character
    const otherObjects = hospitalMap.getObjectLayer('otherObjects')['objects'];
    otherObjects.forEach(otherObject => {
      if (otherObject.name === "Spawn Point") {
        this.player = new Ghost_Player(this, otherObject.x, otherObject.y);
        this.player.sprite.setCollideWorldBounds(true);
        this.player.sprite.setDepth(1);
      } //Other objects
    });

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 2048, 1024);

    //Gravity for this scene
    this.physics.world.gravity.y = 700;

    this.zoneStart5 = this.add.zone(100, 900).setSize(500, 500);
    this.physics.world.enable(this.zoneStart5);
    this.zoneStart5.body.setAllowGravity(false);
    this.zoneStart5.body.moves = false;

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.hospitalWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite], this.hospitalWorldLayer);
    this.physics.add.overlap(this.player.sprite, this.zoneStart5, this.questions3, null, this);

      //Collects a memory piece

      //Exit
    this.physics.add.overlap(this.player.sprite, this.doors, this.doorEnter, null, this);

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

    var minutes = Math.floor(this.timer/60);
    var partInSeconds = this.timer%60;
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    var text = 'Countdown: ' + `${minutes}:${partInSeconds}`;
    
    this.timerDis = this.add
      .text(16, 56, text, {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.countDown(this.timer);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    this.player.update();

    if (this.timer == 0) {
      this.player.stopAll();
      this.fadingOut();
    } else if (this.nextScene) {
      this.scene.start('adultRoom');
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

  questions3() {

    if (this.inter5) {
      this.inter5 = false;
      this.scene.pause();
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.launch("message", { textArray: ['It\'s close by! I can feel it.'], returning: "hallAdultHOT" });
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  doorEnter() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.nextScene = true;
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  countDown(initialTime) {
    this.initialTime = initialTime;

    var timedEvent = this.time.addEvent({ delay: 1000, callback: onEvent, callbackScope: this, loop: true });

    function formatTime(seconds){
      var minutes = Math.floor(seconds/60);
      var partInSeconds = seconds%60;
      partInSeconds = partInSeconds.toString().padStart(2,'0');

      return `${minutes}:${partInSeconds}`;
    }

    function onEvent() {
      if (this.initialTime > 0) {
        this.initialTime -= 1;
        this.timer = this.initialTime;
        var text = 'Countdown: ' + formatTime(this.initialTime);
        this.timerDis.setText(text);
        this.registry.set("timerGlobal", this.initialTime);
      } else if (this.initialTime == 0) {
        this.initialTime -= 1;
        this.timer = this.initialTime;
        this.registry.set("timerGlobal", this.initialTime);
      }
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  fadingOut() {
    this.cameras.main.once('camerafadeoutcomplete', function (camera) {
      this.scene.start('GameOverScene', { endReached: false });
    }, this);

    this.cameras.main.fadeOut(2500);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
