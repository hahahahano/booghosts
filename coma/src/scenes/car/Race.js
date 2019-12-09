/*
  CAR MINIGAME
*/
import * as changeScene from '../../../src/scenes/changeScene.js';

export default class Race extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Race');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.new = data.new;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload () {

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create (data) {
    //Add change scene event listeners
    changeScene.addSceneEventListeners(this);

    this.carPlayer;

///////////////////////////////////////////////BACKGROUND//////////////////////////////////////////////////////////////////////////////////////////////
    const raceMap = this.make.tilemap({ key: "raceMap" });
    const raceTileset = raceMap.addTilesetImage("tuxmon-sample", "raceTiles1");
    const raceTileset1 = raceMap.addTilesetImage("ground_tileset1", "raceTiles2");
    const raceTileset2 = raceMap.addTilesetImage("road_tileset1", "raceTiles3");

    const raceGrassLayer = raceMap.createStaticLayer("grass", raceTileset1, 0, 0);
    const raceRoadLayer = raceMap.createStaticLayer("road", raceTileset2, 0, 0);

    const raceWorldLayer = raceMap.createStaticLayer("worldLayer", raceTileset, 0, 0);
    const raceFinish = raceMap.createStaticLayer("finish", raceTileset1, 0, 0);

    raceRoadLayer.setCollisionByProperty({ collides: true });
    raceGrassLayer.setCollisionByProperty({ collides: true });
    raceWorldLayer.setCollisionByProperty({ collides: true });
    raceFinish.setCollisionByProperty({ collides: true });

    this.physics.world.setBounds(0, 0, 80*16, 250*16);


    //this.physics.world.setBounds(0, 0, raceMap.widthInPixels, raceMap.heightInPixels);

///////////////////////////////////////////////LIVE CHARACTERS (CAR)///////////////////////////////////////////////////////////////////////////////////
    //Car
    this.carPlayer = this.physics.add
      .sprite(670, 3900, 'racer')
      .setSize(60, 60)
      .setScale(.25);

    this.carPlayer.setCollideWorldBounds(true);
    this.carPlayer.onWorldBounds = true;


    //Cameras
    const camera = this.cameras.main;
    camera.startFollow(this.carPlayer, true, 0.09, 0.09);
    camera.setBounds(0, 0, 80*16, 250*16);

    this.cameras.main.setZoom(1.75);

    //Keys
    this.cursors = this.input.keyboard.createCursorKeys();

///////////////////////////////////////////////COLLISIONS//////////////////////////////////////////////////////////////////////////////////////////////
    //Collides into objects (buildings, trees, etc.)
    this.physics.add.collider(this.carPlayer, raceWorldLayer, this.loser, null, this);
    //Collides with ending
    this.physics.add.collider(this.carPlayer, raceFinish, this.winner, null, this);

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    var raceMusic = this.sound.add('aralia');
    raceMusic.volume = .5;
    raceMusic.play();

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      raceBelowLayer.renderDebug(graphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
    });

    if (this.new) {
      this.scene.pause();
      this.scene.launch("RacePopup");
    }

    //UI
    const memhud = this.add.image(100, 45, 'mem_ui').setScale(1.25).setAlpha(.75).setScrollFactor(0);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update (time, delta) {
    const speed = 150;
    const prevVelocity = this.carPlayer.body.velocity.clone();

    //Stop any previous movement from the last frame
    this.carPlayer.body.setVelocity(0);

    //Horizontal movement
    if (this.cursors.left.isDown) {
      this.carPlayer.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.carPlayer.body.setVelocityX(speed);
    }

    //Vertical movement
    if (this.cursors.up.isDown) {
      this.carPlayer.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.carPlayer.body.setVelocityY(speed);
    }

    //Normalize and scale the velocity so that player can't move faster along a diagonal
    this.carPlayer.body.velocity.normalize().scale(speed);

    //Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown && this.cursors.up.isDown) {
      this.carPlayer.body.rotation = -45;
    } else if (this.cursors.right.isDown && this.cursors.up.isDown) {
      this.carPlayer.body.rotation = 45;
    } else if (this.cursors.left.isDown && this.cursors.down.isDown) {
      this.carPlayer.body.rotation = -135;
    } else if (this.cursors.right.isDown && this.cursors.down.isDown) {
      this.carPlayer.body.rotation = 135;
    } else if (this.cursors.left.isDown) {
      this.carPlayer.body.rotation = -90;
    } else if (this.cursors.right.isDown) {
      this.carPlayer.body.rotation = 90;
    } else if (this.cursors.up.isDown ) {
      this.carPlayer.body.rotation = 0;
    } else if (this.cursors.down.isDown) {
      this.carPlayer.body.rotation = 180;
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  winner (player) {
    this.sound.stopAll();
    this.scene.start('fth_video');
  }

  loser (player) {
    this.sound.stopAll();
    this.scene.start('TryAgain');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
