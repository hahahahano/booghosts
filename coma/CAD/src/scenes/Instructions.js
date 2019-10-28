/*
  CAR MINIGAME - INSTRUCTIONS/TRANSITION
*/

export default class Instructions extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('CTFT');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.inventory = data.inventory;
    this.score = data.score;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload () {
    // Preload assets

    //this.load.image('menu', './assets/images/menu.png');
    //this.load.image('buttons', ['./assets/images/playgame.png', './assets/images/playgamehover.png']);

    //this.load.audio('romulus', 'assets/music/romdiprisco_romulus3.mp3');

    //Defining center of scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create (data) {
    const background = this.add.image(1280/2, 720/2, 'ctft');
    const text1 = this.add.image(1280/2, 720/2, 'ctft1');
    const text2 = this.add.image(1280/2, 720/2, 'ctft2');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update (time, delta) {
    var keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    var i = 0;

    if (keyX.isDown){
      this.scene.start('Forest', { inventory: this.inventory, score: this.score });
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
