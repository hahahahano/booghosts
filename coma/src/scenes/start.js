/*global Phaser*/
//import * as ChangeScene from './ChangeScenes.js';
export default class Start extends Phaser.Scene {
  constructor () {
    super('start');
  }

  preload () {
    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event addSceneEventListeners
    //ChangeScene.addSceneEventListeners(this);

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

    //var text1 = this.add.text(this.centerX-90, this.centerY - 100, ' Coma ', { align: "center", fontSize: 50 });
    //var text2 = this.add.text(this.centerX-190, this.centerY, ' By Boo! Ghosts (Team 14) ', { align: "center", fontSize: 25 });
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
        this.scene.start('HosNo');
      }, this
    );
  }

}
