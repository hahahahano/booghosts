/*global Phaser*/
//import * as ChangeScene from './ChangeScenes.js';
export default class start extends Phaser.Scene {
  constructor () {
    super('start');
  }

  init (data) {
    // Initialization code goes here
  }

  preload () {
    // Preload assets
    this.load.spritesheet('buttons', './UI-Elements/PlayButton.png',{
      frameHeight: 1000,
      frameWidth: 2000
    });

    this.load.audio('pops', './assets/sounds/buttonPops.mp3');

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event addSceneEventListeners
    //ChangeScene.addSceneEventListeners(this);
    //Create the scene
    var sound = this.sound.add('pops');
    sound.addMarker({
      name: 'low',
      start: 0.15,
      duration: 0.5
    });
    sound.addMarker({
      name: 'high',
      start: 1.1,
      duration: 1.5
    });
    var text = this.add.text(this.centerX -150, this.centerY - 100, ' Help Drinko Get 12 Drinks to his buddies');


    var b1 = this.add.sprite(this.centerX,this.centerY, 'buttons', 0).setInteractive();
    b1.setScale(.5)
    b1.on('pointerover', function(){
      this.setFrame(0)
      sound.play('low');
    });

    b1.on('pointerout', function(){
      this.setFrame(0);
    });

    b1.on("pointerup", function(){
      sound.play('high');
      this.scene.start('caves');
    }, this
  );



  }

  update (time, delta) {
    // Update the scene
  }
}
