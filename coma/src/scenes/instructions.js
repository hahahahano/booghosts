
import msgBox from "../msgBox.js";

export default class instructions extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor() {
    super('caves_instructions');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
	create() {
    //this.instructBox = new msgBox(this, this.instructionsText, this.instructionsText.length);
    //this.player.sprite.immovable();
    this.instructionsText = ["Hey there. I'm glad you're awake. It's me. You. Hahaha. (Press X)", "You can move around with the arrow keys and interact with X.",
    "You should probably explore the area; maybe you'll remember something about yourself.", "But be careful; it looks like that small spirit could hurt you."];
    this.inter = 0;
    
    switch (this.inter)
      {
        case 0:
          this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
          this.inter++;
          break;

        case 1:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
            this.inter++;
            break;
          }

        case 2:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
            this.inter++;
            break;
          }

        case 3:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.instructBox = new msgBox(this, this.instructionsText[this.inter]);
            this.inter++;
            break;
          }

        case 4:
          if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
            this.instructBox.hideMessageBox();
            this.resume('caves');
      			this.stop();
            break;
          }
      }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}