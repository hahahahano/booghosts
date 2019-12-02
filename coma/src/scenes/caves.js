/*
  CAVE SCENE
*/
import * as changeScene from './changeScene.js';
import Ghost_Player from "./characters/ghost_player.js";
import LGSpirit from "./characters/LGSpirit.js";

export default class Caves extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('caves');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.mems;
    this.exit;
    this.caveScroll;
    this.cavePlants;

    this.bush = true;
    this.bushFound = false;

    this.inventory = this.registry.get("inventory");

    this.instructBox;
    this.zoneStart;
    this.collectTut = true;
    this.zoneMem;

    this.exitChecked = 0;

    this.lg_spirit;
    this.scrolls = false;
    this.talked = 0;
    this.player;

    this.score = this.registry.get("score");
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

    this.leftStep = this.sound.add('left_step');
    this.leftStep.volume = 2;

    this.rightStep = this.sound.add('right_step');
    this.rightStep.volume = 2;

///////////////////////////////////////////////BACKGROUND AND FOREGROUND///////////////////////////////////////////////////////////////////////////////
    //Background
    const caveBackground = this.add.image(1152, 1536, 'caveBackground');
    this.physics.world.setBounds(0, 0, 2304, 3072);
    caveBackground.setDepth(-2);

    //Particles - Waterfall
    var waterParticles = this.add.particles('caveWaterfall');
    var waterEmitter = waterParticles.createEmitter({
        alpha: { start: 1, end: 0.65, ease: 'Expo.easeOut' },
        lifespan: 5000,
        speedX:{min: -70, max: 70},
        speedY:{min: -100, max:1000},
        scale: {start: 1.25, end: 0},
        blendMode: 'ADD'
    });
    waterEmitter.setPosition(1075, -200);

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
      } /*else if (otherObject.name === "exit") {
        this.exit = this.physics.add.sprite(otherObject.x, otherObject.y, 'exit');
        this.exit.setCollideWorldBounds(true);
      }*/
    });

    //Memories Collected (Score Display)
    this.updateScore();

    //Items Collected (Inventory Display)
    this.updateInventory();

    //Creates plants
    this.cavePlants = this.physics.add.group({
      allowGravity: false,
      immovable: true
    });

    const plantObjects = caveMap.getObjectLayer('plantSpawn')['objects'];
    plantObjects.forEach(plantObject => {
      const cavePlant = this.cavePlants.create(plantObject.x, plantObject.y, 'shrub');
      if (plantObject.type === "map") {
        this.mapBushX = plantObject.x;
        this.mapBushY = plantObject.y;
      } else if (plantObject.type === "mem") {
        this.memBushX = plantObject.x;
        this.memBushY = plantObject.y;
      }
    });

///////////////////////////////////////////////ZONES///////////////////////////////////////////////////////////////////////////////////////////////////
    //Tutorial Zone: Explains the movements
    this.zoneStart = this.add.zone(400, 2500).setSize(200, 200);
    this.physics.world.enable(this.zoneStart);
    this.zoneStart.body.setAllowGravity(false);
    this.zoneStart.body.moves = false;
    //Memory Zone: Explains the memory pieces
    this.zoneMem = this.add.zone(1300, 2500).setSize(500, 200);
    this.physics.world.enable(this.zoneMem);
    this.zoneMem.body.setAllowGravity(false);
    this.zoneMem.body.moves = false;
    //LGSpirit Zone: Prompts player to talk to the large spirit
    this.zoneSpirit = this.add.zone(1800, 2400).setSize(300, 300);
    this.physics.world.enable(this.zoneSpirit);
    this.zoneSpirit.body.setAllowGravity(false);
    this.zoneSpirit.body.moves = false;
    //Exit Zone
    this.exit = this.add.zone(275, 250).setSize(225, 350);
    this.physics.world.enable(this.exit);
    this.exit.body.setAllowGravity(false);
    this.exit.body.moves = false;

    this.arrowDir = this.add
      .text(200, 2350, "Arrow keys to move, UP to jump, X to interact", {
        font: "20px monospace",
        fill: "#ffffff",
        wordWrap: { width: 300, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);

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
              x: 1570,
              ease: 'Linear',
              yoyo: true,
              duration: 2000,
              repeat: -1
            });
            break;

          case 112:
            this.tweens.add({
              targets: smallSp,
              x: 640,
              ease: 'Linear',
              yoyo: true,
              duration: 3500,
              repeat: -1
            });
            break;

          case 124:
            this.tweens.add({
              targets: smallSp,
              x: 1630,
              ease: 'Linear',
              yoyo: true,
              duration: 1500,
              repeat: -1
            });
            break;

          case 114:
            this.tweens.add({
              targets: smallSp,
              x: 20,
              ease: 'Linear',
              yoyo: true,
              duration: 3500,
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
    var spawnPoint = caveMap.findObject("otherObjects", obj => obj.name === "Spawn Point");
    this.x = spawnPoint.x;
    this.y = spawnPoint.y;
    this.player = new Ghost_Player(this, this.x, this.y);
    this.player.sprite.setCollideWorldBounds(true);



    //Cameras
    this.cameras.main.startFollow(this.player.sprite);
    this.cameras.main.setBounds(0, 0, 2304, 2700);

    //Gravity for this scene
    this.physics.world.gravity.y = 700;

///////////////////////////////////////////////COLLISIONS, INTERACTIONS, ZONES/////////////////////////////////////////////////////////////////////////
    //COLLISIONS
    this.caveWorldLayer.setCollisionByProperty({ collides: true });
    this.physics.world.addCollider( [this.player.sprite, this.mems, this.sm_spirits, this.lg_spirit.sprite, /*this.exit*/], this.caveWorldLayer);

      //Hits an enemy
    this.physics.add.overlap(this.player.sprite, this.sm_spirits, this.enemyHit, null, this);
      //Collects a memory piece
    this.physics.add.overlap(this.player.sprite, this.mems, this.collectMem, null, this);

    //INTERACTION
      //With large spirit
    this.physics.add.overlap(this.player.sprite, this.lg_spirit.sprite, this.interactLG, null, this);
      //With bushes
    this.physics.add.overlap(this.player.sprite, this.cavePlants, this.interactBush, null, this);
      //With exit
    this.physics.add.overlap(this.player.sprite, this.exit, this.exitInstruct, null, this);

    //ZONES
      //Tutorial
    this.instructionsText = ["Hey there. I'm glad you're awake. It's me. You. Hahaha. (Press X to continue)", "You should probably explore the area; maybe you'll remember something about yourself.",
    "But be careful; it looks like that small spirit could hurt you."];
    this.inter = true;
    this.physics.add.overlap(this.player.sprite, this.zoneStart, this.instructions, null, this);
      //Memory Pieces
    this.MemsText = ["That looks familiar. (Press X to continue)", "I think if you pick it up, you might remember something about yourself."];
    this.memIntro = true;
    this.physics.add.overlap(this.player.sprite, this.zoneMem, this.memsInstruct, null, this);
      //Large Spirit
    this.spiritText = ["That large spirit looks friendly! And nervous... Maybe you should go talk to him. Remember X allows you to interact with others and objects. (Press X to close)"];
    this.spiritIntro = true;
    this.physics.add.overlap(this.player.sprite, this.zoneSpirit, this.spiritInstruct, null, this);

    if (!this.hospitalCheck) {
      this.scene.launch("message", { textArray: ['I think my body is here. I feel some sort of pull, but I don\'t know which door to go through.', '...There\'s something weird. It feels like there\'s a time limit. I better return to my body fast!'], returning: "Hospital", character: "ghost" });
      this.hospitalCheck = true;
      this.registry.set("hospitalCheck", true);
    }

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    //PLAYS BACKGROUND MUSIC
    this.caveMusic = this.sound.add('cave_music');
    this.caveMusic.volume = .5;
    this.caveMusic.play();

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

    //UI
    const memhud = this.add.image(100, 45, 'mem_ui').setScale(1.25).setAlpha(.75).setScrollFactor(0);
}
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    this.player.update();
    this.lg_spirit.update();

    if (this.nextScene) {
      this.caveMusic.stop();
      this.scene.start('CTFT');
      return;
    }

    if (this.player.sprite.y > this.caveWorldLayer.height) {
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
    //Dialogue with the Large Spirit
  interactLG() {
    if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.lg_spirit.interact(this.scrolls, this.talked, this.score);

      this.plantDirection = this.add
      .text(1800, 2200, "Press X to search the bush", {
        font: "20px monospace",
        fill: "#ffffff",
        align: "center",
        wordWrap: { width: 200, useAdvancedWrap: true },
        padding: { x: 20, y: 10 }
      })
      .setDepth(-1);
    }

    if (this.talked === 6) {
      var index = this.inventory.indexOf("Map");
      if (index > -1) {
        this.inventory.splice(index, 1);
      }

      this.updateInventory();
      this.updateScore();
    }
  }
    //Searching the bushes ****FIX TEXT BOX BOUNDS
  interactBush(player, bush) {
    if (this.input.keyboard.checkDown(this.player.keys.x, 5000) && this.talked >= 3) {
        //Scroll
      if (this.bush) {
        if (bush.x == this.mapBushX && bush.y == this.mapBushY && !this.scrolls) {
          this.bushFX.play();
          this.scrolls = true;
          this.bushFound = true;

          this.caveScroll = this.physics.add.sprite(this.mapBushX, this.mapBushY, 'caveScroll');
          this.player.stopAll();
          var scrollTween = this.tweens.add({
            targets: this.caveScroll,
            allowGravity: false,
            y: this.mapBushY-100,
            ease: 'Linear',
            duration: 1000
          });
          scrollTween.on("complete", event => {
            this.inventory.push("Map");
            this.updateInventory();
            this.caveScroll.destroy();
            this.player.resumeAll();
          });

          this.bush = false;
          this.player.keys.left.reset();
          this.player.keys.right.reset();
          this.player.keys.up.reset();
          this.player.keys.x.reset();
          this.scene.pause();
          this.scene.launch("message", { textArray: ["You found a map! But you can't read it. Maybe it's someone else's. (Press X to close)"], returning: "caves", character: "bush" });
        } else if (bush.x == this.memBushX && bush.y == this.memBushY && this.talked == 7) {
          this.bushFX.play();
          this.memory_collect.play();
          this.talked++;

          this.memQ = this.physics.add.sprite(this.memBushX, this.memBushY, 'mem_piece');
          this.player.stopAll();
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
            this.player.resumeAll();
          });
        } else {
          this.bush = false;
          this.bushFX.play();
          this.player.keys.left.reset();
          this.player.keys.right.reset();
          this.player.keys.up.reset();
          this.player.keys.x.reset();
          this.scene.pause();
          this.scene.launch("message", { textArray: ["You didn't find anything in this bush... (Press X to close)"], returning: "caves", character: "bush" });
        }
      }
    }
    this.bush = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //Zones
    //Tutorial Zone
  instructions(instructBox) {
    if (this.inter) {
      this.inter = false;
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.pause();
      this.scene.launch("message", { textArray: this.instructionsText, returning: "caves", character: "ghost" });
    }
  }
    //Memory Pieces Zone
  memsInstruct(memsBox) {
    if (this.score >= 1) {
      if (this.collectTut) {
        this.collectTut = false;
        this.player.keys.left.reset();
        this.player.keys.right.reset();
        this.player.keys.up.reset();
        this.player.keys.x.reset();
        this.scene.pause();
        this.scene.launch("message", { textArray: ["Whoa. Did you feel that? I felt a hazy memory there. A car. Hm. (Press X to close)"], returning: "caves", character: "ghost" });
      }

    } else{
      if (this.memIntro) {
        this.memIntro = false;
        this.player.keys.left.reset();
        this.player.keys.right.reset();
        this.player.keys.up.reset();
        this.player.keys.x.reset();
        this.scene.pause();
        this.scene.launch("message", { textArray: this.MemsText, player: this.player, returning: "caves", character: "ghost" });
      }
    }
  }
    //Memory Pieces Zone
  spiritInstruct(spiritBox) {
    if (this.spiritIntro) {
      this.spiritIntro = false;
      this.player.keys.left.reset();
      this.player.keys.right.reset();
      this.player.keys.up.reset();
      this.player.keys.x.reset();
      this.scene.pause();
      this.scene.launch("message", { textArray: this.spiritText, player: this.player, returning: "caves", character: "ghost" });
    }
  }
    //Exiting Scene Zone
  exitInstruct() {
    if (this.talked >= 3) {
      if (this.exitChecked == 1 && this.input.keyboard.checkDown(this.player.keys.x, 250)) {
        this.playNextScene();
      } else if (this.exitChecked == 0) {
          this.exitChecked++;
          this.player.keys.left.reset();
          this.player.keys.right.reset();
          this.player.keys.up.reset();
          this.player.keys.x.reset();
          this.scene.pause();
          this.scene.launch("message", { textArray: ["This is the exit. Are you sure you want to leave? (Press X to close, press X again to exit)"], returning: "caves", character: "ghost" });
      }
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
  //Leaving cave triggers next scene
  playNextScene(player, exit) {
    this.nextScene = true;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  //When the player touches an enemy, return to spawn
  enemyHit(player, sm_spirit) {
    this.player.destroy(this.x, this.y - 30);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
