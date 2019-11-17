/*
  FOREST SCENE
*/
import * as changeScene from './changeScene.js';
import Ghost_Player from "./ghost_player.js";

export default class Forest extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('Forest');
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
    /*
    //BACKGROUND AND FOREGROUND
    this.load.image('forest_tiles', "./assets/textures/ground_tileset1.png");
    this.load.tilemapTiledJSON('forest_map', "./assets/tilemaps/forest_tilemap1.json");
    this.load.image('scenery', "./assets/images/forest_tilemap_overlay.png");
    this.load.image('forest_sky', "./assets/images/forest_sky.jpg");

    //OBJECTS
    this.load.image('acorn', "./assets/sprites/forest/acorn.jpg");
    this.load.image('boy_ghost', "./assets/sprites/boy_ghost.png");
    this.load.image('car_side', "./assets/sprites/car_side.png");
    this.load.image('caveTestRock', './assets/sprites/test_rock.png');
    this.load.image('caveEntrance', "./assets/sprites/bones_sketch.png")

    //LIVE CHARACTERS (ghost, large spirit, small spirits)
    this.load.spritesheet('ghost', "./assets/spriteSheets/ghost.png", {
      frameWidth: 148,
      frameHeight: 200
    });

    //SOUNDS
    this.load.audio('forest_music', "./assets/music/forest_music.mp3");
    */
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    changeScene.addSceneEventListeners(this);

    this.mem1;
    this.mem2;
    this.mem3;
    this.mem4;
    this.mem5;
    this.mem6;
    this.memCheck = 0;

    this.exit;
    this.rock;
    this.mems;
    this.bush = true;
    this.bushFound = false;

    this.player;

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
    this.kidtoken = true;
    this.kidTalked = false;

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

    this.forestWorldLayer = forestMap.createStaticLayer('platforms2', tileset, 0, 0);
    this.forestWorldLayer.setDepth(-10);
    //this.plants = map.createStaticLayer('plants', tileset1, 0, -1175);

    //Foreground test
    const scenery = this.add.image(8192/2, 1280/2, 'scenery');
    //scenery.setDepth(-2);

    //foreground.setDepth(10);
    //foreground.setScrollFactor(0);

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //Memory 1
    this.mem1 = this.add.zone(1250, 600).setSize(1, 1200);
    this.physics.world.enable(this.mem1);
    this.mem1.body.setAllowGravity(false);
    this.mem1.body.moves = false;
    //Memory 2
    this.mem2 = this.add.zone(2400, 600).setSize(1, 1200);
    this.physics.world.enable(this.mem2);
    this.mem2.body.setAllowGravity(false);
    this.mem2.body.moves = false;
    //Memory 3
    this.mem3 = this.add.zone(3520, 600).setSize(1, 1200);
    this.physics.world.enable(this.mem3);
    this.mem3.body.setAllowGravity(false);
    this.mem3.body.moves = false;
    //Memory 4
    this.mem4 = this.add.zone(5055, 600).setSize(1, 1200);
    this.physics.world.enable(this.mem4);
    this.mem4.body.setAllowGravity(false);
    this.mem4.body.moves = false;
    //Memory 5
    this.mem5 = this.add.zone(6150, 600).setSize(1, 1200);
    this.physics.world.enable(this.mem5);
    this.mem5.body.setAllowGravity(false);
    this.mem5.body.moves = false;
    //Memory 6
    this.mem6 = this.add.zone(7585, 600).setSize(1, 1200);
    this.physics.world.enable(this.mem6);
    this.mem6.body.setAllowGravity(false);
    this.mem6.body.moves = false;

///////////////////////////////////////////////LIVE CHARACTERS (ghost, large spirit, small spirits)////////////////////////////////////////////////////
    //Creates player character
    const spawnPoint = forestMap.findObject("otherObjects", obj => obj.name === "Spawn Point");
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.player = new Ghost_Player(this, this.x, this.y);
    this.player.sprite.setCollideWorldBounds(true);

    //Cameras
    this.cameras.main.startFollow(this.player.sprite);

    this.cameras.main.setBounds(0, 0, 8192, 1280);

    //Gravity for this scene
    this.physics.world.gravity.y = 700;

///////////////////////////////////////////////OBJECTS/////////////////////////////////////////////////////////////////////////////////////////////////
    //Acorns
    this.acorns = this.physics.add.group({allowGravity: false});

    var i;
    for (i=0; i<1; i++) {
      this.createAcorns();
    }

    //Memory Pieces
    this.mems = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

      //Mem pieces, kid, and car sprites
    const otherObjects = forestMap.getObjectLayer('otherObjects')['objects'];
    otherObjects.forEach(otherObject => {
      if (otherObject.name === "mem") {
        const memPie = this.mems.create(otherObject.x, otherObject.y, 'mem_piece');
        memPie.setDepth(-1);
      } else if (otherObject.name === "kid") {
        this.exit = this.physics.add.sprite(otherObject.x, otherObject.y, 'boy_ghost');
        this.exit.setDepth(-1);
        this.exit.setCollideWorldBounds(true);
      } else if (otherObject.name === "car") {
        this.car = this.physics.add.sprite(otherObject.x, otherObject.y, 'car_side');
        this.car.setDepth(-1);
        this.car.setCollideWorldBounds(false);
      }
    });

    //Memories Collected (Score Display)
    this.updateScore();

    //Items Collected (Inventory Display)
    this.updateInventory();

    //Creates plants
    this.forestPlants = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const plantObjects = forestMap.getObjectLayer('plantSpawn')['objects'];
    plantObjects.forEach(plantObject => {
      const forestPlant = this.forestPlants.create(plantObject.x, plantObject.y, 'shrub');
      forestPlant.setDepth(-1);
      /*if (plantObject.type === "map") {
        this.mapBushX = plantObject.x;
        this.mapBushY = plantObject.y;
      } else if (plantObject.type === "mem") {
        this.memBushX = plantObject.x;
        this.memBushY = plantObject.y;
      }*/
    });

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.forestWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.exit, this.car, this.rock], this.forestWorldLayer);

      //Hits an acorn
    this.physics.add.overlap(this.player.sprite, this.acorns, this.enemyHit, null, this);
    this.physics.world.addCollider(this.acorns, this.forestWorldLayer, this.newAcorn, null, this);
      //Collects a memory piece
    this.physics.add.overlap(this.player.sprite, this.mems, this.collectMem, null, this);

    //INTERACTION
      //With bushes
    this.physics.add.overlap(this.player.sprite, this.forestPlants, this.interactBush, null, this);
      //Exit
    this.kidText = ["Hey there! Are you busy? I need some help.", "You see, there's this event going on in the city, but my parents are too busy to take me there.",
    "I've got a car (don't ask me how), but I can't drive.", "Can you please do me a favor and take me into town?", "You won't be able to come back after you drive me to town..."]
    this.kidCount = 0;

    this.physics.add.overlap(this.player.sprite, this.exit, this.kidInter, null, this);

    //ZONES
      //Tutorial
    this.memoriesText = ["Memories come flooding back to you.", "Flashes of a kid... Your child...cheerful and playful, running around everywhere.",
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

    //COLLECTING MEMORY SOUND
    this.memory_collect = this.sound.add('memory_collect');
    this.memory_collect.volume = .5;
    this.memory_collect.setRate(2);

    //SEARCHING BUSH SOUND
    this.bushFX = this.sound.add('bush');
    this.bushFX.volume = 2.5;

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
    if (!this.nextScene) {
      this.player.update(); 
    }

    if (this.kidtoken) {
      this.acorns.children.each(
        function (b) {
          if (b.y > this.forestWorldLayer.height) {
            this.newAcorn(b);
          }
        }.bind(this)
      );
    } else if (!this.kidtoken) {
      this.acorns.children.each(
        function (b) {
          this.acorns.remove(b, null, true);
        }.bind(this)
      );
    }

    if (this.nextScene) {
      this.player.sprite.setDepth(-2);
      this.exit.setDepth(1);
      this.player.sprite.setVelocityX(200);
      this.exit.setFlipX(true);

      var kidTween = this.tweens.add({
        targets: this.exit,
        x: 8260,
        ease: 'Linear',
        duration: 1600
      });
      kidTween.on("complete", event => {
        this.exit.setVisible(false);
        this.player.getInCar();
        this.car.setVelocityX(150);
      });

      if (this.car.x > this.forestWorldLayer.width+300) {
        this.forestMusic.stop();
        this.scene.start('Race', {new: true});
        return;
      }
    }

    if (this.player.sprite.y > this.forestWorldLayer.height) {
      this.player.destroy();
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
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Interactions
    //Searching the bushes
  interactBush(player, bush) {
    if (this.input.keyboard.checkDown(this.player.keys.x, 5000)) {
        //Items
      /*if (this.bush) {
        if (bush.x == this.memBushX && bush.y == this.memBushY && this.talked == 7) {
          this.bushFX.play();
          this.memory_collect.play();
          this.talked++;

          this.memQ = this.physics.add.sprite(this.memBushX, this.memBushY, 'mem_piece');
          var memTween = this.tweens.add({
            targets: this.memQ,
            allowGravity: false,
            y: this.memBushY-100,
            ease: 'Linear',
            duration: 1500
          });
          memTween.on("complete", event => {
            this.score++;
            this.updateScore();
            this.memQ.destroy();
          });
        } else {*/
          this.bush = false;
          this.bushFX.play();
          this.scene.pause();
          this.player.keys.left.reset();
          this.player.keys.right.reset();
          this.player.keys.up.reset();
          this.player.keys.x.reset();
          this.scene.launch("message", { textArray: ["You didn't find anything in this bush... (Press X to close)"], returning: "Forest" });
        //}
      //}
    }
    this.bush = true;
  }
    //Interacting with the kid NPC
  kidInter(){
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      if (!this.kidTalked) {
        this.kidTalked = true;
        this.scene.pause();
        this.player.keys.left.reset();
        this.player.keys.right.reset();
        this.player.keys.up.reset();
        this.player.keys.x.reset();
        this.scene.launch("message", { textArray: this.kidText, returning: "Forest" });
      } else {
        this.playNextScene();
      }
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Zones
  memories1() {
    if (this.memCheck < 1) {
      this.memDis = this.add
        .text(1040, 830, this.memoriesText[0], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);
      this.memCheck++;
    }
  }

  memories2() {
    if (this.memCheck < 2) {
      this.memDis = this.add
        .text(2220, 100, this.memoriesText[1], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);
      this.memCheck++;
    }
  }

  memories3() {
    if (this.memCheck < 3) {
      this.memDis = this.add
        .text(3310, 895, this.memoriesText[2], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);
      this.memCheck++;
    }
  }

  memories4() {
    if (this.memCheck < 4) {
      this.memDis = this.add
        .text(4840, 400, this.memoriesText[3], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);
      this.memCheck++;
      this.kidtoken = false;
    }
  }

  memories5() {
    if (this.memCheck < 5) {
      this.memDis = this.add
        .text(5950, 450, this.memoriesText[4], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);
      this.memCheck++;
    }
  }

  memories6() {
    if (this.memCheck < 6) {
      this.memDis = this.add
        .text(7350, 300, this.memoriesText[5], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);

      this.memDis = this.add
        .text(7365, 400, this.memoriesText[6], {
          font: "18px monospace",
          backgroundColor: "#000",
          fill: "#ffffff",
          align: "center",
          wordWrap: { width: 400, useAdvancedWrap: true },
          padding: { x: 20, y: 10 }
        })
        .setDepth(-1);
      this.memCheck++;
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Collecting Items
    //Collecting Memory Piece
  collectMem(player, mem_piece) {
    this.memory_collect.play();
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
  //When an acorn hits the platforms
  newAcorn(acorn) {
    if (this.kidtoken) {
      var x = Phaser.Math.Between(-500, 500);

      acorn.setPosition(this.player.sprite.x + x, -10);
      acorn.setVelocity(Phaser.Math.Between(-300, 300), 500);
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Creating falling acorns
  createAcorns(acorn) {
    var x = Phaser.Math.Between(-300, 300);

    var acorn = this.acorns.create(this.player.sprite.x + x, -10, "acorn");
    acorn.setScale(0.05);
    acorn.setDepth(5);
    acorn.setVelocity(Phaser.Math.Between(-500, 500), 500);
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
