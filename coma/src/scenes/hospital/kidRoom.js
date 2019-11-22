/*
  HOSPITAL SCENE - Room (kid)
*/
import * as changeScene from '../changeScene.js';
import Ghost_Player from "../characters/ghost_player.js";

export default class kidRoom extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('kidRoom');
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

    this.door;
    this.rand;

    this.player;
    this.kidSpirit;
    this.talked = false;

    this.inter2 = true;

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
    this.physics.world.setBounds(0, 0, 1280, 1024);

    //Platforms
    const hospitalMap = this.make.tilemap({ key: 'hospital_room1' });
    const hospitalTileset = hospitalMap.addTilesetImage('hospital_tileset2', 'hospital_tiles2');
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('world', hospitalTileset, 0, 0);

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //questionzone1: Explains the movements
    this.zoneStart2 = this.add.zone(350, 750).setSize(200, 200);
    this.physics.world.enable(this.zoneStart2);
    this.zoneStart2.body.setAllowGravity(false);
    this.zoneStart2.body.moves = false;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Doors
    this.door = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorObjects = hospitalMap.getObjectLayer('DoorSpawn')['objects'];
    doorObjects.forEach(doorObject => {
      const door = this.door.create(doorObject.x, doorObject.y, 'hosRoom_door');
      /*if (plantObject.type === "map") {
        this.mapBushX = plantObject.x;
        this.mapBushY = plantObject.y;
      } else if (plantObject.type === "mem") {
        this.memBushX = plantObject.x;
        this.memBushY = plantObject.y;
      }*/
    });

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character, kid spirit, and kid body in bed
    const otherObjects = hospitalMap.getObjectLayer('otherObjects')['objects'];
    otherObjects.forEach(otherObject => {
      if (otherObject.name === "Spawn Point") {
        this.player = new Ghost_Player(this, otherObject.x, otherObject.y);
        this.player.sprite.setCollideWorldBounds(true);
        this.player.sprite.setDepth(1);
      } else if (otherObject.name === "bed") {
        this.kid = this.physics.add.sprite(otherObject.x, otherObject.y, 'kid');
        this.kid.setCollideWorldBounds(true);
      } else if (otherObject.name === "kidSpawn") {
        this.kidSpirit = this.physics.add.sprite(otherObject.x, otherObject.y, 'boy_ghost');
        this.kidSpirit.setCollideWorldBounds(true);
      }
    });

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 1280, 1024);
    
    //Gravity for this scene
    this.physics.world.gravity.y = 700;

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.hospitalWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.kid, this.kidSpirit, this.door], this.hospitalWorldLayer);
    this.physics.add.overlap(this.player.sprite, this.zoneStart2, this.questions, null, this);

      //Collects a memory piece

      //Exit
    this.physics.add.overlap(this.player.sprite, this.door, this.doorExit, null, this);

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
      this.scene.start(this.rand);
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
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.pause();
      this.scene.launch("message", { textArray: ['I feel a large presence here'], returning: "kidRoom" });
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  kidTalked() {
    if (!this.talked && this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.talked = true;
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.pause();
      this.kidReturn = ["Oh hi. What are you doing here?", "What about me? Well, that's me in the bed.", "I just felt like I had to come here for some reason. That's why I needed a ride to the city. I guess that pull I felt was my body calling to my spirit.",
      "It looks like I'm in a coma. What should I do now? I like running around with no one to tell me what to do. But I miss my family and friends.", "Yeah, you're right. I should return to my body. I should wake up. I'm sure there's people waiting for me.",
      "Well, thanks for helping me! Maybe I'll see you later."];
      this.scene.launch("message", { textArray: this.kidReturn, returning: "kidRoom" });
      this.registry.set("talked", this.talked);
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  doorExit() {
    var potentialscenes = ['hallAdultCOLD','hallAdultCOLD','hallAdultHOT'];

    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.rand = potentialscenes[Math.floor(Math.random() * potentialscenes.length)];
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
