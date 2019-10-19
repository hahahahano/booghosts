/*global Phaser*/

export default {
  type: Phaser.AUTO,
  parent: 'phaser-example',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
  width: 1280,
  height: 720,
  pixelArt: false,
  physics: {
    default: 'arcade',
    arcade: {
        debug: false
    }
  },
};