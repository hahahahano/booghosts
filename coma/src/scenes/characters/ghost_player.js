/*
    CHARACTER CLASS: GHOST
*/

export default class Ghost_Player {
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  constructor(scene, x, y) {
    this.scene = scene;
    this.stopMovement = false;

    //PLAYER ANIMATIONS
    const anims = scene.anims;
    anims.create({
      key: 'walk',
      frames: anims.generateFrameNumbers('ghost', {start: 1, end: 3}),
      frameRate: 5,
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
      .setScale(0.6)
      .setSize(80,190)
      .setOffset(35,10)
      .setMaxVelocity(500, 1000);
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

    if (!this.stopMovement) {
      //MOVEMENT KEYS
      if (keys.left.isDown) {
        sprite.setVelocityX(-300);
        sprite.setFlipX(true);
        //this.leftStep.play();
      } else if (keys.right.isDown) {
        sprite.setVelocityX(300);
        sprite.setFlipX(false);
        //this.rightStep.play();
      } else {
        sprite.setVelocityX(0);
      }
        //JUMP
      if (onGround && (keys.up.isDown)) {
        sprite.setVelocityY(-600);
      }

      //INTERACTIONS
      if (keys.x.isDown) {
      }

      //UPDATING ANIMATIONS
      if (sprite.body.velocity.x !== 0) sprite.anims.play('walk', true);
      else sprite.anims.play('idle', true);
    }
    
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  destroy(x, y) {
    this.scene.cameras.main.shake();
    this.sprite.setVelocityY(0);
    this.sprite.setPosition(x-20, y);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  getInCar(x, y) {
    this.sprite.setVisible(false);
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  stopAll() {
    this.stopMovement = true;
    this.sprite.disableBody();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
  resumeAll() {
    this.stopMovement = false;
    this.sprite.enableBody();
  }
/*****************************************************************************************************************************************************/
/*****************************************************************************************************************************************************/
}