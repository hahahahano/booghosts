/*
    CHARACTER CLASS: NPC-Large Spirit
*/
import msgBox from "./msgBox.js";

export default class LGSpirit {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor(scene, x, y) {
    this.scene = scene;

    //PLAYER ANIMATIONS
    const anims = scene.anims;
    anims.create({
      key: 'idle_sp',
      frames: anims.generateFrameNumbers('lg_spirit', {start: 0, end: 2}),
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    //CREATING PLAYER + PHYSICS
    this.sprite = scene.physics.add
      .sprite(x, y, 'lg_spirit', 0)
      .setScale(0.4);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    const { sprite } = this;
    sprite.setFlipX(true);
    sprite.anims.play('idle_sp', true);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  interact(xpos, ypos, scroll, i, score) {
    const instructions = ["Oh no! I'm so lost!","Oh, hi there! You look friendly.", "I lost my map somewhere in the caves. Can you please find it for me?",
    "I last used the map by a bush, so you should probably search those.", "Thank you so much!"]

    if (scroll) {
      if (i === 6) {
        this.msgBox.hideMessageBox();
        this.scene.scrolls = false;
      } else {
        this.msgBox.hideMessageBox();
        this.msgBox = new msgBox(this.scene, "You found it! Thank you so much! Here's something I found while I was lost.");

        this.scene.talked++;
        this.scene.score++;
      }
    } else {
      switch (i)
      {
        case 0:
          this.msgBox = new msgBox(this.scene, instructions[i]);
          break;

        case 1:
          this.msgBox.hideMessageBox();
          this.msgBox = new msgBox(this.scene, instructions[i]);
          break;

        case 2:
          this.msgBox.hideMessageBox();
          this.msgBox = new msgBox(this.scene, instructions[i]);
          break;

        case 3:
          this.msgBox.hideMessageBox();
          this.msgBox = new msgBox(this.scene, instructions[i]);
          break;

        case 4:
          this.msgBox.hideMessageBox();
          this.msgBox = new msgBox(this.scene, instructions[i]);
          break;

        case 5:
          this.msgBox.hideMessageBox();
          break;
      }

      if (i < 5) {
        this.scene.talked++;
      }
    } 
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
