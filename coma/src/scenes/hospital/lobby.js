/*
  HOSPITAL SCENE - Lobby
*/
import * as changeScene from '../changeScene.js';
import Ghost_Player from "../characters/ghost_player.js";

export default class lobby extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Hospital');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = this.registry.get("inventory");
    this.score = this.registry.get("score");
    this.hospitalCheck = this.registry.get("hospitalCheck");
    if (this.hospitalCheck) {
      this.timer = this.registry.get("timerGlobal");
    } else {
      this.timer = 45;
      this.hospitalCheck = false;
    }

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

    this.inter2 = true;
    this.instructBox;

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


    //PLAYS BACKGROUND MUSIC
    this.hosMusic = this.sound.add('hospital_music');
    this.hosMusic.stop();
    this.hosMusic.volume = .5;
    this.hosMusic.play();
    this.registry.set("hosMusic", this.hosMusic);

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    this.physics.world.setBounds(0, 0, 2048, 1024);

    //Platforms
    const hospitalMap = this.make.tilemap({ key: 'lobby_map' });
    const hospitalTileset = hospitalMap.addTilesetImage('hospital_tileset1', 'hospital_tiles');

    this.hospitalWall = hospitalMap.createStaticLayer('wall', hospitalTileset, 0, 0);
    this.hospitalWorldLayer = hospitalMap.createStaticLayer('platforms', hospitalTileset, 0, 0);

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Lobby Desk
    const desk = this.add
      .image(200, 815, 'desk')
      .setScale(.5);

    //Doors
    this.doors = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const doorObjects = hospitalMap.getObjectLayer('DoorSpawn')['objects'];
    doorObjects.forEach(doorObject => {
      const door = this.doors.create(doorObject.x, doorObject.y, 'hosDoor');
    });

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //questionzone1: Explains the movements
    this.zoneStart2 = this.add.zone(100, 900).setSize(500, 500);
    this.physics.world.enable(this.zoneStart2);
    this.zoneStart2.body.setAllowGravity(false);
    this.zoneStart2.body.moves = false;

    //Second Floor Overlay
    this.overlay = hospitalMap.createStaticLayer('overlay', hospitalTileset, 0, 0);

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

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.hospitalWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite], this.hospitalWorldLayer);

    this.physics.add.overlap(this.player.sprite, this.zoneStart2, this.questions, null, this);

      //Exit
    this.physics.add.overlap(this.player.sprite, this.doors, this.doorEnter, null, this);

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    /*this.input.keyboard.once("keydown_D", event => {
      this.physics.world.createDebugGraphic();

      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.hospitalWorldLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });*/

///////////////////////////////////////////////TIMER///////////////////////////////////////////////////////////////////////////////////////////////////
    var blackbox = this.add.image(600,-100,'caveTestRock').setScale(4).setScrollFactor(0);
    var minutes = Math.floor(this.timer/60);
    var partInSeconds = this.timer%60;
    partInSeconds = partInSeconds.toString().padStart(2,'0');
    var text = 'Countdown: ' + `${minutes}:${partInSeconds}`;

    this.timerDis = this.add
      .text(450, 26, text, {
        font: "28px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
    this.countDown(this.timer);

    //UI
    //const memhud = this.add.image(100, 45, 'mem_ui').setScale(1.25).setAlpha(.75).setScrollFactor(0);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    this.player.update();

    if (this.player.sprite.y > 708) {
      this.overlay.setVisible(true);
    } else if (this.player.sprite.y < 708) {
      this.overlay.setVisible(false);
    }

    if (this.timer == 0) {
      this.player.stopAll();
      this.fadingOut();
    } else if (this.nextScene) {
      this.scene.start(this.rand);
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

      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.pause();
      if (!this.hospitalCheck) {
        this.scene.launch("message", { textArray: ['I think my body is here. I feel some sort of pull, but I don\'t know which door to go through.',
          '...There\'s something weird. It feels like there\'s a time limit. I better return to my body fast!'], returning: "Hospital", character: "ghost" });
        this.hospitalCheck = true;
        this.registry.set("hospitalCheck", true);
      } else {
        this.scene.launch("message", { textArray: ['I\'m back where I started..', '...Time\'s running out. I better do what I want to and return to my body fast!'], returning: "Hospital", character: "ghost" });
      }
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  doorEnter() {
    var potentialscenes = ['hallKidCOLD','hallKidCOLD','hallKidHOT'];

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
