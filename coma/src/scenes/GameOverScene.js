/*global Phaser*/
//import * as ChangeScene from './ChangeScenes.js';
export default class GameOverScene extends Phaser.Scene {
  constructor () {
    super('GameOverScene');
  }

  init (data) {
    // Initialization code goes here
    this.score = data.score;
  }

  preload () {
    // Preload assets

    // Declare variables for center of the scene
    this.centerX = this.cameras.main.width / 2;
    this.centerY = this.cameras.main.height / 2;
  }

  create (data) {
    //Add event addSceneEventListeners
    //ChangeScene.addSceneEventListeners(this);

    //Create Scene
    var text = this.add.text(this.centerX -100, this.centerY, 'Beta Over:');
    var score = this.add.text(this.centerX-150, this.centerY +25, 'Meme-ories Collected: '+this.score);
  }

  update (time, delta) {
    // Update the scene
  }
}
