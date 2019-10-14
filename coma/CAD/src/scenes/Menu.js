/*global Phaser*/
export default class Menu extends Phaser.Scene {
  constructor () {
    super('Menu');
  }

  init (data) {
    this.player = data.player;
    this.inventory = data.inventory;
    this.score = data.score;
  }

  preload () {
    // Preload assets
    this.load.image('bg', '../assets/images/cave_to_forest_transition.jpg')
    // this.load.image('menu', './assets/images/menu.png');
    // this.load.image('buttons', ['./assets/images/playgame.png', './assets/images/playgamehover.png']);

    // this.load.audio('romulus', 'assets/music/romdiprisco_romulus3.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;

  }

  create (data) {

    //Create the scene
    const background = this.add.image(0, 0, 'background');

    var b1 = this.add.sprite(640, 400, 'buttons').setInteractive();

    b1.on('pointerover', function (event) {
        this.setTint(0xff0000);
    });

    b1.on('pointerout', function (event) {
        this.clearTint();
    });

    b1.on("pointerup", function (event) {
      this.scene.start('Instructions', { player: this.player, inventory: this.inventory, score: this.score });

    }, this);

    // var music = this.sound.add('romulus');
    // music.play();


  }

  update (time, delta) {
    // Update the scene
  }
}
