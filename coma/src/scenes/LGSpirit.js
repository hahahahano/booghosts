/*
    CHARACTER CLASS: NPC-Large Spirit
*/

export default class LGSpirit {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor(scene, x, y) {
    this.scene = scene;
    this.msgbox = this.scene.add.text(null, null, null);

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
      if (i >= 10) {
        this.msgbox.destroy();
      } else {
        this.msgbox.destroy();
            
        this.msgbox = this.scene.add.text(xpos, ypos, "You found it! Thank you so much! Here's something I found while I was lost.", {
          font: "18px monospace",
          fill: "#fff",
          padding: { x: 20, y: 10 },
          backgroundColor: "#000",
          wordWrap: { width: 250, useAdvancedWrap: true }
        });
        this.scene.talked += 10;
        this.scene.score++;
      }
    } else {
      switch (i)
      {
        case 0:
          this.msgbox = this.scene.add.text(xpos, ypos, instructions[i], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 250, useAdvancedWrap: true }
          });
          break;

        case 1:
          this.msgbox.destroy();

          this.msgbox = this.scene.add.text(xpos, ypos, instructions[i], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 250, useAdvancedWrap: true }
          });
          break;

          case 2:
          this.msgbox.destroy();
          
          this.msgbox = this.scene.add.text(xpos, ypos, instructions[i], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 250, useAdvancedWrap: true }
          });
          break;

          case 3:
          this.msgbox.destroy();
          
          this.msgbox = this.scene.add.text(xpos, ypos, instructions[i], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 250, useAdvancedWrap: true }
          });
          break;

          case 4:
          this.msgbox.destroy();
          
          this.msgbox = this.scene.add.text(xpos, ypos, instructions[i], {
            font: "18px monospace",
            fill: "#fff",
            padding: { x: 20, y: 10 },
            backgroundColor: "#000",
            wordWrap: { width: 250, useAdvancedWrap: true }
          });
          break;

          case 5:
          this.msgbox.destroy();
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
