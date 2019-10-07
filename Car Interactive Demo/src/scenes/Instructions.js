/*global Phaser*/
export default class Instructions extends Phaser.Scene {
  constructor () {
    super('Instructions');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.image('instructions', './assets/images/instructions.png');
    this.load.image('buttons', ['./assets/images/playgame.png', './assets/images/playgamehover.png']);

    this.load.audio('romulus', 'assets/music/romdiprisco_romulus3.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {

    //Create the scene
    var menu = this.add.image(this.centerX, this.centerY, 'instructions');

    var b1 = this.add.sprite(640, 500, 'buttons').setInteractive();

    b1.on('pointerover', function (event) {
        this.setTint(0xff0000);
    });

    b1.on('pointerout', function (event) {
        this.clearTint();
    });

    b1.on("pointerup", function (event) {
      this.scene.start('Race1');
      this.sound.stopAll();
    }, this);

    var music = this.sound.add('romulus');


  }

  update (time, delta) {
    // Update the scene
  }
}
