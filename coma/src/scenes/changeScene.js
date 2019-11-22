export { addSceneEventListeners };

function addSceneEventListeners (that) {
  that.input.keyboard.on(
    "keydown_ONE",
      function () {
        that.scene.start('caves');
      }
  );

  that.input.keyboard.on(
    "keydown_TWO",
      function () {
        that.scene.start('Forest');
      }
  );

  that.input.keyboard.on(
    "keydown_THREE",
      function () {
        that.scene.start('Race');
      }
  );

  that.input.keyboard.on(
    "keydown_FOUR",
      function () {
        that.scene.start('Hospital');
      }
  );

  that.input.keyboard.on(
    "keydown_FIVE",
      function () {
        that.scene.start('hoscoldkid');
      }
  );

  that.input.keyboard.on(
    "keydown_SIX",
      function () {
        that.scene.start('hoshotkid');
      }
  );

  that.input.keyboard.on(
    "keydown_SEVEN",
      function () {
        that.scene.start('HosNo');
      }
  );

  that.input.keyboard.on(
    "keydown_EIGHT",
      function () {
        that.scene.start('hoscoldadult');
      }
  );

  that.input.keyboard.on(
    "keydown_NINE",
      function () {
        that.scene.start('hoshotadult');
      }
  );

  that.input.keyboard.on(
    "keydown_ZERO",
      function () {
        that.scene.start('HosYes');
      }
  );

  that.input.keyboard.on(
    "keydown_ESC",
      function () {
        that.scene.start('start');
      }
  );

  that.input.keyboard.on(
    "keydown_Q",
      function () {
        that.scene.start('intro_video');
      }
  );

  that.input.keyboard.on(
    "keydown_W",
      function () {
        that.scene.start('fth_video');
      }
  );
}
