/*
    CHARACTER CLASS: GHOST
*/

export default class Ghost_Player {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor(scene, x, y) {
    this.scene = scene;

    //PLAYER ANIMATIONS
    const anims = scene.anims;
    anims.create({
      key: 'walk',
      frames: anims.generateFrameNumbers('ghost', {start: 1, end: 3}),
      frameRate: 4,
      repeat: 0
    });
    anims.create({
      key: 'idle',
      frames: anims.generateFrameNumbers('ghost', {start: 0, end: 0}),
      frameRate: 10,
      repeat: -1
    });

    //CREATING PLAYER + PHYSICS
    this.sprite = scene.physics.add
      .sprite(x, y, 'ghost', 0)
      .setScale(0.6);



    //KEYS
    const { LEFT, RIGHT, UP, DOWN, X} = Phaser.Input.Keyboard.KeyCodes;
    this.keys = scene.input.keyboard.addKeys({
      left: LEFT,
      right: RIGHT,
      up: UP,
      down: DOWN,
      x: X
    });
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  update() {
    const { keys, sprite } = this;
    const onGround = sprite.body.blocked.down;

    //MOVEMENT KEYS
    if (keys.left.isDown) {
      sprite.setVelocityX(-300);
      sprite.setFlipX(true);
    } else if (keys.right.isDown) {
      sprite.setVelocityX(300);
      sprite.setFlipX(false);
    } else {
      sprite.setVelocityX(0);
    }
      //JUMP
    if (onGround && (keys.up.isDown)) {
      sprite.setVelocityY(-500);
    }

    //INTERACTIONS
    /*if (keys.x.isDown) {

    }*/

    //UPDATING ANIMATIONS
    if (sprite.body.velocity.x !== 0) sprite.anims.play('walk', true);
    else sprite.anims.play('idle', true);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  destroy() {
    this.sprite.setPosition(0, 0);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}
