/*
  CAVE SCENE
*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import LGSpirit from "./LGSpirit.js";
import drag from "./drag.js";
import msgBox from "./msgBox.js";

export default class Caves extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('caves');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    //For later scenes (pass the memories score)
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {
    //BACKGROUND AND FOREGROUND
    this.load.image('caveBackground', "./assets/images/cave/cave_bg.jpg",{
      frameWidth: 2304, //432
      frameHeight: 3687, // 32
    });
    this.load.image('caveWaterfall', './assets/images/cave/blue1.png');
    this.load.image('caveForeground', "./assets/images/cave/cave_fg_test003.png",{
      frameWidth: 1536, //432
      frameHeight: 2458, // 32
    });


    this.load.image('caveTiles', "./assets/textures/cave_tileset1.png");
    this.load.image('shrub', "./assets/sprites/shrub1.png");
    this.load.tilemapTiledJSON('caveMap', "./assets/tilemaps/cave_tilemap5.json")

    //OBJECTS
    this.load.image('mem_piece', "./assets/sprites/mem.png");
    this.load.image('exit', "./assets/sprites/bones_sketch.png");
    this.load.image('caveScroll', './assets/sprites/cave/map_sketch.png');
    this.load.image('caveTestRock', './assets/sprites/test_rock.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('lg_spirit', "./assets/spriteSheets/cave/large_spirit.png", {
      frameWidth: 395,
      frameHeight: 596
    });
    this.load.spritesheet('sm_spirit', "./assets/spriteSheets/cave/small_spirit.png", {
      frameWidth: 500,
      frameHeight: 338
    });
    this.load.spritesheet('ghost', "./assets/spriteSheets/ghost.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS
    this.load.audio('cave_music', "./assets/music/cave_music.mp3");
    this.load.audio('left_step', "./assets/sounds/left_step.mp3");
    this.load.audio('right_step', "./assets/sounds/right_step.mp3");
    this.load.audio('bush', "./assets/sounds/bushes.mp3");
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.mems;
    this.exit;
    //this.rock;
    this.scroll;
    this.cavePlants;
    this.bushMsg = new msgBox(this, null);
    this.bush = true;

    this.inventory = [];
    this.invText = "";
    this.invTextDis = this.add.text(null, null, null);

    this.instructBox;
    this.zoneStart;
    this.collectTut = 0;
    this.zoneMem;
    this.memsBox = new msgBox(this, null);
    this.exitChecked = 0;

    this.lg_spirit;
    this.scrolls = false;
    this.talked = 0;
    this.sm_spirit1;
    this.player;

    this.score = 0;
    this.scoreText = "";
    this.scoreDis = this.add.text(null, null, null);

    this.nextScene = false;
    this.leftStep = this.sound.add('left_step');
    this.leftStep.volume = .3;

    this.rightStep = this.sound.add('right_step');
    this.rightStep.volume = .3;

    this.bushFX = this.sound.add('bush');
    this.bushFX.volume = 1.75;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const caveBackground = this.add.image(1152, 1536, 'caveBackground');
    this.physics.world.setBounds(0, 0, 2304, 3072);

    //Particles - Waterfall
    var waterParticles = this.add.particles('caveWaterfall');
    var waterEmitter = waterParticles.createEmitter({
        alpha: { start: 1, end: 0.25, ease: 'Expo.easeOut' },
        lifespan: 5000,
        speedX:{min: -70, max: 70},
        speedY:{min: -100, max:1000},
        scale: {start: 1.25, end: 0},
        blendMode: 'ADD'
    });
    waterEmitter.setPosition(1075, -0);

    //Platforms
    const caveMap = this.make.tilemap({ key: 'caveMap' });
    const caveTileset = caveMap.addTilesetImage('cave_tileset1', 'caveTiles');
    this.caveWorldLayer = caveMap.createStaticLayer('platforms', caveTileset, 0, 0);

    //Foreground test
    //const caveForeground = this.add.image(768, 1229, 'caveForeground');
    //caveForeground.setDepth(10);
    //caveForeground.setScrollFactor(0);

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Memory Pieces
    this.mems = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const otherObjects = caveMap.getObjectLayer('otherObjects')['objects'];
    otherObjects.forEach(otherObject => {
      if (otherObject.name === "mem") {
        const memPie = this.mems.create(otherObject.x, otherObject.y, 'mem_piece');
      } else if (otherObject.name === "exit") {
        this.exit = this.physics.add.sprite(otherObject.x, otherObject.y, 'exit');
        this.exit.setCollideWorldBounds(true);
      } /*else if (otherObject.name === "scroll") {
        this.scroll = this.physics.add.sprite(otherObject.x, otherObject.y, 'caveScroll');
        this.scroll.setDepth(20);
      }*/
    });

    //Memories Collected (Score Display)
    this.updateScore();

    //Items Collected (Inventory Display)
    this.updateInventory();

    //Create test rock to move
    //this.rock = this.physics.add.sprite(300, 1825, 'caveTestRock');
    //this.rock.setCollideWorldBounds(true);

    //Creates planta
    this.cavePlants = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const plantObjects = caveMap.getObjectLayer('plantSpawn')['objects'];
    plantObjects.forEach(plantObject => {
      const cavePlant = this.cavePlants.create(plantObject.x, plantObject.y-34, 'shrub');
    });

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //Tutorial Zone: Explains the movements
    this.zoneStart = this.add.zone(250, 2450).setSize(800, 400);
    this.physics.world.enable(this.zoneStart);
    this.zoneStart.body.setAllowGravity(false);
    this.zoneStart.body.moves = false;
    //Memory Zone: Explains the memory pieces
    this.zoneMem = this.add.zone(1250, 2500).setSize(450, 200);
    this.physics.world.enable(this.zoneMem);
    this.zoneMem.body.setAllowGravity(false);
    this.zoneMem.body.moves = false;

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates spirits
      //Small Spirits
    this.sm_spirits = this.physics.add.group();

    const spiritObjects = caveMap.getObjectLayer('spiritSpawn')['objects'];
    spiritObjects.forEach(spiritObject => {
      if (spiritObject.name === "small") {
        const smallSp = this.sm_spirits.create(spiritObject.x, spiritObject.y, 'sm_spirit');
        smallSp.setScale(0.15);
        smallSp.setCollideWorldBounds(true);

        switch(spiritObject.id) {
          case 111:
            this.tweens.add({
              targets: smallSp,
              x: 1960,
              ease: 'Linear',
              yoyo: true,
              duration: 5000,
              repeat: -1
            });
            break;

          case 112:
            this.tweens.add({
              targets: smallSp,
              x: 1472,
              ease: 'Linear',
              yoyo: true,
              duration: 4500,
              repeat: -1
            });
            break;

          case 113:
            this.tweens.add({
              targets: smallSp,
              x: 2046,
              ease: 'Linear',
              yoyo: true,
              duration: 1500,
              repeat: -1
            });
            break;

          case 114:
            this.tweens.add({
              targets: smallSp,
              x: 30,
              ease: 'Linear',
              yoyo: true,
              duration: 1500,
              repeat: -1
            });
            break;
        }
        //Large Spirit
      } else if (spiritObject.name === "large") {
        this.lg_spirit = new LGSpirit(this, spiritObject.x, spiritObject.y);
        this.lg_spirit.sprite.setCollideWorldBounds(true);
      }
    });

    //Creates player character
    const spawnPoint = caveMap.findObject("otherObjects", obj => obj.name === "Spawn Point");
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.player = new Ghost_Player(this, this.x, this.y);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 2304, 2700);

    //Gravity for this scene
    this.physics.world.gravity.y = 400;

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.caveWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirits, this.lg_spirit.sprite, this.exit], this.caveWorldLayer);

      //Hits an enemy
    this.physics.add.overlap(this.player.sprite, this.sm_spirits, this.enemyHit, null, this);
      //Collects a memory piece
    this.physics.add.overlap(this.player.sprite, this.mems, this.collectMem, null, this);
      //Collects the scroll
    //this.physics.world.addCollider(this.player.sprite, this.scroll, this.collectscroll, null, this);
      //character and rock INTERACTION
    //this.physics.add.collider(this.player.sprite, this.rock, this.moveRock, null, this);

    //INTERACTION
      //With large spirit
    this.physics.add.overlap(this.player.sprite, this.lg_spirit.sprite, this.interactLG, null, this);
      //With bushes
    this.physics.add.overlap(this.player.sprite, this.cavePlants, this.interactBush, null, this);
      //With exit
    this.physics.add.overlap(this.player.sprite, this.exit, this.exitInstruct, null, this);

    //ZONES
      //Tutorial
    this.instructionsText = ["Hey there. I'm glad you're awake. It's me. You. Hahaha. (Press X)", "You can move around with the arrow keys and interact with X.",
    "You should probably explore the area; maybe you'll remember something about yourself.", "But be careful; it looks like that small spirit could hurt you."];
    this.inter = 0;
    this.physics.add.overlap(this.player.sprite, this.zoneStart, this.instructions, null, this);
      //Memory Pieces
    this.MemsText = ["That looks familiar.", "I think if you pick it up, you might remember something about yourself."];
    this.memIntro = 0;
    this.physics.add.overlap(this.player.sprite, this.zoneMem, this.memsInstruct, null, this);

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.caveMusic = this.sound.add('cave_music');
    this.caveMusic.volume = .3;
    this.caveMusic.play();

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create caveWorldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.caveWorldLayer.renderDebug(graphics, {
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

    if (this.nextScene) {
      // fade to white

      this.caveMusic.stop();
      this.scene.start('CTFT', { player: this.player, inventory: this.inventory, score: this.score });
      return;
    }

    if (this.player.sprite.y > this.caveWorldLayer.height) {
      this.player.destroy();
    }
  }

  updateInventory() {
    if (this.inventory.length == 0) {
      this.invTextDis.destroy();

      this.invText = "Inventory: Empty";
    } else {
      this.invTextDis.destroy();
      this.invText = "Inventory: " + this.inventory[0];

      var itemNum;
      for (itemNum = 1; itemNum < this.inventory.length; itemNum++) {
        this.invText += ("\n\t\t\t\t\t\t\t\t\t\t\t" + this.inventory[itemNum]);
      }
    }

    this.invTextDis = this.add
      .text(16, 36, this.invText, {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
  }

  updateScore() {
    this.scoreDis.destroy();
    this.scoreText = "Memories: " + String(this.score);

    this.scoreDis = this.add
      .text(16, 16, this.scoreText, {
        font: "18px monospace",
        fill: "#ffffff",
        padding: { x: 20, y: 10 }
      })
      .setScrollFactor(0)
      .setDepth(50);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Interactions
    //Push and Pull the rock
  moveRock(){
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      //this.rock.velocity(1850, 2325, this.scrolls, this.talked, this.score);
    }
  }
    //Dialogue with the Large Spirit
  interactLG() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.lg_spirit.interact(1850, 2325, this.scrolls, this.talked, this.score);
    }

    if (this.talked === 6) {
      var index = this.inventory.indexOf("Scroll");
      if (index > -1) {
        this.inventory.splice(index, 1);
      }

      this.updateInventory();
      this.updateScore();
      this.talked++;
    }
  }
    //Searching the bushes ****FIX TEXT BOX BOUNDS
  interactBush(player, bush) {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250) && this.talked >= 3) {
        //Scroll

      if (bush.x >= 2256.66 && bush.y == 990 && !this.scrolls) {
        this.bushFX.play();
        this.scrolls = true;
        this.inventory.push("Scroll");
        this.updateInventory();

        this.bushMsg.hideMessageBox();
        this.caveScroll = this.physics.add.sprite(2256, 990, 'caveScroll');
        this.tweens.add({
          targets: this.caveScroll,
          y: 890,
          ease: 'Linear',
          duration: 1500,
          hideOnComplete: true
        });
        this.bushMsg = new msgBox(this, "You found a map! But you can't read it. Maybe it's someone else's.");
        this.bush = false;
      } else if (this.bush) {
        this.bushFX.play();
        this.bushMsg.hideMessageBox();
        this.bushMsg = new msgBox(this, "You didn't find anything in this bush...");
        this.bush = false;
      } else if (!this.bush) {
        this.bushMsg.hideMessageBox();
        this.bush = true;
      }
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Zones
    //Tutorial Zone
  instructions(instructBox) {
    //this.instructBox = new msgBox(this, this.instructionsText, this.instructionsText.length);
    //this.player.sprite.immovable();
    //this.launch('cave_instructions');


    switch (this.inter)
      {
        case 0:
          //this.physics.pause();

          this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
          this.inter++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
            this.inter++;
            break;
          }

        case 2:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
            this.inter++;
            break;
          }

        case 3:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
            this.inter++;
            break;
          }

        case 4:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            //this.physics.resume();
            break;
          }
      }
  }
    //Memory Pieces Zone
  memsInstruct(memsBox) {
    if (this.score >= 1) {
      switch (this.collectTut)
      {
        case 0:
          this.memsBox.hideMessageBox();
          this.memsBox = new msgBox(this, "Whoa. Did you feel that? I felt a hazy memory there. A car. Hm.");
          this.collectTut ++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.memsBox.hideMessageBox();
            this.collectTut ++;
          }
          break;
      }
    } else{
      switch (this.memIntro)
      {
        case 0:
          this.memsBox = new msgBox(this, this.MemsText[this.memIntro]);
          this.memIntro++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.memsBox.hideMessageBox();
            this.memsBox = new msgBox(this, this.MemsText[this.memIntro]);
            this.memIntro++;
          }
          break;

        case 2:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.memsBox.hideMessageBox();
            this.memIntro++;
          }
          break;
      }
    }
  }
    //Exiting Scene Zone
  exitInstruct() {
    //this.exitText = new msgBox(this, "This is the exit. Are you sure you want to leave?");

    if (this.talked >= 3) {
      if (this.exitChecked == 2 && this.input.keyboard.checkDown(this.player.keys.x, 250)) {
        this.playNextScene();
      } else if (this.exitChecked == 1 && this.input.keyboard.checkDown(this.player.keys.x, 250)) {
          this.exitText.hideMessageBox();
          this.exitChecked++;
      } else if (this.exitChecked == 0) {
        this.exitText = new msgBox(this, "This is the exit. Are you sure you want to leave?");
        this.exitChecked++;
      }
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting Items
    //Collecting Memory Piece
  collectMem(player, mem_piece) {
    mem_piece.disableBody(true, true);

    this.score += 1;
    this.updateScore();
  }
    //Collecting Scroll
  /*collectscroll(player, scroll) {
    scroll.disableBody(true, true);

    this.scrolls = true;
  }*/
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Leaving cave triggers next scene
  playNextScene(player, exit) {
    this.nextScene = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player, sm_spirit) {
    this.player.destroy(this.x, this.y);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
