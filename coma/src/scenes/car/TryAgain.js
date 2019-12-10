/*
  CAR MINIGAME - TRY AGAIN
*/

export default class TryAgain extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('TryAgain');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload () {
    //Defining center of scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create (data) {
    this.X = this.input.keyboard.addKey("X");

    var deadText = this.add.text(this.centerX-80, this.centerY-50, 'You hit something!');

    var tryAgainButt = this.add.sprite(640, 400, 'try').setInteractive();

    tryAgainButt.on(('pointerover'), function (event) {
        this.setTint(0xff0000);
    });
    tryAgainButt.on('pointerout', function (event) {
        this.clearTint();
    });
    tryAgainButt.on("pointerup", function (event) {
      this.scene.start('Race', { new: false });
      this.sound.stopAll();
    }, this);

///////////////////////////////////////////////SOUNDS//////////////////////////////////////////////////////////////////////////////////////////////////
    var music = this.sound.add('romulus');
    music.volume = 0.05;
    music.play();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update (time, delta) {
    if (this.input.keyboard.checkDown(this.X, 250)) {
      this.scene.start('Race', { new: false });
      this.sound.stopAll();
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
