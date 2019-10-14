/*global Phaser*/
export default class Winner extends Phaser.Scene {
  constructor () {
    super('winner');
  }

  init (data) {
    this.player = data.player;
    this.inventory = data.inventory;
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('winner', './assets/images/winner.png');
    this.load.image('again', './assets/images/playagain.png');

    this.load.audio('romulus', 'assets/music/romdiprisco_romulus3.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  create (data) {

    //Create the scene
    var menu = this.add.image(this.centerX, this.centerY, 'winner');

    var b1 = this.add.sprite(640, 400, 'again').setInteractive();

    b1.on('pointerover', function (event) {
        this.setTint(0xff0000);
    });

    b1.on('pointerout', function (event) {
        this.clearTint();
    });

    b1.on("pointerup", function (event) {
      this.scene.start('Instructions', { player: this.player, inventory: this.inventory, score: this.score });

    }, this);

    var music = this.sound.add('romulus');
    music.play();


  }

  update (time, delta) {
    // Update the scene
  }
}
