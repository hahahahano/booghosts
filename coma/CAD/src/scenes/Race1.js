/*global Phaser*/
export default class Race1 extends Phaser.Scene {
  constructor () {
    super('Race1');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image("tiles1", 'CAD/assets/tilesets/tuxmon-sample.png');
    this.load.tilemapTiledJSON("map1", 'CAD/assets/tilemaps/map1a.json');

    this.load.audio('aralia', 'CAD/assets/music/pranilzaman_burymymind.mp3');
    this.load.image("racer", "CAD/assets/cars/ghost_top.png");
  }

  winner (player) {
    this.sound.stopAll();
    this.scene.start('GameOverScene', { score: this.score });
  }

  loser (player) {
    this.sound.stopAll();
    this.scene.start('TryAgain', { score: this.score });
  }

  create (data) {


    const map = this.make.tilemap({ key: "map1" });

    // Parameters are the name you gave the tileset in Tiled and then the key of the tileset image in
    // Phaser's cache (i.e. the name you used in preload)
    const tileset = map.addTilesetImage("tuxmon-sample", "tiles1");

    // Parameters: layer name (or index) from Tiled, tileset, x, y
    const belowLayer = map.createStaticLayer("belowLayer", tileset, 0, 0);
    const worldLayer = map.createStaticLayer("worldLayer", tileset, 0, 0);
    const finish = map.createStaticLayer("finish", tileset, 0, 0);

    worldLayer.setCollisionByProperty({ collides: true });
    finish.setCollisionByProperty({ collides: true });

    var music = this.sound.add('aralia');
    music.volume = .1;
    music.play();

    // add Player
    this.player1 = this.physics.add.sprite(645, 3900, 'racer')
    this.player1.setScale(.3);

    // Watch the player and worldLayer for collisions, for the duration of the scene:
    this.physics.add.collider(this.player1, worldLayer, this.loser, null, this);
    this.physics.add.collider(this.player1, finish, this.winner, null, this);

    const camera = this.cameras.main;
    camera.startFollow(this.player1);
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
    const prevVelocity = this.player1.body.velocity.clone();

    // Stop any previous movement from the last frame
    this.player1.body.setVelocity(0);

    // Horizontal movement
    if (this.cursors.left.isDown) {
      this.player1.body.setVelocityX(-speed);
    } else if (this.cursors.right.isDown) {
      this.player1.body.setVelocityX(speed);
    }

    // Vertical movement
    if (this.cursors.up.isDown) {
      this.player1.body.setVelocityY(-speed);
    } else if (this.cursors.down.isDown) {
      this.player1.body.setVelocityY(speed);
    }

    // Normalize and scale the velocity so that player can't move faster along a diagonal
    this.player1.body.velocity.normalize().scale(speed);

    // Update the animation last and give left/right animations precedence over up/down animations
    if (this.cursors.left.isDown) {
      this.player1.body.rotation = -15;
    } else if (this.cursors.right.isDown) {
      this.player1.body.rotation = 15;
    } else {
      this.player1.body.rotation = 0;
    }

  }
}
