/*
  TRANSITION BETWEEN FOREST AND HOSPITAL - VIDEO
*/
import * as changeScene from '../changeScene.js';

export default class intro_video extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('intro_video');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    //Add change scene event listeners
    changeScene.addSceneEventListeners(this);

    this.X = this.input.keyboard.addKey("X");

    this.tranVideo = this.add.video(640, 360, 'intro');
    this.tranVideo.setDisplaySize(1280, 720);
    this.tranVideo.play();

    this.skip = this.add.text(0, 0, "Press X to skip", {
      font: "18px monospace",
      fill: "#fff",
      align: "center",
      wordWrap: { width: 300, useAdvancedWrap: true },
      padding: { x: 1100, y: 690 }
    });
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    if (!this.tranVideo.isPlaying()) {
      this.scene.start('caves')
    }

    if (this.input.keyboard.checkDown(this.X, 250)) {
      this.tranVideo.stop();
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
