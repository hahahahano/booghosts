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
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    const { sprite } = this;
    sprite.anims.play('idle_sp', true);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  interact(scroll, i, score) {
    const instructions = ["Oh no! I'm so lost! (Press X to continue)","Oh, hi there! You look friendly.", "I lost my map somewhere in the caves. Can you please find it for me?",
    "I last used the map by a bush, so you should probably search those.", "Thank you so much! (Press X to close)"]

    if (scroll) {
      if (i == 6) {
        this.scene.talked++;

        this.scene.player.keys.left.reset();
        this.scene.player.keys.right.reset();
        this.scene.player.keys.up.reset();
        this.scene.player.keys.x.reset();
        this.scene.scene.pause();
        this.scene.scene.launch("message", { textArray: ["You found it! Thank you so much!", "I hid something I found while I was lost in that bush next to me. I think it might be yours."], returning: "caves", character: "large spirit" });
      } else if (i == 7) {
        this.scene.player.keys.left.reset();
        this.scene.player.keys.right.reset();
        this.scene.player.keys.up.reset();
        this.scene.player.keys.x.reset();
        this.scene.scene.pause();
        this.scene.scene.launch("message", { textArray: ["I hid something I found while I was lost in that bush next to me. I think it might be yours."], returning: "caves", character: "large spirit" });
      } else if (i == 8) {
        this.scene.player.keys.left.reset();
        this.scene.player.keys.right.reset();
        this.scene.player.keys.up.reset();
        this.scene.player.keys.x.reset();
        this.scene.scene.pause();
        this.scene.scene.launch("message", { textArray: ["Did you need it? Well, I'm glad that it's back with its owner now."], returning: "caves", character: "large spirit" });
      }
    } else {
      if (i == 0) {
        this.scene.talked = 6;
        this.scene.player.keys.left.reset();
        this.scene.player.keys.right.reset();
        this.scene.player.keys.up.reset();
        this.scene.player.keys.x.reset();
        this.scene.scene.pause();
        this.scene.scene.launch("message", { textArray: instructions, returning: "caves", character: "large spirit" });
      } else if (i == 6) {
        this.scene.player.keys.left.reset();
        this.scene.player.keys.right.reset();
        this.scene.player.keys.up.reset();
        this.scene.player.keys.x.reset();
        this.scene.scene.pause();
        this.scene.scene.launch("message", { textArray: [instructions[3]], returning: "caves", character: "large spirit" });
      }
    }
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
