/*global Phaser*/
export default class Instructions extends Phaser.Scene {
  constructor () {
    super('Instructions');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('instructions', './CAD/assets/images/instructions.png');
    this.load.image('buttons1', ['./CAD/assets/images/playgame.png', './CAD/assets/images/playgamehover.png']);

    this.load.audio('romulus', './CAD/assets/music/romdiprisco_romulus3.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {

    //Create the scene
    var menu = this.add.text(this.centerX-50, this.centerY+100, 'where do i go?');

    var b1 = this.add.sprite(640, 500, 'buttons1').setInteractive();

    b1.on('pointerover', function (event) {
        this.setTint(0xff0000);
    });

    b1.on('pointerout', function (event) {
        this.clearTint();
    });

    b1.on("pointerup", function (event) {
      this.scene.start('Race1', { score: this.score });
      this.sound.stopAll();
    }, this);

    var music = this.sound.add('romulus');


  }

  update (time, delta) {
    // Update the scene
  }
}
