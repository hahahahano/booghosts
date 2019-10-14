/*global Phaser*/
export default class Instructions extends Phaser.Scene {
  constructor () {
    super('CarMiniGame');
  }

  init (data) {
    this.player = data.player;
    this.inventory = data.inventory;
    this.score = data.score;
  }

  preload () {
    // Preload assets

    // this.load.image('menu', './assets/images/menu.png');
    // this.load.image('buttons', ['./assets/images/playgame.png', './assets/images/playgamehover.png']);

    // this.load.audio('romulus', 'assets/music/romdiprisco_romulus3.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }


  create (data) {

    //Create the scene
    const background = this.add.image(1280/2, 720/2, 'bg');
    const text1 = this.add.image(1280/2, 720/2, 't1');
    const text2 = this.add.image(1280/2, 720/2, 't2');


  }

  update (time, delta) {
    var keyX = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.X);
    var i = 0;


    if (keyX.isDown){
      this.scene.start('Forest', { player: this.player, inventory: this.inventory, score: this.score });
    }


    // Update the scene
  }
}
