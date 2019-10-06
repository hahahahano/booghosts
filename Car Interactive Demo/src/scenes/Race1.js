/*global Phaser*/
export default class Race1 extends Phaser.Scene {
  constructor () {
    super('Race1');
  }


    preload () {
      // Preload assets
      this.load.image("tiles", "./assets/tilesets/tuxmon-sample.png");
      this.load.tilemapTiledJSON("map", "./assets/tilemaps/map1a.json");

      this.load.audio('aralia', 'assets/music/pranilzaman_burymymind.mp3');

      this.load.image("racer", "assets/cars/red_car2.png");

    }

    winner (player) {
      this.sound.stopAll();
      this.scene.start('Winner');
    }

    loser (player) {
      this.sound.stopAll();
      this.scene.start('TryAgain');
    }

    create (data) {
      const map = this.make.tilemap({ key: "map" });

      // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
      // Phaser's cache (i.e. the name you used in preload)
      const tileset = map.addTilesetImage("tuxmon-sample", "tiles");

      // Parameters: layer name (or index) from Tiled, tileset, x, y
      const belowLayer = map.createStaticLayer("belowLayer", tileset, 0, 0);
      const worldLayer = map.createStaticLayer("worldLayer", tileset, 0, 0);
      const finish = map.createStaticLayer("finish", tileset, 0, 0);

      worldLayer.setCollisionByProperty({ collides: true });
      finish.setCollisionByProperty({ collides: true });

      var music = this.sound.add('aralia');
      music.play();

      // add Player
      this.player = this.physics.add.sprite(645, 3900, 'racer')

      // Watch the player and worldLayer for collisions, for the duration of the scene:
      this.physics.add.collider(this.player, worldLayer, this.loser, null, this);
      this.physics.add.collider(this.player, finish, this.winner, null, this);

      const camera = this.cameras.main;
      camera.startFollow(this.player);
      camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


      this.cursors = this.input.keyboard.createCursorKeys();


      // collision debug
      /*
      const debugGraphics = this.add.graphics().setAlpha(0.75);
      worldLayer.renderDebug(debugGraphics, {
        tileColor: null, // Color of non-colliding tiles
        collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255), // Color of colliding tiles
        faceColor: new Phaser.Display.Color(40, 39, 37, 255) // Color of colliding face edges
      });
      */
    }

    update (time, delta) {
      const speed = 175;
      const prevVelocity = this.player.body.velocity.clone();

      // Stop any previous movement from the last frame
      this.player.body.setVelocity(0);


      // Horizontal movement
      if (this.cursors.left.isDown) {
        this.player.body.setVelocityX(-speed);
      } else if (this.cursors.right.isDown) {
        this.player.body.setVelocityX(speed);
      }

      // Vertical movement
      if (this.cursors.up.isDown) {
        this.player.body.setVelocityY(-speed);
      } else if (this.cursors.down.isDown) {
        this.player.body.setVelocityY(speed);
      }

      // Normalize and scale the velocity so that player can't move faster along a diagonal
      this.player.body.velocity.normalize().scale(speed);

      // Update the animation last and give left/right animations precedence over up/down animations
      if (this.cursors.left.isDown) {
        this.player.body.rotation = -15;
      } else if (this.cursors.right.isDown) {
        this.player.body.rotation = 15;
      } else {
        this.player.body.rotation = 0;
      }

    }
  }
