/*
  Messages as a separate scene
*/

export default class messageBox extends Phaser.Scene {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor () {
    super('message');
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  init (data) {
    this.textArray = data.textArray;
    this.returningScene = data.returning;
    this.character = data.character;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  preload() {

  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  create() {
    this.X = this.input.keyboard.addKey("X");

    this.count = 0;

    //Creating text
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
    if (this.count == this.textArray.length) {
      this.msgBox.destroy();
      this.scene.resume(this.returningScene);
      this.scene.stop();
    } else {
      this.message.setText(this.textArray[this.count]);
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  createContainer() {
    const w = 1280 * 0.85;
    const h = 720;

    //Container for the creation of the box and the text
    var msgBox = this.add.container(0, h * 0.875);

    //Creating the box for the textbox
    var boxBack = this.add.image(1280 * 0.5, 28, "caveTestRock");
    boxBack.setDisplaySize(1280, h*0.2);
    boxBack.alpha = (1);

    //PHOTO
    switch (this.character) {
      case "ghost":
        var photo = this.add.image(80, 35, "ghostStill");
        photo.setDisplaySize(h*0.135, h*0.2);
        break;

      case "large spirit":
        var photo = this.add.image(80, 30, "lgSpiritStill");
        photo.setDisplaySize(h*0.175, h*0.18);
        break;

      case "kid":
        var photo = this.add.image(80, 30, "kidStill");
        photo.setDisplaySize(h*0.175, h*0.175);
        break;

      case "bush":
        var photo = this.add.image(80, 30, "shrub");
        photo.setDisplaySize(h*0.175, h*0.135);
        break;
    }

    this.message = this.add.text(h*0.175+20, -20, this.textArray[this.count], {
      font: "18px monospace",
      fill: "#fff",
      wordWrap: { width: w, useAdvancedWrap: true },
      padding: { x: 20, y: 0 }
    });

    msgBox.add(boxBack);
    msgBox.add(photo);
    msgBox.add(this.message);

    this.msgBox = msgBox;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
