/*
    OBJECT CLASS: Message Box
*/

export default class msgBox {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor(scene, textArray/*, len*/) {
    this.scene = scene;
    this.text = textArray;
    this.count = 0;
    //this.len = len;

    this.messageBox(this.text/*, this.len*/);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    /*if (this.input.keyboard.checkDown(this.player.keys.x, 250)) {
      this.count ++;
      this.messageBox(this.text, this.len);
    }*/
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  messageBox(textArray, len) {
    this.showMessageBox(textArray, len);
    /*if (this.msgBox) {
      this.hideMessageBox();
    }
    
    this.showMessageBox(this.text[this.count]);*/
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  showMessageBox(text, w = 1280 * 0.9, h = 720 * .8) {
    //Container for the creation of the box and the text
    var msgBox = this.scene.add.container(0, 720*0.8);
    
    //Creating the box for the textbox
    var boxBack = this.scene.add.image(1280 * 0.5, 720 * .1, "caveTestRock");
    boxBack.setDisplaySize(1280, 720*0.2);
    //var boxFrame = this.scene.add.sprite(0, 0, "boxFrame");

    //Creating text
    var message = this.scene.add.text(0, 0, text, {
      font: "18px monospace",
      fill: "#fff",
      wordWrap: { width: w, useAdvancedWrap: true },
      padding: { x: 20, y: 20 }
    });

    msgBox.add(boxBack);
    msgBox.add(message);

    msgBox.setScrollFactor(0);

    this.msgBox = msgBox;
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  hideMessageBox() {
    this.msgBox.destroy();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}