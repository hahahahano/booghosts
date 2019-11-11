/*
  CAR MINIGAME - Pop up instructions
*/

export default class RacePopup extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('RacePopup');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload () {
    this.load.image('caveTestRock', '../assets/sprites/test_rock.png');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create (data) {
    this.carPlayer;

    this.X = this.input.keyboard.addKey("X");

    this.count = 0;

    //Creating text
    this.raceInstructions = ["Thank you so much for driving me to the city.", "I'm not sure which way to go, but I know it's up north.", "Also please be careful and don't drive off road."];
    this.createContainer();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    var isDown = this.input.keyboard.checkDown(this.X, 250);
    if (isDown) {
      this.count++;
      this.updateInteraction();
    }
  }

  updateInteraction() {
    if (this.count == this.raceInstructions.length) {
      this.msgBox.destroy();
      this.scene.resume("Race");
      this.scene.stop();
    } else {
      this.message.setText(this.raceInstructions[this.count]);
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  createContainer() {
    const w = 1280;
    const h = 720;
    const x = w/4;
    const y = h/4;

    //Container for the creation of the box and the text
    var msgBox = this.add.container(x, y);

    //Creating the box for the textbox
    var boxBack = this.add.image(x, y, "caveTestRock");
    boxBack.setDisplaySize(w/2, h/2);
    boxBack.alpha = (1);
    //var boxFrame = this.scene.add.sprite(0, 0, "boxFrame");

    this.message = this.add.text(0, 0, this.raceInstructions[this.count], {
      font: "18px monospace",
      fill: "#fff",
      wordWrap: { width: w, useAdvancedWrap: true },
      padding: { x: 20, y: 20 }
    });

    msgBox.add(boxBack);
    msgBox.add(this.message);

    this.msgBox = msgBox;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
