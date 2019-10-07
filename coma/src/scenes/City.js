/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import LGSpirit from "./LGSpirit.js";

export default class City extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('city');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.score = data.score;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {
    //BACKGROUND AND FOREGROUND
    this.load.image('background', "./assets/images/city_sky1.jpg",{
      frameWidth: 3968,
      frameHeight: 1024,
    });

    this.load.image('tiles', "./assets/textures/city_tileset1.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/city_tilemap1.json");

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/run_spritesheet1.png", {
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
    this.body;
    this.msgBox;

    this.lg_spirit;
    this.talked = false;
    this.sm_spirit1;
    this.player;

    this.score = 0;

    this.scoreText;
    this.gameOver = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const background = this.add.image(3968/2, 512, 'background');
    this.physics.world.setBounds(0, 0, 3968, 1024);

    //Platforms
    const map = this.make.tilemap({ key: 'map' });
    const tileset = map.addTilesetImage('city_tileset1', 'tiles');

    this.buildings = map.createStaticLayer('buildings', tileset, 0, 0);


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
    this.scoreText = this.add
      .text(16, 16, "Memories: 0", {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0);

    //Creates ghost's human body
    this.body = this.physics.add.sprite(1400, 270, 'body');
    this.body.setCollideWorldBounds(true);

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates large spirit


    //Creates small spirits
    this.sm_spirit1 = this.physics.add.sprite(500, 1840, 'sm_spirit');
    this.sm_spirit1.setScale(0.15);
    this.sm_spirit1.setCollideWorldBounds(true);


    this.tweens.add({
      targets: this.sm_spirit1,
      x: 900,
      ease: 'Linear',
      yoyo: true,
      duration: 5000,
      repeat: -1
    });

    //Creates player character
    //const spawnPoint = map.findObject("Objects", obj => obj.name === "Spawn Point");
    this.player = new Ghost_Player(this, 100, 0);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 3968, 1024);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

///////////////////////////////////////////////COLLISIONS AND INTERACTIONS/////////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.buildings.setCollisionByProperty({ collides: true });

    this.physics.world.addCollider( [this.player.sprite], this.buildings);

      //Hits an enemy
    this.physics.add.overlap(this.player.sprite, this.sm_spirit1, this.enemyHit, null, this);
      //Collects a memory piece
    this.physics.world.addCollider(this.player.sprite, this.mems, this.collectMem, null, this);
      //Collects the scroll
    this.physics.world.addCollider(this.player.sprite, this.collectscroll, null, this);

    //INTERACTION
      //With large spirit
      //With bushes
    this.physics.add.overlap(this.player.sprite, this.plants, this.interactBush, null, this);
      //With body (need to code in the choice to leave~)
    this.physics.add.overlap(
      this.player.sprite,
      this.body,
      this.returnBody,
      null,
      this
    );

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.music = this.sound.add('cave_music1');
    this.music.volume = .3;
    this.music.play();

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
    this.lg_spirit.update();

    if (this.gameOver) {
      this.music.stop();
      this.scene.start('GameOverScene',{ score: this.score });
      return;
    }

    if (this.player.sprite.y > this.frontBuildings.height) {
      this.player.destroy();
    }

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Interactions
  /*instructions(player) {
    var instructions = ["Hey there. I'm glad you're awake. It's me. You. Hahaha.",
    "You can move around with the arrow keys. You should probably explore the area, but be careful; it looks like that small spirit is angry and might hurt you."]
  }*/

  interactLG() {
    if (this.player.keys.x.isDown) {
      this.lg_spirit.interact(1350, 700, this.scrolls, this.talked)
    }
  }

  hideMessageBox(msgBox) {
    this.msgBox.destroy()
  }

  interactBush() {
    if (this.player.keys.x.isDown) {
      //this.plants
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting items
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    //Update the score
    this.score += 1;
    this.scoreText.setText("Memories: " + this.score);
  }


/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Returning to the body, triggers end
  returnBody(player, body) {
    this.gameOver = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player, sm_spirit) {
    this.player.destroy();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
