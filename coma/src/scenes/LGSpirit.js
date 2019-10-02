/*
    CHARACTER CLASS: NPC-Large Spirit
*/

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

    //TEXT
    //const instructions = "Can you find my scroll?";
    //"Oh no! I'm so lost! Oh, hi there! You look friendly. I lost my map somewhere in the caves. Can you please find it for me? I don't want to get even more lost or get hurt by those cave spirits. They look so angry. Thank you so much!";


  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    const { sprite } = this;

    sprite.anims.play('idle_sp', true);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  interact(xpos, ypos, scroll, talked) {
    const instructions = "Can you find my scroll?";

    if (scroll || talked) {
      //this.scene.hideMessageBox()

      if (scroll) {
        this.msgBox = this.scene.add.text(xpos, ypos, "Thanks!", {
          font: "18px monospace",
          fill: "#fff",
          padding: { x: 20, y: 10 },
          backgroundColor: "#000",
          wordWrap: { width: 150, useAdvancedWrap: true }
        });
      }
      //this.scene.scrolls = false;

    } else {
      this.msgbox = this.scene.add.text(xpos, ypos, instructions, {
        font: "18px monospace",
        fill: "#fff",
        padding: { x: 20, y: 10 },
        backgroundColor: "#000",
        wordWrap: { width: 150, useAdvancedWrap: true }
      });
      //this.scene.talked = true;
    } 
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
