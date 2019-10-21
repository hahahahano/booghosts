/*
  FOREST SCENE
*/
//import * as ChangeScene from './ChangeScenes.js';

import Ghost_Player from "./ghost_player.js";
import msgBox from "./msgBox.js";

export default class Forest extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Forest');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.player = data.player;
    this.inventory = data.inventory;
    this.score = data.score;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {
    //BACKGROUND AND FOREGROUND
    //this.load.image('background', "./assets/images/cave_bg_test004.jpg");
    //this.load.image('waterfall', './assets/images/blue1.png');
    //this.load.image('foreground', "./assets/images/cave_fg_test003.png");

    this.load.image('forest_tiles', "./assets/textures/ground_tileset1.png");
    this.load.tilemapTiledJSON('forest_map', "./assets/tilemaps/forest_tilemap1.json");
    this.load.image('scenery', "./assets/images/forest_tilemap_overlay.png");
    this.load.image('forest_sky', "./assets/images/forest_sky.jpg");
    //OBJECTS
    this.load.image('acorn', "./assets/sprites/forest/acorn.jpg");
    this.load.image('exit', "./assets/sprites/boy_ghost.png");
    this.load.image('caveTestRock', './assets/sprites/test_rock.png');

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('ghost', "./assets/spriteSheets/ghost.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS
    this.load.audio('forest_music', "./assets/music/forest_music.mp3");
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    //ChangeScene.addSceneEventListeners(this);

    this.mem1;
    this.mem2;
    this.mem3;
    this.mem4;
    this.mem5;
    this.mem6;

    this.exit;
    this.rock;

    this.player;
    //this.inventory = [];
    //this.score = 0;

    this.invText = "";
    this.invTextDis = this.add.text(null, null, null);

    this.scoreText = "";
    this.scoreDis = this.add.text(null, null, null);

    this.nextScene = false;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    this.physics.world.setBounds(0, 0, 8192, 1280);
    const forest_sky = this.add.image(8192/2, 1280/2, 'forest_sky');
    forest_sky.setDepth(-10);
    forest_sky.setScale(2);
    //Platforms
    const forestMap = this.make.tilemap({ key: 'forest_map' });
    const tileset = forestMap.addTilesetImage('ground_tileset1', 'forest_tiles');
    // const tileset1 = map.addTilesetImage('shrub1', 'shrubs');

    this.forestWorldLayer = forestMap.createStaticLayer('platforms', tileset, 0, 0);
    this.forestWorldLayer.setDepth(-10);
    //this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);

    //Foreground test
    const scenery = this.add.image(8192/2, 1280/2, 'scenery');

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //Memory 1
    this.mem1 = this.add.zone(1500, 600).setSize(1, 1000);
    this.physics.world.enable(this.mem1);
    this.mem1.body.setAllowGravity(false);
    this.mem1.body.moves = false;
    //Memory 2
    this.mem2 = this.add.zone(2500, 600).setSize(1, 1000);
    this.physics.world.enable(this.mem2);
    this.mem2.body.setAllowGravity(false);
    this.mem2.body.moves = false;
    //Memory 3
    this.mem3 = this.add.zone(3500, 600).setSize(1, 1000);
    this.physics.world.enable(this.mem3);
    this.mem3.body.setAllowGravity(false);
    this.mem3.body.moves = false;
    //Memory 4
    this.mem4 = this.add.zone(4500, 600).setSize(1, 1000);
    this.physics.world.enable(this.mem4);
    this.mem4.body.setAllowGravity(false);
    this.mem4.body.moves = false;
    //Memory 5
    this.mem5 = this.add.zone(5500, 600).setSize(1, 1000);
    this.physics.world.enable(this.mem5);
    this.mem5.body.setAllowGravity(false);
    this.mem5.body.moves = false;
    //Memory 6
    this.mem6 = this.add.zone(6500, 600).setSize(1, 1000);
    this.physics.world.enable(this.mem6);
    this.mem6.body.setAllowGravity(false);
    this.mem6.body.moves = false;

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character
    //const spawnPoint = map.findObject("other objects", obj => obj.name === "Spawn Point");
    this.x = 150; //150
    this.y = 805;
    this.player = new Ghost_Player(this, this.x, this.y);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.followOffset.set(0, 175);

    this.cameras.main.setBounds(0, 0, 8192, 1180);

    //Gravity for this scene
    this.physics.world.gravity.y = 700;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Acorns
    this.acorns = this.physics.add.group();

    var i;
    for (i=0; i<2; i++) {
      this.createAcorns();
    }

    //Memories Collected (Score Display)
    this.updateScore();

    //Inventory
    this.updateInventory();

    //Creates exit (placeholder)
    this.exit = this.physics.add.sprite(7550, 250, 'boy_ghost');
    this.exit.setDepth(-1);
    this.exit.setCollideWorldBounds(true);

    this.car = this.physics.add.sprite(8000, 300, 'car_side');
    this.car.setDepth(-1);
    this.car.setCollideWorldBounds(true);



///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.forestWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.exit, this.car, this.rock], this.forestWorldLayer);

      //Hits an acorn
    this.physics.add.overlap(this.player.sprite, this.acorns, this.enemyHit, null, this);
      //Collects a memory piece

      //Exit
    this.kidText = ["Hey there! Are you busy? I need some help.", "You see, there's this event going on in the city, but my parents are too busy to take me there.",
    "I've got a car (don't ask me how), but I can't drive.", "Can you please do me a favor and take me into town?"]
    this.kidCount = 0;

    this.physics.add.overlap(this.player.sprite, this.exit, this.kidInter, null, this);
      //character and rock INTERACTION
    this.physics.world.addCollider(this.player.sprite, this.rock, this.moveRock, null, this);

    //INTERACTION

    //ZONES
      //Tutorial
    this.memoriesText = ["Memories come flooding back to you.", "Flashes of a kid... Your kid...cheerful and playful, running around everywhere.",
    "You drop off your son at school, watching him run off, excited for school. You smile... Children always seem so full of life.",
    "\"---! My teacher said there was this cool exhibit in town! Can we please go to the museum in the city? Pleease....\"",
    "\"Are we there yet? I'm so excited! I can't wait to see---....\"", "You feel a flash of pain flare briefly across your body...",
    "You realize you're in a coma. This isn't really you - this form is your spirit....", "How am I going to get out of this coma...."];

    this.physics.add.overlap(this.player.sprite, this.mem1, this.memories1, null, this);
    this.physics.add.overlap(this.player.sprite, this.mem2, this.memories2, null, this);
    this.physics.add.overlap(this.player.sprite, this.mem3, this.memories3, null, this);
    this.physics.add.overlap(this.player.sprite, this.mem4, this.memories4, null, this);
    this.physics.add.overlap(this.player.sprite, this.mem5, this.memories5, null, this);
    this.physics.add.overlap(this.player.sprite, this.mem6, this.memories6, null, this);

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.forestMusic = this.sound.add('forest_music');
    this.forestMusic.volume = .6;
    this.forestMusic.play();

///////////////////////////////////////////////DEBUGGER////////////////////////////////////////////////////////////////////////////////////////////////
    this.input.keyboard.once("keydown_D", event => {
      // Turn on physics debugging to show player's hitbox
      this.physics.world.createDebugGraphic();

      // Create worldLayer collision graphic above the player, but below the help text
      const graphics = this.add
        .graphics()
        .setAlpha(0.75)
        .setDepth(20);
      this.forestWorldLayer.renderDebug(graphics, {
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

    this.acorns.children.each(
      function (b) {
        if (b.y > this.forestWorldLayer.height) {
          this.acorns.remove(b, null, true);
          this.createAcorns();
        }
      }.bind(this)
    );

    if (this.nextScene) {
      // fade to white

      this.forestMusic.stop();
      this.scene.start('Race', { player: this.player, inventory: this.inventory, score: this.score });
      return;
    }

    if (this.player.sprite.y > this.forestWorldLayer.height) {
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

  }

    //Searching the bushes
  interactBush() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      //this.plants
      //this.enemyHit();
    }
  }
    //Interacting with the kid NPC
  kidInter(){
    switch (this.kidCount)
      {
        case 0:
          this.kidBox = new msgBox(this, this.kidText[this.kidCount]);
          this.kidCount++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.kidBox.hideMessageBox();
            this.kidBox = new msgBox(this, this.kidText[this.kidCount]);
            this.kidCount++;
            break;
          }

        case 2:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.kidBox.hideMessageBox();
            this.kidBox = new msgBox(this, this.kidText[this.kidCount]);
            this.kidCount++;
            break;
          }

        case 3:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.kidBox.hideMessageBox();
            this.kidBox = new msgBox(this, this.kidText[this.kidCount]);
            this.kidCount++;
            break;
          }

        case 4:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.kidBox.hideMessageBox();
            this.kidCount++;
            break;
          }

        case 5:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.playNextScene();
            break;
          }
      }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Zones
  memories1() {
    this.memDis = this.add
      .text(1700, 632, this.memoriesText[0], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
  }

  memories2() {
    this.memDis = this.add
      .text(2500, 536, this.memoriesText[1], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
  }

  memories3() {
    this.memDis = this.add
      .text(3400, 568, this.memoriesText[2], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
  }

  memories4() {
    this.memDis = this.add
      .text(4500, 632, this.memoriesText[3], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
  }

  memories5() {
    this.memDis = this.add
      .text(5800, 632, this.memoriesText[4], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
  }

  memories6() {
    this.memDis = this.add
      .text(6500, 568, this.memoriesText[5], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);

    this.memDis = this.add
      .text(7000, 568, this.memoriesText[6], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);

    this.memDis = this.add
      .text(7000, 645, this.memoriesText[7], {
        font: "18px monospace",
        backgroundColor: "#000",
        fill: "#ffffff",
        wordWrap: { width: 400, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
      var i = 0;


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
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Ending is triggered
  playNextScene(player, exit) {
    this.nextScene = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  createAcorns(acorn) {
    var x = Phaser.Math.Between(-1000, 1200);

    var acorn = this.acorns.create(this.player.sprite.x + x, 0, "acorn");
    acorn.setScale(0.05);
    acorn.setDepth(5);
    acorn.setVelocity(Phaser.Math.Between(-0, 0));
    acorn.allowGravity = false;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player) {
    this.player.destroy(this.x, this.y);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
