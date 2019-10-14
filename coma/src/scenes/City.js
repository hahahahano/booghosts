/*globals Phaser*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";

export default class City extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('City');
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
    this.load.image('background', "./assets/images/background.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });
    this.load.image('waterfall', './assets/images/blue1.png');
    this.load.image('foreground', "./assets/images/cave_fg_test003.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
=======
    this.load.image('background', "./assets/images/city_sky1.jpg",{
      frameWidth: 3968,
      frameHeight: 1024,
>>>>>>> master
    });

    this.load.image('tiles', "./assets/textures/city_tileset1.png");
    this.load.tilemapTiledJSON('map', "./assets/tilemaps/city_tilemap1.json");

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");

    //LIVE CHARACTERS (ghost, people, kid NPC)
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

    this.player;

    this.scoreText;
    this.gameOver = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const background = this.add.image(768, 1229, 'background');
    this.physics.world.setBounds(0, 0, 1536, 3000);


=======
    const background = this.add.image(3968/2, 512, 'background');
    this.physics.world.setBounds(0, 0, 3968, 1024);
>>>>>>> master

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
    //Creates kid NPC


    //Creates people

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

      //Collects a memory piece
    this.physics.world.addCollider(this.player.sprite, this.mems, this.collectMem, null, this);

    //INTERACTION
      //With kid NPC

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
    /*this.music = this.sound.add('cave_music1');
    this.music.volume = .3;
    this.music.play();*/

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

    if (this.gameOver) {
      //this.music.stop();
      this.scene.start('GameOverScene', { score: this.score });
      return;
    }

    /*if (this.player.sprite.y > this.frontBuildings.height) {
      this.player.destroy();
    }*/

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Interactions
  interactKid() {
    if (this.player.keys.x.isDown) {

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
  enemyHit(player) {
    this.player.destroy();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
