/*
  START PAGE
*/
import * as changeScene from './changeScene.js';

export default class Start extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('start');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload () {
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create (data) {
    //Add change scene event listeners
    changeScene.addSceneEventListeners(this);

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

    const title = this.add.image(this.centerX, this.centerY, 'titlepage');
    var b1 = this.add.sprite(this.centerX,this.centerY + 175, 'playbutton', 0).setInteractive();
    b1.setScale(.75);
    b1.setFrame(0);
    b1.on('pointerover', function() {
      this.setFrame(1);
      sound.play('low');
    });

    b1.on('pointerout', function() {
      this.setFrame(0);
    });

    b1.on("pointerup", function() {
        sound.play('high');
        //this.scene.start('Hospital')
        //this.forestScene = false;
        this.scene.start('intro_video');
      }, this
    );
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
