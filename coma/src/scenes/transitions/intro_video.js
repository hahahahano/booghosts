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

    this.tranVideo = this.add.video(640, 360, 'intro');
    this.tranVideo.setDisplaySize(1280, 720);
    this.tranVideo.play();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    if (!this.tranVideo.isPlaying()) {
      this.scene.start('caves')
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}