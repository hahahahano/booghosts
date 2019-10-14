/*global Phaser*/
export default class TryAgain extends Phaser.Scene {
  constructor () {
    super('TryAgain');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('try', './CAD/assets/images/tryagain.png');

    this.load.audio('romulus', './CAD/assets/music/romdiprisco_romulus3.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  create (data) {

    //Create the scene
    var menu = this.add.text(this.centerX-100, this.centerY, 'I have died');

    var b1 = this.add.sprite(640, 400, 'try').setInteractive();

    b1.on('pointerover', function (event) {
        this.setTint(0xff0000);
    });

    b1.on('pointerout', function (event) {
        this.clearTint();
    });

    b1.on("pointerup", function (event) {
      this.scene.start('Race', { score: this.score });
      this.sound.stopAll();
    }, this);

    var music = this.sound.add('romulus');
    music.play();


  }

  update (time, delta) {
    // Update the scene
  }
}
